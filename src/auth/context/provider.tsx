import React, { createContext, useContext} from "react";
import {authMachine} from "../../machines/authMachine";
import {useInterpret} from "@xstate/react";

import { gigyaAuthApiServices } from "../../gigya/services";
import {AuthContext } from './context'
import { useLogger } from "../../logger/context/context";
import { useAppLogger } from "../../logger";

 export function AuthProvider({ children}:React.PropsWithChildren) {
    const authService = useInterpret(() =>authMachine.withConfig({
        services: gigyaAuthApiServices
    })); 
    const notificationsService= useLogger();
    useAppLogger(authService, notificationsService.send); 
        return  <AuthContext.Provider value={authService}>
            {children}
        </AuthContext.Provider> 
}

export default AuthProvider;