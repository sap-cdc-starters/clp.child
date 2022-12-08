import gigyaWebSDK,{
  dsGet,
  dsStore,
  getAccount, 
  getJwt,
  logout
} from "../gigyaWebSDK";
import {omit} from "lodash/fp";
import {AuthServiceMap} from "../../machines/authMachine";
import {GigyaSdk, loader, loginSubject} from "../loader/gigyaLoadMachine";
import {AnyRecord, Token} from "../../models";
import {ILoginEvent, Account} from "../models";


export const gigyaAuthApiServices: AuthServiceMap = {
  loader: (_) => loader,
  login: (_) => loginSubject,

  checker: async (ctx, event) => {
    const payload = omit("type", event);
    return await getToken(payload);
  },


  // refresher: async (ctx, event) => {
  //     const payload = omit("type", event);
  //     return await getToken(payload);
  // },

  token: async (ctx, event) => {
    const payload = omit("type", event);
    return await getToken(payload);
  },

  getUserDevices: async (ctx, event) => {
    const payload = omit("type", event);
    const ip = await getIp();
    const id= btoa(`${ip.query}_${window.navigator.userAgent}`) ;
    await dsStore({
      type: "connect",
      oid:id , 
      updateBehavior: "arrayPush",
      data: {
        device: 
          {
            agent: getBrowserName(),
            ... ip
          }
        
      }
    })

    const {data} = await dsGet({type: "connect", oid: id})

    return {devices: data.device};
  },

  getUserProfile: async (ctx, event) => {
    const payload = omit("type", event);
    const user = await getAccount(payload);
    return toUser(user);
  },

  logout: async (_, __): Promise < any > => {
    return await logout();
  }

}


async function getToken(payload: AnyRecord): Promise<Token> {
  const response = await getJwt(payload);
  const loginToken = gigyaWebSDK()
    ._
    .apiAdapters
    .web
    .tokenStore
    .get();

  return {id_token: toIdToken(response), access_token: loginToken};
}

function decodeJwt(token ?:string) {

  return token && token.split && JSON.parse(atob(token.split('.')[1]));

}

function toIdToken({id_token} : {
  id_token : string
}): import("../../models").IdToken {

  return {raw: id_token, details: decodeJwt(id_token)};

}

function toUser(response: ILoginEvent |Account): import("../../models").User {
  return {
    ... response,
    photo: response ?. profile ?. photoURL,
    id: response.UID,
    ... response.profile
  }
};

function getIp(): Promise<AnyRecord> {
  return new Promise<AnyRecord>((resolve, reject) => {
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

//     try {

//    return await (await axios.get('http://ip-api.com/json/')).data;
//     }
//     catch (err) {
//         console.log("Error IP: " + err);
//          return {error: err}}
//         }


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
