import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import Types from "./config/di/types"
import { container } from "./config/di/container"
import { Messaging, MessageRepository } from "./config/interfaces"
import Messager from "./services/pubnub.service"
import { Channel, UserOrgansisation, Message } from "./entity"

const dotenv = require("dotenv")

dotenv.config()

const messageRepo = container.get<MessageRepository>(Types.MessageRepository)


console.log(process.env.JWT_SECRET)




let messaging: Messaging

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    if (!messaging) {

      const getAllChannels = (async () => {
        let userChannels: Channel[] | string[] = await getRepository(Channel).find()
        userChannels = userChannels.map(channel => channel.chatId)
        let userOrgs: UserOrgansisation[] | string[] = await getRepository(UserOrgansisation).find()
        userOrgs = userOrgs.map(userOrg => userOrg.chatId)

        return Promise.resolve([...userOrgs, ...userChannels])
      })




      messaging = new Messager(getAllChannels)


      messaging.events.on("new_message", (data) => {
        console.log(data)
        messageRepo.saveMessage(data)
      })
    }
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(6090, () => {
      console.log("Server started on port 3000!");
    });
  })
  .catch(error => console.log(error));
