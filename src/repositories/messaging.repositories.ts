import { Message as Messages, Channel, UserOrgansisation, Organisation, Message, User, ChannelMembers } from "../entity"
import { getRepository, In } from "typeorm"
import { injectable } from "inversify"
import { relative } from "path"


type MessagePayload = {
    channel: string,
    subscription: string | null,
    actualChannel: string | null,
    subscribedChannel: string,
    timetoken: string,
    publisher: string,
    message: { text: string, timestamp: string, id: number }
}

const CHAT_ROOM_TYPES: ["channel", "support", "direct_message"] = ["channel", "support", "direct_message"]

const messagesSenderType = (channelId: string): "channel" | "support" | "direct_message" => {
    return CHAT_ROOM_TYPES.find(type => channelId.includes(type))
}

@injectable()

class MessageRepository {
    findMessages = async (whereClause: { orgUser: UserOrgansisation, channelIds }) => {
        const { orgUser, channelIds } = whereClause
        const { user, organisation, chatId } = orgUser

        console.log(chatId, organisation, channelIds)
        const messagesRepo = getRepository(Messages)
        let channelMessages: Messages[]
        if (channelIds) {
            channelMessages = await messagesRepo.find({ where: { organisation, user, chatRoomType: "channel", reciepientId: In(channelIds) } })
        }
        console.log("down")
        const directMessages = await messagesRepo.createQueryBuilder("messages").where("organisationId = :orgId", { orgId: organisation.id }).where("reciepientId = :chatId", { chatId }).orWhere("senderId = :chatId", { chatId }).getMany()
        return { channelMessages: channelMessages, directMessages }

    }
    saveMessage = async (payload: MessagePayload) => {
        const { channel: chatRoom, timetoken, publisher, message: { text, timestamp, id } } = payload
        let message = new Message()
        message = Object.assign(message, { text, timestamp, timetoken })
        const messagesRepo = getRepository(Messages)
        const channelRepo = getRepository(Channel)
        const channelMemberRepo = getRepository(ChannelMembers)
        const userOrgRepo = getRepository(UserOrgansisation)
        return userOrgRepo.findOne({ where: { chatId: publisher }, relations: ["user", "organisation"] }).then(async (userOrg) => {
            if (userOrg) {
                message.organisation = userOrg.organisation
                message.sender = userOrg.user
                const messageType = messagesSenderType(chatRoom)
                message.chatRoomType = messageType
                message.reciepientId = chatRoom


                return messagesRepo.save(message).then(data => data)
            }

        })
    }

}

export default MessageRepository
