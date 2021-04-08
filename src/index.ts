import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
const dotenv = require("dotenv")

dotenv.config()

// const messageRepo = container.get<MessageRepository>(Types.MessageRepository)


console.log(process.env.JWT_SECRET)




const PORT = 8040

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {

    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  })
  .catch(error => console.log(error));
