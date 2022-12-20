import React, { createContext, useContext} from "react";
import {useInterpret, useMachine} from "@xstate/react";
import { snackbarMachine } from "../../machines/snackbarMachine";
import AlertBar from "../../components/AlertBar";
import {SnackbarProivderContext} from "./context"
export function SnackbarProvider({ children}:React.PropsWithChildren) {

     
    const [, sendSnackbar, snackbarService] = useMachine(snackbarMachine);
 

 
        return  <SnackbarProivderContext.Provider value={snackbarService}>
            <div>
            {children}
            <AlertBar snackbarService={snackbarService}/>

            </div>
        </SnackbarProivderContext.Provider> 
}
export default SnackbarProvider;