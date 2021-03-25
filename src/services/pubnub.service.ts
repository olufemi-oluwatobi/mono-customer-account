import * as PubNub from "pubnub"
import * as EventEmitter from "events"
import { injectable } from "inversify"

@injectable()
class Messaging {
    private pubnub: PubNub
    private channels: string[]
    public events: EventEmitter
    constructor(getChannels: () => Promise<string[]>) {
        getChannels().then(data => {
            this.channels = data
            this.subscribe(this.channels)
            console.log(data)

        })
        this.events = new EventEmitter()
        this.pubnub = new PubNub({
            subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
            publishKey: process.env.PUBNUB_PUBLISH_KEY,
            uuid: process.env.PUBNUB_UUID
        })

        this.pubnub.addListener({
            message: (e) => this.events.emit("new_message", e)
        })

    }

    addChannel = (newChannels: string | string[]) => {
        if (typeof newChannels === "string") {
            this.channels.push(newChannels)
        }
        else {
            this.channels = [...this.channels, ...newChannels]
        }
        this.subscribe(typeof newChannels === "string" ? [newChannels] : newChannels)
    }

    subscribe = (channels: string[]) => {
        this.pubnub.subscribe({ channels: channels })
    }
}
export default Messaging