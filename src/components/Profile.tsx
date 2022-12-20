import React from "react";
import {AuthService} from "../machines/authMachine";
import { useSelector} from "@xstate/react";
import {AnyState} from "xstate";
import {Box, styled, Typography} from "@mui/material";
import Paper from "./styled/Paper";
import Avatar from "./styled/Avatar";
import Form from "./styled/Form";

  
export interface ProfileProps {
    authService: AuthService;

}

const profileSelector = (state: AnyState) => state?.context?.user;

function Profile({authService}: ProfileProps) {
    const {email, loginProvider, nickname, photo} = useSelector(authService, profileSelector) || {};


    return (
        <Paper>
             <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Profile Details
            </Typography>
            <Avatar src={photo} sx={{
                backgroundColor:'secondary.main',
            }} />

            <Form


            >
                <p>
                    Welcome back, <span style={{fontWeight: "bold"}}> {nickname}</span>.
                </p>
                <p>
                    You logged in using the email address:
                    <span style={{fontWeight: "bold"}}> {email}</span>.
                </p>
                {/* Switch statement here based on loginProvider */}
                <p>
                    and logged in using the provider:
                    <span style={{fontWeight: "bold"}}> {loginProvider}</span>.
                </p>

            </Form>


         </Paper>
    );
}

export default Profile;
