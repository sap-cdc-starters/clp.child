import {Machine, assign, InterpreterFrom, actions, send} from "xstate";
import {User, IdToken} from "../models";
import {
    logout,
    performSignup
} from "../gigya/gigyaAuthMachine";

const {log, resolveSend} = actions;

export interface AuthMachineSchema {
    states: {
        unauthorized: {};
        login: {};
        logout: {};
        refreshing: {};
        authorized: {};
        reauth: {};
        error: {};
        token: {};
    };
}

export interface SocialPayload {
    provider: string,

    [key: string]: any
}

export type SocialEvent = SocialPayload & { type: "SOCIAL" };
export type SSOEvent =  { type: "SSO", authFlow: 'redirect' | 'popup', redirectURL?: string, context?: {[key:string]:any}, useChildContext?: boolean };
export type AuthMachineEvents =
    | { type: "LOGIN" , [key:string]: any}
    | SocialEvent
    | SSOEvent
    | { type: "LOGOUT" }
    | { type: "UPDATE" }
    | { type: "REFRESH"  }
    | { type: "SIGNUP" }
    | { type: "REAUTH" }
    | { type: "SUBMIT" , email: string, password: string}
    | { type: "TOKEN", token: Token };

export interface Token {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
}

export interface AuthMachineContext {
    user?: User;
    idToken?: IdToken;
    token?: Token;
    mfaToken?: any;
    message?: string; 
}


export const authMachine = Machine<AuthMachineContext, AuthMachineSchema, AuthMachineEvents>(
    {
        id: 'auth',
        initial: "unauthorized",
        context: {
            user: undefined,
            idToken: undefined,
            token: undefined,
            message: undefined 

        },

      
        states: {
            unauthorized: {
                entry: ["resetUser", "onUnauthorizedEntry", log('unauthorized')],
                on: {
                    LOGIN: "login.initial",
                    SIGNUP: "login.signup"
                },
            },
            login: {
                entry: ['onLoginEntry', 'assignLoginService', log('login')],
                onDone: [{target: "token.exchange", actions: "setLoginResponse"}],
                on: {
                    SUBMIT: ".password",
                    SOCIAL: ".social",
                    SIGNUP: ".signup",
                    SSO: ".sso"

                },
                states: {
                    initial:{
                        on: {
                            SUBMIT: "password",
                            SOCIAL: "social",
                            SIGNUP: "signup",
                            SSO: "sso"

                        }
                    },
                    social: {
                        entry: log('social'),
                        invoke: {
                            src: "performSocialLogin",
                            onDone: {target: "authorized", actions: "onSuccess"},
                            onError: {target: "initial", actions: ["onError", "logEventData"]},
                        },
                    }, 
                    sso: {
                        entry: log('sso'),
                        invoke: {
                            src: "performSsoLogin",
                            onDone: {target: "authorized", actions: "onSuccess"},
                            onError: {target: "initial", actions: ["onError", "logEventData"]},
                        },
                    },
                    password: {
                        invoke: {
                            src: "performLogin",
                            onDone: {target: "authorized", actions: "onSuccess"},
                            onError: {target: "initial", actions: ["onError", "logEventData"]},
                        }
                    },
                    signup: {
                        entry: log('signup'),
                        onDone: 'authorized', 
                        on: { 
                            LOGIN: "initial",
                            SUBMIT: '.submit'
                        },
                        
                        states:{
                            submit:{
                                invoke: {
                                    src: "performSignup",
                                    onDone: {target: "success", actions: "onSuccess"},
                                    onError: {target: "error", actions: ["onError", "logEventData"]},
                                },
                            },
                            success: {
                                entry: [log("success"), "onRegisterSuccessEntry"],
                                type: "final"

                            },
                            error: {
                             
                            

                            }
                        }
                        
                        
                       
                    },

                    authorized: {
                        entry: [log("authorized"), "onAuthorizedEntry"],
                        type: "final"

                    },
                   
                },
                invoke: {
                    src: 'login-service',
                    id: 'loginService',

                    data: {
                        token: (context: AuthMachineContext, _event: any) => context.token
                    },
                    onDone: {target: "token", actions: "setLoginResponse"},
                    onError: {target: "unauthorized", actions: ["onError", "logEventData"]},

                },

            },
            token: {

                onDone: {target: 'authorized'},
  
                states:{
                    exchange:{
                        
                        invoke: {
                            src: "getToken",
                            onDone: [
                                { target: '#authorized', actions: "setToken"},
                                // {target: 'authorized', actions: "enrichToken", cond: context => context.token !== undefined}
                            ],
                            onError: {target: "error", actions: ["onError", "logEventData"]},
                        },
                      

                    },
                    enrich: {
                        invoke: {
                            src: "enrichToken",
                            onDone: {target: '#authorized', actions: "setToken"},
                            onError: {target: "error", actions: ["onError", "logEventData"]},
                        }   

                    },
                    error: {
                        entry: [log("authorized"), "onAuthorizedEntry"],
                        type: "final"

                    },
                    authorized: {
                        entry: [log("authorized"), "onAuthorizedEntry"],
                        type: "final"

                    }
                    
                }
            },
            reauth: {
                entry: ["onReauthEntry", log('reauth')],
                onDone: [{target: "token.enrich", actions: "setLoginResponse"}],

                on: {
                    SUBMIT: {
                        actions:send({type: "PASSWORD", mode:"reauth"}),
                        target: "login.password"
                    },
                    SOCIAL: {
                        actions:send({type: "SOCIAL", mode:"reauth", to:"login"}),
                        target: "login.social"
                    },
                    SIGNUP: {
                        actions:send({type: "SIGNUP", mode:"reauth", to:"login"}),
                        target: "login.signup"
                    },
                    SSO: {
                        actions:send({type: "SSO", mode:"reauth", to:"login"}),
                        target: "login.sso"
                    }
                }
                 


            },
         
            authorized: {
                id: "authorized",
                entry: [log("authorized"), "onAuthorizedEntry"],
                invoke: {
                    src: "getUserProfile",
                    onDone: {actions: "setUserProfile"},
                    onError: {actions: ["onError", "logEventData"]},
                },
                on: {
                    LOGOUT: "logout",
                    REAUTH: "reauth",
                    REFRESH: "refreshing"
                },


            },
            refreshing: {
                entry: log('refreshing'),

                invoke: [{
                    src: "getToken",
                    onDone: {target: "authorized", actions: "setToken"},
                    onError: {target: "unauthorized", actions: ["onError", "logEventData"]},
                }
                ]

            },
            logout: {
                entry: log('logout'),

                invoke: {
                    src: "performLogout",
                    onDone: {target: "unauthorized"},
                    onError: {target: "unauthorized", actions: "onError"},
                },
            },

            error: {
                entry: ["onError", "logEventData"],
            }

        },
    },
    {

        actions: { 
            logEventData: {
                type: 'xstate.log',
                label: 'Finish label',
                expr: (context: any, event: any) => event.data
            },
            onAuthorizedEntry: async (ctx, event) => {


            },
            setToken: assign((ctx: any, event: any) => ({
                token: {
                    id_token: event.data.idToken,
                    access_token: event.data.access_token,
                    refresh_token: event.data.refresh_token,
                },
                idToken: event.data.idToken,
                mfaToken: event.data.mfaToken
            })),

           
            resetUser: assign((ctx: any, event: any) => ({
                user: undefined,
                idToken: undefined,
                token: undefined,
                mfaToken: undefined
            })),
            setLoginResponse: assign((ctx: any, event: any) => ({
                user: event.data?.user,
                token: event.data?.token,
            })),
            setUserProfile: assign((ctx: any, event: any) => ({
                user: event.data.user
            })),
            onSuccess: assign((ctx: any, event: any) => ({
                user: event.data.user,
                message: undefined,
            })),
            onError: assign((ctx: any, event: any) => ({
                message: event.data.message || event.data.toString(),
            })),
        },
    }
);

export type AuthMachine = typeof authMachine;
 
export type AuthService = InterpreterFrom<AuthMachine>;
