import * as EventEmitter from "events"
import { Message as Messages, UserOrgansisation } from "../entity"


export type Message = {
    from: string, // Sender address
    to: string,         // List of recipients
    subject: string, // Subject line
    text: string
};

type MessagePayload = {
    channel: string,
    subscription: string | null,
    actualChannel: string | null,
    subscribedChannel: string,
    timetoken: string,
    publisher: string,
    message: { text: string, timestamp: string, id: number }
}
export interface Mail {
    sendMail(message: Message): Promise<any>
}
export interface MessageRepository {
    saveMessage: (payload: MessagePayload) => Promise<Messages>
    findMessages: (whereClause: { orgUser: UserOrgansisation, channelIds: string[] }) => Promise<{ channelMessages: Messages[], directMessages: Messages[] }>
}
export interface Messaging {
    addChannel: (newChannels: string | string[]) => void
    subscribe: (channels: string[]) => void
    events: EventEmitter
}