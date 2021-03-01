import { Container } from "inversify"
import "reflect-metadata"
import Mail from "../../services/mail.service"
import Types from "./types"

const container = new Container()
container.bind<Mail>(Types.MailService).to(Mail)

export { container }