import React, {useEffect} from "react";
import {AnyEventObject, AnyState, Interpreter, PayloadSender, StateLike, StateNode, TransitionDefinition} from "xstate";
import {
    Button, 
    Typography,
    AppBar,
    Box,
    responsiveFontSizes,
    createTheme,
    ThemeProvider,
    Theme,
    StyledEngineProvider,
    adaptV4Theme,
    useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {AuthService} from "../machines/authMachine";
import {useActor} from "@xstate/react";
import {EventObject, Sender} from "xstate/lib/types";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}




export interface Props {
    authService: AuthService;
}

const EventsContainer: React.FC<Props> = ({authService}) => {
    const [authState] = useActor(authService);

    const sendEvent = authService.send;
     const them= useTheme();
    const theme = responsiveFontSizes(them);

    return (
        // <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6">
        <AppBar color="transparent"  variant={"outlined"}>
            <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
               
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>

                        {authService.machine.events
                            .filter((event) => event && !event.startsWith('xstate.') && !event.endsWith('invocation[0]') && !event.startsWith('done.')&& !event.startsWith('error.'))
                            .filter((event) => !event.startsWith("SSO")  && !event.startsWith("SUBMIT")  && !event.startsWith("REGISTER")&& !event.startsWith("PASSWORD")  && !event.startsWith("SOCIAL"))
                            .map((event) => {
                                return (
                                    <Event key={event} state={authState} send={sendEvent} type={event}/>
                                );
                            })}

                    </ThemeProvider>
                </StyledEngineProvider>
             </Box>
        </AppBar>
    );
};

export const Event = (props: { type: string, state: AnyState, send: PayloadSender<any> }) => {
    // const {flyJson} = useFlyPane(); 

    const {state, send, type} = props;
    const defaultEvent = state.meta?.eventPayloads?.[type] || {};
    // const eventData = {
    //     ...defaultEvent,
    //     ...event,
    //     type: props.children,
    // };

    const them= useTheme();

    return (
        <Button
            onClick={() => {
                // flyJson(eventData, eventData.Type);
                send({
                    ...defaultEvent,
                    // ...event,
                    type: type,
                });
            }}
            // To override prose
            style={{margin: 2}}
        >     
      <Typography   >
        {type.split('.').map((a, index, array) => (
            <span
                key={index}
                className={`transition-colors py-1 ${index === 0 && 'pl-2'} ${
                    index === array.length - 1 && 'pr-2'
                } ${
                    state.nextEvents.includes(type)
                        ? them.palette.secondary.contrastText:
                        them.palette.primary.main
                        // `bg-yellow-100 text-yellow-800`
                        // : 'bg-gray-100 text-gray-600'
                }`}
            >
          {a}
                {index !== array.length - 1 && '.'}
          </span>
        ))}
      </Typography>
        </Button>


    );
};

export default EventsContainer;
