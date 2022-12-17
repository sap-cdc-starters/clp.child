import React from "react";
import {AuthService} from "../machines/authMachine";
import { useSelector} from "@xstate/react";
import {AnyState} from "xstate";
import JsonView from "./JsonTreeViewer";
import { Divider, Grid, Stack, TextareaAutosize, Typography} from "@mui/material";
import Paper from "./styled/Paper";


export interface SessionProps {
    authService: AuthService;

}


const jwtSelector = (state: AnyState) => state?.context?.token?.id_token;
const devicesSelector = (state: AnyState) => state?.context?.devices;

function SessionInfo({authService}: SessionProps) {
    const idToken = useSelector(authService, jwtSelector) || {};
    const devices = useSelector(authService, devicesSelector) || {};


    return (
<Stack
  direction="column"
  divider={<Divider orientation="vertical" flexItem />}
  spacing={2}
  sx={{
     width:"100%"

  }}
>

            <Paper  >
                <Typography position={"static"} left="10" component="h2" variant="h6" color="primary" gutterBottom>
                    Id Token
                </Typography>
                {idToken && idToken.details && <JsonView data={idToken.details}/>}
            </Paper>

            <Paper  >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Devices
                </Typography>
                {devices  && <JsonView data={devices}/>}
            </Paper>
            {/* <TextareaAutosize >{idToken.raw}</TextareaAutosize> */}
        </Stack>
    );
}

function decodeJwt(token?: string) {

    return token && token.split && JSON.parse(atob(token.split('.')[1]));

}

export default SessionInfo;
