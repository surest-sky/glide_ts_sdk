import {SessionBean} from "../api/model";
import {ChatMessage} from "./chat_message";
import {IMAccount} from "./account";
import {Message, MessageType} from "./message";
import {Api} from "../api/api";

export class Session {

    public ID: string;
    public Avatar: string;
    public Title: string;
    public UpdateAt: string;
    public LastMessageSender: string;
    public LastMessage: string;
    public UnreadCount: number;
    public Type: number;
    public To: number;

    private messages = new Map<string, ChatMessage>();

    public static fromSessionBean(sb: SessionBean): Session {
        let session = new Session();
        console.log(IMAccount.getUID(), sb.Uid1, sb.Uid2, sb.Uid1 === IMAccount.getUID());
        if (sb.Uid1 === IMAccount.getUID()) {
            session.To = sb.Uid2;
        } else {
            session.To = sb.Uid1;
        }
        session.ID = session.getSID();
        session.Title = session.ID;
        session.UpdateAt = sb.UpdateAt.toString();
        session.LastMessageSender = "-";
        session.LastMessage = '-';
        session.UnreadCount = 0;
        return session;
    }

    public sendTextMessage(msg: string): Promise<ChatMessage> {
        return this.send(msg, MessageType.Text)
            .then(r => {
                return ChatMessage.create(r)
            });
    }

    public setUpdateListener(listener: (session: Session) => void) {

    }

    public setMessageListener(listener: (message: ChatMessage) => void) {

    }

    public sendMessage(message: ChatMessage) {

    }

    public getMessages(): ChatMessage[] {
        return Array.from(this.messages.values());
    }

    public GetLastMessage(): string {
        return this.LastMessage;
    }

    private getSID(): string {

        let lg = IMAccount.getUID();
        let sm = this.To;

        if (lg < sm) {
            let tmp = lg;
            lg = sm;
            sm = tmp;
        }

        return lg + "_" + sm;
    }

    private send(content: string, type: number): Promise<Message> {
        const time = new Date().getSeconds();

        const m: Message = {
            Content: content,
            From: IMAccount.getUID(),
            Mid: "",
            SendAt: time,
            Seq: 0,
            To: this.To,
            Type: type
        }
        const midPromise = Api.getMid()
            .then(mid => {
                m.Mid = mid;
                return m
            });
        return new Promise<Message>((resolve, reject) => {
            midPromise
                .then(m => {

                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}
