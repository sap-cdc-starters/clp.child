import React, { createContext, useContext} from "react";
import type {AuthService} from "../../machines/authMachine";
 
export const AuthContext = createContext<AuthService>({} as AuthService);

export const useAuth=()=> useContext(AuthContext);

export default AuthContext.Consumer;