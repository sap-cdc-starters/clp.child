import React, { createContext, useContext} from "react";
import {useInterpret} from "@xstate/react";
 import   { LoggerContext, LoggerContextType } from './context'
import { notificationMachine, NotificationsService } from "../../machines/notificationsMachine";

export function LoggerProvider({ children}:React.PropsWithChildren) {
    const loggerService = useInterpret(()=>notificationMachine);
        return  <LoggerContext.Provider value={loggerService}>
            {children}
        </LoggerContext.Provider> 
}


export default LoggerProvider;