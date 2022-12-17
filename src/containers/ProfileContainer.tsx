import React, {useEffect, useState} from "react";
import {AuthService} from "../machines/authMachine";
import {AnyState} from "xstate";
import {Box, Paper, Typography, Divider} from "@mui/material";
import SessionInfo from "../components/Session";
import Profile from "../components/Profile";
import { useActor } from "@xstate/react";
 

const stackItem={
    flexShrink: 1
};

export interface ProfileProps   {
    authService: AuthService;

}

const profileSelector = (state: AnyState) => state?.context?.user;

function ProfileContainer({authService}: ProfileProps) {
    const [state, send] = useActor(authService);
    useEffect(() => {
        if (state.matches('unauthorized')) {
            send('CHECK')
        }
    }, [state]);


    return (
    <Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection:"column"
        }}
    >
            <Box sx={stackItem}>
                <Profile authService={authService}/>
            </Box>
            <Box  sx={stackItem}>
                <SessionInfo authService={authService}/>
            </Box>
       

          
        </Box>
    );
}

export default ProfileContainer;
