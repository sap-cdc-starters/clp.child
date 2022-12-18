import React, { createContext, useContext} from "react";
import type { AnyInterpreter } from "xstate/lib/types";
import  type {  NotificationsService , NotificationsEvents} from "../../machines/notificationsMachine";

declare type useAppLogger = (app: AnyInterpreter, send: (notification: NotificationsEvents)=>any) => any;
export type LoggerContextType = NotificationsService & {useAppLogger?: useAppLogger};

export const LoggerContext = createContext<LoggerContextType>({} as LoggerContextType);

 
export const useLogger= ()=>useContext(LoggerContext);

export default LoggerContext.Consumer;