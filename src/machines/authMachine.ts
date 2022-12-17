import { actions, AnyEventObject, assign, createMachine, InterpreterFrom, MachineOptionsFrom, send } from "xstate";
import { IdToken, Token, User, UserDevices } from "../models";
import { eventOrData } from "../utils";
import { LoginRequest, LoginSuccessPayload, ServiceType } from "./loginMachine";
 // const validate = <S extends Schema>(schema: S, thing: any): thing is Schematize<S> => {
//     return (new ajv()).validate(schema, thing) as boolean;
// };
 

const { log, resolveSend } = actions;
export interface AuthMachineSchema {
    states: {
        loading: {};
        unauthorized: {};
        verifying: {};
        login: {};
        logout: {};
        authorized: {};
        error: {};
        token: {};
    };
}

export interface SocialPayload {
    provider: string,

    [key: string]: any
}

declare type EventMeta = {
    bar: {
        enabled: boolean,
        title: string,
        icon?: string
    }
}
declare type BarAction<Title extends string = string > = {  
    title: Title,
    icon?: string    
}

declare type WithBarAction<TEvent extends AnyEventObject,Title extends string = TEvent["type"] > =TEvent &{bar:BarAction<Title>}



export type SocialEvent = SocialPayload & { type: "SOCIAL" };
export type SSOEvent = { type: "SSO", authFlow: 'redirect' | 'popup', redirectURL?: string, context?: { [key: string]: any }, useChildContext?: boolean };

type LogoutEvent = {
    type: "LOGOUT";
    meta: {
        logout: BarAction<"Logout">;
    };
};

 

export type AuthMachineEvents =
    | WithBarAction<{ type: "LOGIN" } & LoginRequest> 
    | WithBarAction<{ type: "CHECK";}> 
    | WithBarAction<{ type: "LOGOUT";}> 
    | { type: "REFRESH"  }
    | { type: "LOADED" }
    | WithBarAction< { type: "REAUTH" }>
    | { type: "TOKEN", token: Token } 
    | { type: "LOGGED_IN" } 
;

const events = {} as AuthMachineEvents;


export interface AuthMachineContext {
    user?: User;
    devices?: UserDevices;
    token?: Token;
    service?: ServiceType;

}

 



type AuthMachineServices = {
    checker: {
        data: Token
    },
    refresher: {
        data: Token
    },
    login: {
        data: unknown
    },
    token: {
        data: Token
    },

    logout: {
        data: {

        }
    },
    getUserProfile: {
        data: User
    },

    getUserDevices: {
        data: UserDevices
    },


}

export const authMachine = createMachine(
    {
        id: 'auth',
        tsTypes: {} as import("./authMachine.typegen").Typegen0,
        schema: {
            context: {} as AuthMachineContext,
            events: {} as AuthMachineEvents,
            services: {} as AuthMachineServices


        },
        initial: "loading", 
       
        on: {
            CHECK: "verifying",
            TOKEN: [{ target: "#authorized" }],
            LOGGED_IN: [{ target: "token" }],

        },
        states: {
            loading: {
                on: {
                    LOADED: {
                        target: "verifying", actions: ['onLoaded'],
                    }
                },
                invoke: {
                    id: "loader",
                    src: 'loader',
                    onDone: {
                        target: "verifying"
                    }

                },

                entry: ["startLoading"],
                exit: ["stopLoading"]
            },

            verifying: {
                invoke: {
                    id: "checker",
                    src: 'checker',
                    onDone: [{ target: "token" }],

                    onError: {
                        target: "#unauthorized"
                    }
                },
                entry: ["startVerifying"],
                exit: ["stopVerifying"]
            },

            authorized: {
               
                id: "authorized",
                entry: ["setToken", "onAuthorizedEntry"],
                on: {
                    LOGOUT: 'logout',
                    REAUTH: 'login',

                },
                invoke:[
                   {
                        src: "getUserProfile",
                        onDone: { actions: "setUserProfile" },
                        onError: { actions: ["onError", "logEventData"] },
                    },
                    {
                        src: "getUserDevices",
                        onDone: { actions: "setUserDevices" },
                        onError: { actions: ["onError", "logEventData"] },
                    }
                ]
               
            },

            unauthorized: {
                id: "unauthorized",
                entry: ["resetUser", "onUnauthorizedEntry", log('unauthorized')],

                on: {
                    LOGIN: 'login',
                }
            },


            login: {
                onDone: [{ target: "token" }],
                invoke: {
                    id: "login",
                    src: "login",
                    data: (_, e) =>eventOrData<LoginRequest>(e)
                }
            },


            token: {
            
                invoke: {
                    id: "token",
                    src: "token",
                    data: (_, e) => eventOrData<LoginSuccessPayload>(e),
                    onDone: [{ actions: "setToken" , target: "#authorized"}]

                }

            },

            logout: {
                entry: log('logout'),
                data: (ctx, e) => ctx.token,
                invoke: {
                    src: "logout",
                    onDone: { target: "#unauthorized" },
                    onError: { target: "error", actions: "onError" },
                },
            },

            error: {
                entry: ["onError", "logEventData"],
            }


       
        },
    },
    {

        actions: {
            onLoaded: assign({
                service: (ctx, event) => eventOrData<ServiceType>(event).service,
            }),
            setToken: assign(({
                token:(_ctx, event) => eventOrData <Token >(event)
            })),


            resetUser: assign((_ctx: any, _event: any) => ({
                user: undefined,
                token: undefined,
                mfaToken: undefined
            })),

            setUserProfile: assign( {
                user:(_ctx, event) => eventOrData<User>(event)
            }),

            setUserDevices: assign(({
                devices:(_ctx, event) =>  eventOrData <UserDevices >(event)
            })),

            onError: assign((_ctx: any, event: any) => ({
                message: event.data.message || event.data.toString(),
            })),

            onAuthorizedEntry:(_ctx: any, event: any) =>{},

            onUnauthorizedEntry:(_ctx: any, event: any) =>{},
            startLoading :(_ctx: any, event: any) =>{},
            stopLoading :(_ctx: any, event: any) =>{},
            startVerifying :(_ctx: any, event: any) =>{},
            stopVerifying :(_ctx: any, event: any) =>{},

            logEventData:
            {
                type: 'xstate.log',
                label: 'Finish label',
                expr: (_: any, event: any) => eventOrData(event)
            },

            
        },
        delays: { INTERVAL: 2000 }
    }
);

export type AuthMachine = typeof authMachine;

export type AuthService = InterpreterFrom<AuthMachine>;
export type  AuthServiceMap = MachineOptionsFrom<AuthMachine, true>["services"]
