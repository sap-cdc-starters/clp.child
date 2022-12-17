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
import {SnackbarContext, snackbarMachine, SnackbarService} from "../machines/snackbarMachine";
import AlertBar from "../components/AlertBar";
import {gigyaAuthApiServices} from "../gigya/services";
import {notificationMachine, NotificationsService} from "../machines/notificationsMachine";
import ProfileContainer from "../containers/ProfileContainer";
import EventsContainer from "../containers/ActionsContainer";
import {useInterpretWithLocalStorage} from "../machines/withLocalStorage";
import { BrowserRouter as  Router, Navigate, Outlet, Route, Routes, useRoutes} from "react-router-dom";
import {makeStyles, ThemeProvider } from "@mui/styles";
import NotificationsContainer from "../containers/NotificationsContainer";
import { send } from "xstate/lib/actions";
import { LoadingButton } from "@mui/lab";
import { ErrorBoundary } from "../components/ErrorBoundary";
import JsonView from "../components/JsonTreeViewer";


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
    const [, sendNotification, notificationsService] = useMachine(notificationMachine);

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

    const services= {authService, notificationsService ,snackbarService};
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
                  <AppRoutes {...services} />
                    {/* <Routes location>
                     <Route path="/" element={<PrivateRoute {...services} />} >
                    <Route path="signin" element={ <SignIn   {...services} /> } />
                    <Route path="profile" element={  <ProfileContainer authService={authService}/> } />
                    </Route>
                    </Routes> */}
                </Box>

                <Container fixed maxWidth="sm">
                    <NotificationsContainer authService={authService} notificationsService={notificationsService}/>
                </Container>
            </Box>


            <AlertBar snackbarService={snackbarService}/>
                </ThemeProvider>
            </StyledEngineProvider>
        </div>
    );
};

export interface ServicesProps   {
    authService: AuthService;
    notificationsService: NotificationsService;
    snackbarService: SnackbarService;


}
 

function AppRoutes(props:ServicesProps) {
    let element = useRoutes([
      {
        path: "/",
        element: <AuthStateRoute {...props} />      
      }
   
    ]);
  
    return element;
  }
  

function AuthStateRoute(props: ServicesProps) {
    const {authService} = props;
    const [state, send] = useActor(authService);
    return <div>
       
                {state.matches('login') && <SignIn {...props} />  }
                {state.matches('authorized') && <ProfileContainer {...props} /> }
                {state.matches('unauthorized') && <ProfileContainer {...props} /> }
                {state.matches('loading') && <LoadingButton />  }
                {state.matches('error') && <JsonView data={state.context} />  }

    
    
       <Outlet />
    </div>
    


}


export default App;
