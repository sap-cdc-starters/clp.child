// import logo from "./logo.svg";
import React, {useEffect} from "react";
import "./index.css";
import "../styles/globals.css";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import {authMachine, AuthService} from "../machines/authMachine";
// import {Hash, Router, useNavigate} from "react-router";
// import { HashRouter as  Router} from "react-router-dom";

import {useActor, useInterpret, useMachine, useSelector} from "@xstate/react";
import {AnyState, State} from "xstate";
import {Box, Container, createTheme, responsiveFontSizes, Snackbar, StyledEngineProvider, Theme} from "@mui/material";
import {SnackbarContext, snackbarMachine} from "../machines/snackbarMachine";
import AlertBar from "../components/AlertBar";
import {withGigya} from "../machines/withGigya";
import {notificationMachine} from "../machines/notificationsMachine";
import ProfileContainer from "../containers/ProfileContainer";
import EventsContainer from "../containers/ActionsContainer";
import {useInterpretWithLocalStorage} from "../machines/withLocalStorage";
import { RouteComponentProps ,Router} from "@reach/router";
import {makeStyles, ThemeProvider } from "@mui/styles";
import NotificationsContainer from "../containers/NotificationsContainer";


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


    const authService = useInterpret(() => withGigya(authMachine));
    // const [,sendAuth , authService] = useMachine(()=>withGigya(authMachine));
    //
    //  const [, , authService] = useMachine(authMachineWithGigya, {
    //      state: state
    //   });

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

    // @ts-ignore
    // @ts-ignore
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
                        <PrivateRoute default as={ProfileContainer} path={"/"} authService={authService}/>
                        <SignIn path={"#/signin"} authService={authService}/>
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


}

function LoginRoute({authService}: { authService: AuthService }) {
    const [state] = useActor(authService)
    switch (true) {
        case state.matches('login.signup'):
            return <SignUp authService={authService}/>
        default:
            return <SignIn authService={authService}/>
    }


}

function PrivateRoute({authService, as: Comp, ...props}: Props) {
    const [state, send] = useActor(authService);
    useEffect(() => {
        if (state.matches('unauthorized')) {
            send('LOGIN')
        }
    }, [state]);

    switch (true) {
        case state == undefined:
            return <LoginRoute authService={authService}/>;

        case state.matches('login'):
            return <LoginRoute authService={authService}/>

        case state.matches('reauth'):
            return <SignIn authService={authService}/>
        default:
            return <Comp {...props} authService={authService}/>;
    }


}


export default App;
