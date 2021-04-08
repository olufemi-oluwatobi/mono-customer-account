import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import Server from "./server"
const dotenv = require("dotenv")

dotenv.config()

// const messageRepo = container.get<MessageRepository>(Types.MessageRepository)






const PORT = 8040


//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = new Server(PORT)
    app.start()
  })
  .catch(error => console.log(error));
