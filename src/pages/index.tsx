// import logo from "./logo.svg";
import React, {useEffect} from "react";
import "./index.css";
import "../styles/globals.css";
import SignIn from "../components/SignIn";
import {authMachine, AuthService} from "../machines/authMachine";
// import {Hash, Router, useNavigate} from "react-router";
// import { HashRouter as  Router} from "react-router-dom";

import {useActor, useInterpret, useMachine, useSelector} from "@xstate/react";
import {AnyState, State} from "xstate";
import {Box, Container, createTheme, responsiveFontSizes, Snackbar, StyledEngineProvider, Theme} from "@mui/material";
import {SnackbarContext, snackbarMachine} from "../machines/snackbarMachine";
import AlertBar from "../components/AlertBar";
import {gigyaAuthApiServices} from "../gigya/services";
import {notificationMachine, NotificationsService} from "../machines/notificationsMachine";
import ProfileContainer from "../containers/ProfileContainer";
import EventsContainer from "../containers/ActionsContainer";
import {useInterpretWithLocalStorage} from "../machines/withLocalStorage";
import { RouteComponentProps ,Router} from "@reach/router";
import {makeStyles, ThemeProvider } from "@mui/styles";
import NotificationsContainer from "../containers/NotificationsContainer";
import { send } from "xstate/lib/actions";


declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {
    }
}


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
    }
}));
const theme = createTheme({
    palette: {
        // secondary: {
        //     main: '#999'
        // },
        primary: {
            main: '#7a7a7a'
        }

    },

    typography: {
        h5: {
            font: 'Questrial',
            fontStyle: 'lighter',
            fontWeight: 'lighter',
            fontSize: '14px',
            fontFamily: "'Questrial', sans-serif !important"
        },
        button:{
            font: 'Questrial',
            fontStyle: 'lighter',
            fontWeight: 'lighter',
            fontFamily: "'Questrial', sans-serif !important",
            fontSize: '14px',
            opacity: 0.8
        },
        fontFamily: [
            'Questrial',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',

            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});
const App = () => {


    const authService = useInterpret(() =>authMachine.withConfig({
        services: gigyaAuthApiServices,
        actions:{
            onUnauthorizedEntry:send({
                type:"LOGIN"
            })
        }
    }));
;

    const [, sendSnackbar, snackbarService] = useMachine(snackbarMachine);
    const [, sendNotification, notificationService] = useMachine(notificationMachine);

    const showSnackbar = (payload: SnackbarContext) => sendSnackbar({type: "SHOW", ...payload});

    // authService.subscribe(state => {
    //     showSnackbar({message: state.value as string, severity: "info" })
    // })

    useEffect(() => {
        const subscription = authService.subscribe((state: AnyState) => {
            // simple state logging
            console.log(state);
            showSnackbar({message: state.toStrings().reverse()[0], severity: "info"})

        });

        return subscription.unsubscribe;
    }, [authService]);
    const responsiveTheme = responsiveFontSizes(theme);

    return (
        <div>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={responsiveTheme}>

                <EventsContainer authService={authService}/>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'none',
                    m: 20,

                    alignItems: "left"
                }}
            >
                <Box>

                    <Router>
                        <PrivateRoute default as={ProfileContainer} path={"/"} authService={authService} notificationsService={notificationService}/>
                        <SignIn path={"#/signin"} authService={authService} notificationsService={notificationService}/>
                        <ProfileContainer path="#/profile" authService={authService}/>

                    </Router>
                </Box>

                <Container fixed maxWidth="sm">
                    <NotificationsContainer authService={authService} notificationsService={notificationService}/>
                </Container>
            </Box>


            <AlertBar snackbarService={snackbarService}/>
                </ThemeProvider>
            </StyledEngineProvider>
        </div>
    );
};

export interface Props extends RouteComponentProps {
    authService: AuthService;
    as: any;
    notificationsService: NotificationsService


}
 

function PrivateRoute({authService, as: Comp, ...props}: Props) {
    const [state, send] = useActor(authService);
    // useEffect(() => {
    //     if (state.matches('unauthorized')) {
    //         send('LOGIN')
    //     }
    // }, [state]);

    switch (true) {
        case state.matches('login'):
            return <SignIn  {...props} authService={authService}/>

        case state.matches('authorized'):
            return <Comp  {...props} authService={authService}/>
        default:
            return <Comp {...props} authService={authService}/>;
    }


}


export default App;
