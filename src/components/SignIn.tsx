import React from "react";
import {RouteComponentProps, useNavigate} from "@reach/router"

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';
import Container from "@mui/material/Container";
import {useForm} from "react-hook-form";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useMachine, useSelector} from "@xstate/react";
import {AuthService} from "../machines/authMachine";
import {ErrorOutlined} from "@mui/icons-material";
import { Checkbox, MenuItem, Select } from "@mui/material";
 import {loginMachine, LoginSuccessPayload} from "../machines/loginMachine";
import { gigyaLoginApiServices } from "../gigya/services";
 import { useAppLogger } from "../logger";
import { NotificationsService } from "../machines/notificationsMachine";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: theme.spacing(1)
    },
    paperRow: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: theme.spacing(1)
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
    },
}));

export interface SignInProps extends RouteComponentProps {
    authService: AuthService;
    notificationsService: NotificationsService;

}

const loginServiceSelector = (state: any) => state.context;
export default function SignIn({authService, notificationsService}: SignInProps) {
    const classes = useStyles();
    const nevigate= useNavigate();
    const [state, send, service] = useMachine(() => loginMachine.withConfig({
        services: gigyaLoginApiServices,
        actions:{
            onSuccessEntry: (ctx, {token, user}: LoginSuccessPayload) =>{

                nevigate("#/profile")
            }
        }
      
    }));
    useAppLogger(service, notificationsService.send);
    
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            authFlow: "redirect",
            useChildContext: false,
            redirectURL: `${window.location.origin}#/profile`
        }
    });
    const {message} = useSelector(authService, loginServiceSelector);
    const loading=   state.matches("loading");


    // const {loginService} = useSelector(authService, loginServiceSelector);
    const loginService = service;
 

    const handleSSo = async (data: any) => {
        loginService.send({type: 'SSO', ...data});
    };

    const handleGoogleLogin = () => {
        loginService.send({type: 'SOCIAL', provider: "google"});
    };
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form
                        className={classes.form} 
                        onSubmit={handleSubmit(handleSSo)}
                    >
                        <Select
                            variant="outlined" 
                            required
                            fullWidth
                            label="authFlow"
                            type="authFlow"
                            id="authFlow"
                            defaultValue={"redirect"}
                            autoComplete="authFlow"
                            {...register("authFlow", {required: true})}
                        >
                            <MenuItem key={"redirect"} value={"redirect"}>{"redirect"}</MenuItem>
                            <MenuItem key={"popup"} value={"popup"}>{"popup"}</MenuItem>
                        </Select>
                        {errors && errors.authFlow && <span>Please enter a authFlow</span>}
                        <TextField
                            variant="outlined"
                            margin="normal" 
                            fullWidth
                            id="redirectURL"
                            label="redirect URL"
                            autoComplete="redirectURL"
                            autoFocus
                            {...register("redirectURL" )}
                        />
                        {errors && errors.redirectURL && <span>Please enter a valid redirect URL</span>}


                        <Checkbox 
                            aria-label={"useChildContext"}
                            id="useChildContext"
                            autoFocus
                            {...register("useChildContext" )}
                        />
 
                        {message &&  <span><ErrorOutlined /> {message}</span>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={loading}

                        >
                            Sign In With SSO
                        </Button>

                    
                    </form>


                </div>

            <Button
                startIcon={<TwitterIcon/>}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                Sign In With Google
            </Button>
           
          


        </Container>
    );
}
