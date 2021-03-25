import { Container } from "inversify"
import "reflect-metadata"
import Mail from "../../services/mail.service"
import Messaging from "../../services/pubnub.service"
import { MessageRepository } from "../../repositories"
import Types from "./types"


const container = new Container()
container.bind<Mail>(Types.MailService).to(Mail)
container.bind<Messaging>(Types.MessageService).to(Messaging)
container.bind<MessageRepository>(Types.MessageRepository).to(MessageRepository)
export { container }