import { Box, Container } from "@mui/material";
import React, { lazy } from "react";
import ActionsContainer from "../containers/ActionsContainer";
import NotificationsContainer from "../containers/NotificationsContainer";
import { useServices } from "../ioc/context";
import { useLogger } from "../logger/context/context";
// const ActionsContainer = lazy(() => import("../containers/ActionsContainer"));
// const ServicesProvider = lazy(() => import("../ioc/context"));
// const NotificationsContainer = lazy(() => import("../containers/NotificationsContainer"));

// const AuthActionsBar =async ():Promise<{default:React.ComponentType<any>}>=>{
//      const {useServices} = await import("../ioc/context");
//     const {authService}= useServices();
//     return {default:()=> <ActionsContainer authService={authService} />}

//  }

// const AppBar = lazy(AuthActionsBar);


// const AppLogger =lazy(async ():Promise<{default:React.ComponentType<any>}>=>{
//     const {useServices} = await import("../ioc/context");

//     const {authService, notificationsService}= useServices();
//     const {useAppLogger, send}= notificationsService;
//     useAppLogger(authService , send );

//    return {default:()=>  <NotificationsContainer notificationsService={notificationsService} />}

// })

export function Layout({ children }: React.PropsWithChildren) {
  const { authService , notificationsService} = useServices();
  return (
      <div>
        <ActionsContainer authService={authService} />

        <Box
          sx={{
            display: "flex",
            flexWrap: "none",
            m: 20,

            alignItems: "left",
          }}
        >
          <Container fixed>{children}</Container>

          <Container fixed maxWidth="sm">
            <NotificationsContainer
              notificationsService={notificationsService}
            />
          </Container>
        </Box>
      </div>
  );
}

export default Layout;
