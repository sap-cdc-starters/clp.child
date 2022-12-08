import {omit} from "lodash";
import {actions, AnyEventObject, assign, DoneEvent, InterpreterFrom, Machine, send} from "xstate";
import {Token} from "../models";
import {DoneOrInlineEvent, eventOrData} from "../utils";

const {log} = actions;


export interface TokenMachineSchema {
    states: {
        idle: {};
        code: {};
        token: {};
        refresh: {};
        revoke: {};
        error: {};
    };
}

declare type Code = { code: "code" };
declare type TokenEvent = { type: "TOKEN" } & Token;
declare type CodeEvent = { type: "CODE" } & Code;

export type TokenMachineEvents =
    | CodeEvent
    | TokenEvent
    | { type: "REFRESH" }
    | { type: "REVOKE" };

export const tokenMachine = Machine<Token, TokenMachineSchema, TokenMachineEvents>({
        id: 'token',
        initial: "idle",
        on: {
            CODE: "code",
            TOKEN: "token",
            REFRESH: "refresh",
            REVOKE: "revoke"
        },
        states: {
            idle: {
                invoke: {
                    src: "waiting_to_code",
                    onDone: "code",
                    onError: "error",
                }
            },
            code: {
                invoke: {
                    id: "code-exchange-service",
                    src: "exchange_code",
                    data: (ctx, event: DoneOrInlineEvent<Code>) => {
                        code : eventOrData<Code>(event).code
                    },
                    onDone: "token",
                    onError: "error",
                },
            },
            token: {
                entry: ["setToken", "sendTokenResponse"],
                invoke: {
                    id: "use-token-service",
                    src: "use_token",
                    data: (ctx) => {
                        ctx.access_token;
                        ctx.refresh_token;
                        ctx.id_token;
                    }

                },
                after: {
                    INTERVAL: {actions: send('REFRESH'), target: "refresh"}
                }

            },
            refresh: {
                invoke: {
                    id: "refresh-token-service",
                    src: "refresh_token",
                    data: (ctx) => {
                        ctx.refresh_token;
                        ctx.id_token;
                    },
                    onDone: "token",
                    onError: {target: "idle", actions: ["onError", "logEventData"]},
                },
            },
            revoke: {
                invoke: {
                    src: "revoke",
                    data: (ctx) => {
                        ctx.access_token;
                        ctx.refresh_token;
                        ctx.id_token;
                    },
                    onDone: {target: 'idle', actions: ["clearToken"]},
                    onError: "error",
                }

            },
            error: {
                entry: ["onError", "logEventData"]
            }


        }
    },
    {
        delays: {INTERVAL: 2000},
        actions: {
            setToken: assign((ctx: any, event: any) => ({
                id_token: eventOrData<Token>(event).id_token,
                access_token: eventOrData<Token>(event).access_token,
                refresh_token: eventOrData<Token>(event).refresh_token,
                error: undefined

            })),
            clearToken: assign((ctx: any, event: any) => ({
                id_token: undefined,
                access_token: undefined,
                refresh_token: undefined,
                error: undefined

            })),
            onError: assign((ctx: any, event: any) => ({
                error: event.data || omit(event, "type"),
            }))
        }
    })




export type TokenMachine = typeof tokenMachine;
export type TokenService = InterpreterFrom<TokenMachine>;




