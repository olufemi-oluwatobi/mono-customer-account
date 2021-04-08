import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./api/routes";

const dotenv = require("dotenv")

dotenv.config()

// const messageRepo = container.get<MessageRepository>(Types.MessageRepository)






const PORT = 8040

class App {
  public app: express.Application;
  private port: number
  constructor(port: number) {
    this.port = port
    this.app = express()
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.json());

    this.defaultRoute()

    //Set all routes from routes folder
  
    this.app.use("/", routes);
    this.handle404s()


  }

  defaultRoute(){
    this.app.get('/', function(req, res){
      res.status(200).json({
        success: true,
        version: "1.0.0",
        status: "running",
        service_name:"MONO CORE SERVICE"
      })
    })
  }


  start() {
    this.app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  }

  handle404s = () => {
    this.app.use(function (req, res, next) {
      res.status(404).json({success: false, error: "resource not found"})

    })
  }

}

export default App
