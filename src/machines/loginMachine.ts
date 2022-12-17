import { AnyRecord, User } from "../models";
import { actions, assign, ServiceConfig, createMachine, InterpreterFrom, MachineOptionsFrom } from "xstate";
import { eventOrData } from "../utils";
import { Observable } from "rxjs";

const { log } = actions;

export interface LoginMachineSchema {
    states: {
        loading: {};
        signup: {};
        password: {};
        social: {};
        sso: {};
        authorized: {};
        error: {};
    };
}

export interface SocialPayload {
    provider: string,

    [key: string]: any
}

export interface PasswordLoginPayload {
    username:string, password:string
    [key: string]: any
}

export interface SignupPayload {
    email?:string, password:string; username?:string;
    [key: string]: any
}
export interface LoginSuccessPayload {
    user?: User;
    token?: LoginToken;
    [key: string]: any
}

export type SocialEvent = SocialPayload & { type: "SOCIAL" };
export type LOGGED_IN = LoginSuccessPayload & { type: "LOGGED_IN" };

export type LoadedEvent={ type: "LOADED", service: ServiceType } 
export type LoginMachineEvents =
    | { type: "LOADED", service: ServiceType } & ServiceType
    | SocialEvent
    | { type: "SIGNUP" } & SignupPayload
    | { type: "PASSWORD"} &PasswordLoginPayload
    | { type: "SSO" }
export type LoginToken = {

} & AnyRecord

export type ServiceType = {

} & any


export type Error = {

} & AnyRecord | unknown
export type LoginRequest = {
    [key: string]: any
    mode?: string
}
export type LoginMachineContext ={
    user?: User;
    message?: string;
    token?: LoginToken;
    service?: ServiceType;
    error?: Error; 

} & PasswordLoginPayload



export type LoginMachineService = {
    performSocialLogin: AnyLoginService,
    performSsoLogin: AnyLoginService,
    performPasswrdLogin: AnyLoginService,
    performSignup: AnyLoginService,
    waitForLogin: AnyLoginService,

    loader: {
        data: { service: ServiceType }
    } | ({data:any} & Observable<LoadedEvent>)
}


export type AnyLoginService = {
    // The data that gets returned from the service
    data: LoginSuccessPayload;
}| ({data:any} & Observable<LOGGED_IN>)

export const loginMachine =(id:string)=> createMachine({

    id: id,
    tsTypes: {} as import("./loginMachine.typegen").Typegen0,
    schema: {
        context: {} as LoginMachineContext,
        events: {} as LoginMachineEvents,
        services: {} as LoginMachineService


    },
    initial: 'loading',
    entry: ['onLoginEntry', log('entry')],
    exit: ['onLoginExit', log('exit')],
    on: { 
        LOGGED_IN: {
            target: "#success", actions: ['onSuccess']
        }
    },
   
    states: {
        loading: {

            invoke: {
                id: "loader",
                src: 'loader',
                onDone: {
                    target: "loaded", actions: "onLoaded"
                },
                onError: { target: "error", actions: ["onError", "logEventData"] },

            },
            on: {
                LOADED: {
                    target: "loaded", actions: ['onLoaded'],
                }
            },
            entry: ["onLoadingEntry"],
            exit: ["onLoadingExit"]
        },

        loaded: {
            entry: ["onLoadedEntry", log('loaded')],
            invoke: {
                src: 'waitForLogin',
                id: 'waitForLogin',
        
                data: {
                    token: (context: LoginMachineContext, _event: any) => context
                },
                onDone: { target: "success", actions: "onSuccess" },
                onError: { target: "error", actions: ["onError", "logEventData"] },
              
            },
            on: {
                SIGNUP: "signup",
                PASSWORD: "password",
                SOCIAL: "social",
                SSO: "sso",
        
              
        
            },
           },
            social: {
                entry: log('social'),
                invoke: {
                    src: "performSocialLogin",
                    onDone: { target: "#success", actions: "onSuccess" },
                    onError: { target: "#error", actions: ["onError", "logEventData"] },
                }
            },
            sso: {
                entry: log('sso'),
                invoke: {
                    src: "performSsoLogin",
                    onDone: { target: "#success", actions: "onSuccess" },
                    onError: { target: "#error", actions: ["onError", "logEventData"] },
                },
            },
            password: {
                invoke: {
                    src: "performPasswordLogin",
                    onDone: { target: "#success", actions: "onSuccess" },
                    onError: { target: "#error", actions: ["onError", "logEventData"] },
                }
            },
            signup: {
                entry: log('signup'),

                invoke: {
                    src: "performSignup",
                    onDone: { target: "#success", actions: "onSuccess" },
                    onError: { target: "#error", actions: ["onError", "logEventData"] },
                }


            },
            success: {
                id: "success",
                entry: [log("success"), "onSuccessEntry"],
                type: "final",
                data: (ctx, _) => ctx
            },

            error: {
                id:"error",
                entry: [log("error"), "onErrorEntry"],
                type: "final",
                data: (ctx, _) => ctx
            }  
        }
     } ,

    {
        actions: {
           
            onLoaded: assign({
                service: (ctx, event) => eventOrData<ServiceType>(event).service,
            }),
            logEventData:
            {
                type: 'xstate.log',
                label: 'Finish label',
                expr: (_: any, event: any) => eventOrData(event)
            },

            onSuccess: assign((ctx, event) => ({
                user: eventOrData<{ user?: User }>(event).user,
                token: eventOrData<{ token?: LoginToken }>(event).token,
            })),

            onError: assign((ctx, event) => ({
                error: eventOrData<Error>(event),
            })),


            'onLoginExit': () => { },
            'onLoginEntry': () => { },
            
            'onLoadedEntry': () => { },
            'onSuccessEntry': () => { },
            'onErrorEntry': () => { },
            'onLoadingEntry': () => { },
            'onLoadingExit': () => { }


        }
    }
);



export type LoginMachine = typeof loginMachine;
export type LoginService = InterpreterFrom<LoginMachine>

export type LoginServiceMap = MachineOptionsFrom<LoginMachine, true>["services"]


  function  getIp():Promise<AnyRecord>{
        return new Promise<AnyRecord>((resolve, reject) =>{
            var endpoint = 'http://ip-api.com/json';

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    resolve(response);

                }
               if (this.readyState == 4 && this.status >= 500) {
                    reject(this);

                }
                
            };
            xhr.open('GET', endpoint, true);
            xhr.send();

        })
    }


    
function getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(< any > window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(< any > window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
  