import type  { LoggerContextType } from "../logger/context/context";
import type { AuthService } from "../machines/authMachine";
import type { NotificationsService } from "../machines/notificationsMachine";
import type { SnackbarService } from "../machines/snackbarMachine";

export type ServicesProps   ={
    authService: AuthService;
    notificationsService: LoggerContextType;
    snackbarService: SnackbarService;


}
 
