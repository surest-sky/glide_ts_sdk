import {Avatar, Box, Grid, IconButton, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {State, Ws} from "../im/ws";
import {MyDialog} from "./SignDialog";
import {client, IMAccount} from "../im/client";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Chat, PersonSearch} from "@mui/icons-material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {green} from "@mui/material/colors";


export const Bar = withRouter((props: RouteComponentProps) => {

    const [state, setState] = useState(State.CONNECTED)
    const [showDialog, setShowDialog] = useState(false)
    const [uid, setUid] = useState(-1)

    useEffect(() => {
        Ws.addStateListener((s) => {
            setState(s)
        })
    }, [state])

    const changeState = () => {
        if (state === State.CONNECTED) {
            Ws.close()
        } else {
            Ws.connect()
        }
    }

    let s: 'error' | 'action' | 'disabled'
    switch (state) {
        case State.CONNECTED:
            if (client.uid <= 0 && props.location.pathname !== "/") {
                // props.history.push("/")
            }
            s = "disabled"
            break;
        case State.CONNECTING:
            s = "action"
            break;
        case State.CLOSED:
            // if (props.location.pathname !== "/disconnected") {
            //     props.history.push("/disconnected")
            // }
            if (uid !== -1) {
                setUid(-1)
            }
            s = "error"
            break;
    }

    const auth = function (reg: boolean, p: { account: string, password: string }) {
        if (reg) {

        } else {

        }
    }

    let avatar = ""
    let nickname = ""

    const userInfo = client.getCachedUserInfo(uid)
    if (userInfo) {
        avatar = userInfo.Avatar
        nickname = userInfo.Nickname + "\r\n" + userInfo.Uid
    }

    const onExitClick = () => {
        IMAccount.clearAuth()
        props.history.replace("/auth")
    }

    const menu = [
        {
            icon: <Chat color={"action"}/>,
            path: "/im/session",
        },
        {
            icon: <PeopleAltIcon/>,
            path: "/im/friends",
        },
        {
            icon: <PersonSearch/>,
            path: "/im/search",
        },
    ]

    return <Box bgcolor={"primary.dark"} style={{height: "100%"}}>
        <MyDialog open={showDialog} onClose={() => {
            setShowDialog(!showDialog)
        }} onSubmit={auth}/>

        <Grid justifyContent={"center"} container color={"primary.dark"}>

            <Grid container justifyContent={"center"} marginTop={"16px"}>
                <Box mt={2}><Avatar src={avatar}/></Box>
            </Grid>

            <Grid container justifyContent={"center"}>
                <Box m={2}>
                    <Typography align={"center"} variant={"subtitle2"} color={"ghostwhite"}>
                        {nickname} {IMAccount.getUID()}
                    </Typography>
                </Box>
            </Grid>

            {menu.map(item => {
                return <Grid container justifyContent={"center"} key={item.path}>
                    <Link to={item.path}>
                        <IconButton>
                            {item.icon}
                        </IconButton>
                    </Link>
                </Grid>
            })}

            <Grid container justifyContent={"center"}>
                <IconButton onClick={onExitClick}>
                    <ExitToAppIcon/>
                </IconButton>
            </Grid>
        </Grid>
    </Box>
})
