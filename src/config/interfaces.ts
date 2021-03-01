
export type Message = {
    from: string, // Sender address
    to: string,         // List of recipients
    subject: string, // Subject line
    text: string
};
export interface Mail {
    sendMail(message: Message): Promise<any>
}