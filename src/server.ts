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

    //Set all routes from routes folder
    this.app.use("/", routes);
    this.handle404s()


  }

  start() {
    this.app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  }

  handle404s = () => {
    this.app.use(function (req, res, next) {
      res.status(404);

      // respond with html page
      if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
      }

      // respond with json
      if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
      }

      // default to plain-text. send()
      res.type('txt').send('Not found');
    });
  }

}

export default App