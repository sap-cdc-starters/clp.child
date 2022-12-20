import React, { createContext, useContext, lazy } from "react";

import { ServicesProps } from "./services";
// import { LoggerConsumer, LoggerProvider } from "../logger/context";
// import { SnackbarConsumer, SnackbarProvider } from "../snakbar/context";
import { LoggerContext, useLogger } from "../logger/context/context";
import { AuthProvider } from "../auth/context/provider";
import { AuthContext, useAuth } from "../auth/context/context";
import { SnackbarProivderContext, SnackbarProvider } from "../snakbar";
import { LoggerProvider } from "../logger/context/provider";
import { useSnackbar } from "../snakbar/context/context";

// import { AuthConsumer, AuthProvider } from "../auth/context";

export const ServicesContext = createContext<ServicesProps>(
  {} as ServicesProps
);

export default function ServicesProvider({
  children,
}: React.PropsWithChildren) {
  //   const notificationsService = useLogger();
  //   const authService = useAuth();
  //   const snackbarService = useSnackbar();

  return (
    <LoggerProvider>
      <SnackbarProvider>
        <AuthProvider>
            <ServicesContainer >
                {children}
            </ServicesContainer>
          {/* <LoggerContext.Consumer>
            {(notificationsService) => (
              <SnackbarProivderContext.Consumer>
                {(snackbarService) => (
                  <AuthContext.Consumer>
                    {(authService) => (
                      <ServicesContext.Provider
                        value={{
                          authService,
                          notificationsService,
                          snackbarService,
                        }}
                      >
                        {children}
                      </ServicesContext.Provider>
                    )}
                  </AuthContext.Consumer>
                )}
              </SnackbarProivderContext.Consumer>
            )}
          </LoggerContext.Consumer> */}
        </AuthProvider>
      </SnackbarProvider>
    </LoggerProvider>
  );
}

export  function ServicesContainer({
  children,
}: React.PropsWithChildren) {
  const notificationsService = useLogger();
  const authService = useAuth();
  const snackbarService = useSnackbar();

  return (
    <ServicesContext.Provider
      value={{
        authService,
        notificationsService,
        snackbarService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}
export const useServices = () => useContext(ServicesContext);
