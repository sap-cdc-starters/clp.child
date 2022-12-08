import {
    getAccount,
    getJwt,
    logout,
    performSignin,
    performSignup,
    performSsoLogin,
    socialLoginAsync,
    SocialLoginParams
} from "../gigyaWebSDK";
import { omit } from "lodash/fp";
import {  gigya_loader_service, loader, loginSubject } from "../loader/gigyaLoadMachine";
 import { LoginMachine, LoginMachineContext, LoginMachineEvents, LoginMachineService, LoginServiceMap, LoginSuccessPayload, PasswordLoginPayload, SignupPayload } from "../../machines/loginMachine";
import { Account, ILoginEvent } from "../models";
 
// const myFunc = async (actor: AnyInterpreter) => {

//     const doneState = await waitFor(actor, (state) => state.matches('done'), {
//         // 20 seconds in ms
//         timeout: 20_000
//     });
// };



export const gigyaLoginApiServices: LoginServiceMap  = {
    loader: (context) => gigya_loader_service(),
    waitForLogin: (context) => loginSubject,

    performSsoLogin: async (ctx, event): Promise<LoginSuccessPayload> => {
        const payload = omit("type", event);
        const response = await performSsoLogin(payload);
        return {
            user: toUser(response),
            token: toIdToken(response)
        };
    },

    performSocialLogin: async (ctx, event): Promise<LoginSuccessPayload> => {
        const payload = omit("type", event);
        const loginMode = ctx.user ? "reAuth" : "standard";

        const response = await socialLoginAsync({ ...payload, loginMode } as SocialLoginParams);

        return {
            user: toUser(response),
            token: toIdToken(response)
        };
    },

  
    performPasswordLogin: async (ctx, event: PasswordLoginPayload): Promise<LoginSuccessPayload> => {
        const payload = omit("type", event);
        const loginMode = ctx.user ? "reAuth" : "standard";

        const params = {
            loginID: payload.username,
            password: payload.password,
            loginMode,
            ...payload
        };
        const response = await performSignin(params);

        return {
            user: toUser(response),
            token: toIdToken(response)
        };
    },

    performSignup: async (ctx, event: SignupPayload): Promise<LoginSuccessPayload> => {
        const payload = omit("type", event);
        const response = await performSignup(payload);

        return {
            user: toUser(response),
            token: toIdToken(response)
        };
    },
};



function decodeJwt(token?: string) {

    return token && token.split && JSON.parse(atob(token.split('.')[1]));

}

function toIdToken({ id_token }: ILoginEvent): import("../../models").IdToken {

    return { raw: id_token, details: decodeJwt(id_token) };

}

function toUser(response: ILoginEvent | Account): import("../../models").User | undefined {
    return { ...response, photo: response?.profile?.photoURL, id: response.UID, ...response.profile }
};



