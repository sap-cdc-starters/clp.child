 
// @ts-nocheck - may need to be at the start of file
import {SocialPayload} from "../machines/authMachine";
import {Account, IAuthMethods, IBaseEvent, ILoginEvent} from "./models";
import { AnyRecord } from "./models";

// @ts-ignore

declare type AnyRequest = { [key: string]: any } | undefined;

export async function performSignup(args: any):Promise<ILoginEvent> {
    return new Promise((resolve, reject) => {
        initRegistration().then(regToken =>
            gigyaWebSDK().accounts.register({
                ...args,
                finalizeRegistration: true,
                regToken: regToken,
                callback: (response) => {
                    if (response.errorCode === 0) {
                        resolve(response);

                    } else {
                        reject(
                            `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                        );
                    }
                },
            }))

    });
}

export async function performSignupWithSS(args: any) {
    return new Promise((resolve, reject) => {

        gigyaWebSDK().accounts.showScreenSet(
            {
                ...args,
                screenSet: "Default-RegistrationLogin",
                startScreen: 'gigya-register-screen',
                onLogin: (r) => {
                    resolve(r)
                },
                callback: (response) => {
                    if (response.errorCode === 0) {
                        resolve(response);

                    }
                    if (response.errorCode !== 0) {
                        reject(
                            `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                        );
                    }
                },
            })

    });
}

export async function initRegistration(args: any) {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.initRegistration({
            callback: (response) => {
                if (response.errorCode === 0) {
                    resolve(response.regToken);

                } else {
                    reject(
                        `Error during registration: ${response.errorMessage}, ${response.errorDetails}`
                    );
                }
            },
        });


    });
}

export async function performSignin(args) : Promise<ILoginEvent>{
    return new Promise((resolve, reject) => {
      
        gigyaWebSDK().accounts.login(args, {
            callback: (response) => {
                if (response.errorCode === 0) {
                    resolve(response);
                } else {
                    reject(
                        `Error during login: ${response.errorMessage}, ${response.errorDetails}`
                    );
                }
            }


        });

    });

}
export function performSsoLogin(args):Promise<ILoginEvent> {
    return new Promise((resolve, reject) => {

        gigyaWebSDK().sso.login(args, {
            callback: (response) => {
                if (response.errorCode === 0) {
                    resolve(response);
                } else {
                    reject(
                        `Error during login: ${response.errorMessage}, ${response.errorDetails}`
                    );
                }
            }


        });

    });

}

export function getJwt(args): Promise<{id_token: string}> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.getJWT({
            ...(args || {}),
            fields: 'phonenumber,isRegistered,authMethods,email,loginProvider',
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}

export function getAuthMethods(args): Promise<IAuthMethods> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.auth.getMethods({
            ...(args || {}),
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}


export function dsStore(args:DsRecord): Promise<IBaseEvent> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().ds.store({
            ...(args || {}),
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}
declare type DsRecord={oid:string,  data:AnyRecord,type:string, updateBehavior: string};

declare type DsGet= {oid:string,  type:string};
export function dsGet(args :DsGet): Promise<DsRecord> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().ds.get({
            ...(args || {}),
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}
export function getAccount(args): Promise<Account> {
    return new Promise((resolve, reject) => {
        gigyaWebSDK().accounts.getAccountInfo({
            ...(args || {}),
            include: "all",
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        })
    });
}

export type LoginParams = {
    [key: string]: any
    loginMode?: string
}

export type SocialLoginParams = SocialPayload & LoginParams

export const socialLoginAsync = (args: SocialLoginParams): Promise<ILoginEvent> => {
    return new Promise((resolve, reject) => {
        const params = {
            ...(args || {}),
            include: "all",
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        };
        window.gigya.socialize.login({...params, enabledProviders: params.provider});
    });
}
export const socialLogin = (args: { provider: string, [key: string]: any }, callback: (res) => {}) => {
    const params = {
        ...(args || {}),
        include: "all",
        callback: callback
    }
    gigyaWebSDK().socialize.login({...params, enabledProviders: params.provider});
}
export const startFlow = (args: { provider: string, [key: string]: any }, callback: (res) => {}) => {
    const params = {
        ...(args || {}),
        include: "all",
        callback: callback
    }
    gigyaWebSDK().identityFlows.start({...params, enabledProviders: params.provider});
}


export const logout = (args: AnyRequest = {}) => {
    return new Promise((resolve, reject) => {
        const params = {
            ...(args || {}),
            callback: function (res) {
                if (res.errorCode === 0) {
                    resolve(res)
                } else {
                    reject(res)
                }

            }
        };
        gigyaWebSDK().socialize.logout({...params});
    });
}




export const gigyaWebSDK =()=>window.gigya;
export default gigyaWebSDK;