import React from "react";
import {
  AnyState,
  PayloadSender
} from "xstate";
import {
  Button,
  Typography,
  AppBar,
  Box,
  responsiveFontSizes,

  useTheme,
  Icon,
  Toolbar,
} from "@mui/material";
import { AuthService } from "../machines/authMachine";
import { useActor } from "@xstate/react";
import favicon from "../images/favicon.png";
import { AppState } from "../components/AppState";

export interface Props {
  authService: AuthService;
}

const EventsContainer: React.FC<Props> = ({ authService }) => {
  const [authState] = useActor(authService);

  const sendEvent = authService.send;
//   const them = useTheme();
//   const theme = responsiveFontSizes(them);

  return (
    // <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar color="transparent" variant={"outlined"} position="fixed">
            {/* <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}> */}
            <Toolbar>
              <Typography variant="h5">SSO Login</Typography>
              <Icon sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
                <img src={favicon} />
              </Icon>

              {authState.nextEvents
                .filter(
                  (event) =>
                    !event.startsWith("done.") && !event.startsWith("error.")
                )
                .map((event) => {
                  return (
                    <Event
                      key={event}
                      state={authState}
                      send={sendEvent}
                      type={event}
                    />
                  );
                })}

              <AppState service={authService} />
            </Toolbar>
          </AppBar>
        </Box>
  );
};

export const Event = (props: {
  type: string;
  state: AnyState;
  send: PayloadSender<any>;
}) => {

  const { state, send, type } = props;
  const defaultEvent = state.meta?.eventPayloads?.[type] || {};
  // const eventData = {
  //     ...defaultEvent,
  //     ...event,
  //     type: props.children,
  // };

  const them = useTheme();

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
      style={{ margin: 2 }}
    >
      <Typography>
        {type.split(".").map((a, index, array) => (
          <span
            key={index}
            className={`transition-colors py-1 ${index === 0 && "pl-2"} ${
              index === array.length - 1 && "pr-2"
            } ${
              state.nextEvents.includes(type)
                ? them.palette.secondary.contrastText
                : them.palette.primary.main
            }`}
          >
            {a}
            {index !== array.length - 1 && "."}
          </span>
        ))}
      </Typography>
    </Button>
  );
};

export default EventsContainer;