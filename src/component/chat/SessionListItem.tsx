import { ListItem, ListItemIcon, Badge, Avatar, ListItemText } from "@mui/material";
import { green } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { Session } from "src/im/session";

export function SessionListItem(props: { chat: Session, selected: boolean, onSelect: (c: Session) => void }) {

    if (props.selected) {
        props.chat.UnreadCount = 0;
    }

    const [chat, setChat] = useState({ obj: props.chat })

    useEffect(() => {
        chat.obj.setSessionUpdateListener(() => {
            console.log("ChatItem", "chat updated")
            if (props.selected) {
                chat.obj.UnreadCount = 0;
            }
            setChat({ obj: chat.obj })
        })
        return () => chat.obj.setSessionUpdateListener(null)
    }, [chat, props.selected])

    const onItemClick = () => {
        props.onSelect(chat.obj)
    }

    let msg = chat.obj.LastMessage
    if (chat.obj.isGroup() || chat.obj.LastMessageSender === 'me') {
        msg = `${chat.obj.LastMessageSender}: ${chat.obj.LastMessage}`
    }

    return <>
        <ListItem button style={{ cursor: "pointer" }} sx={{ bgcolor: 'background.paper' }} onClick={onItemClick} selected={props.selected}>
            <ListItemIcon >
                <Badge badgeContent={chat.obj.UnreadCount} overlap="rectangular" color={"secondary"} >
                    <Avatar variant="rounded" sx={{ bgcolor: green[500] }} src={chat.obj.Avatar} />
                </Badge>
            </ListItemIcon>
            <ListItemText primary={chat.obj.Title} secondary={msg} />
        </ListItem>
    </>
}
