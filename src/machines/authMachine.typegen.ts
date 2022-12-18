// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.auth.logout:invocation[0]": {
      type: "done.invoke.auth.logout:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.authorized:invocation[0]": {
      type: "done.invoke.authorized:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.authorized:invocation[1]": {
      type: "done.invoke.authorized:invocation[1]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.checker": {
      type: "done.invoke.checker";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.loader": {
      type: "done.invoke.loader";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.login": {
      type: "done.invoke.login";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.token": {
      type: "done.invoke.token";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.auth.logout:invocation[0]": {
      type: "error.platform.auth.logout:invocation[0]";
      data: unknown;
    };
    "error.platform.authorized:invocation[0]": {
      type: "error.platform.authorized:invocation[0]";
      data: unknown;
    };
    "error.platform.authorized:invocation[1]": {
      type: "error.platform.authorized:invocation[1]";
      data: unknown;
    };
    "error.platform.checker": { type: "error.platform.checker"; data: unknown };
    "error.platform.loader": { type: "error.platform.loader"; data: unknown };
    "error.platform.login": { type: "error.platform.login"; data: unknown };
    "error.platform.token": { type: "error.platform.token"; data: unknown };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    checker: "done.invoke.checker";
    getUserDevices: "done.invoke.authorized:invocation[1]";
    getUserProfile: "done.invoke.authorized:invocation[0]";
    loader: "done.invoke.loader";
    login: "done.invoke.login";
    logout: "done.invoke.auth.logout:invocation[0]";
    token: "done.invoke.token";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services:
      | "checker"
      | "getUserDevices"
      | "getUserProfile"
      | "loader"
      | "login"
      | "logout"
      | "token";
  };
  eventsCausingActions: {
    logEventData:
      | "error.platform.auth.logout:invocation[0]"
      | "error.platform.authorized:invocation[0]"
      | "error.platform.authorized:invocation[1]";
    onAuthorizedEntry: "TOKEN" | "done.invoke.token";
    onError:
      | "error.platform.auth.logout:invocation[0]"
      | "error.platform.authorized:invocation[0]"
      | "error.platform.authorized:invocation[1]";
    onLoaded: "LOADED";
    onUnauthorizedEntry:
      | "done.invoke.auth.logout:invocation[0]"
      | "error.platform.checker";
    resetUser:
      | "done.invoke.auth.logout:invocation[0]"
      | "error.platform.checker";
    setToken: "TOKEN" | "done.invoke.token";
    setUserDevices: "done.invoke.authorized:invocation[1]";
    setUserProfile: "done.invoke.authorized:invocation[0]";
    startLoading: "CHECK" | "LOGGED_IN" | "TOKEN" | "xstate.init";
    startVerifying: "CHECK" | "LOADED" | "done.invoke.loader";
    stopLoading:
      | "CHECK"
      | "LOADED"
      | "LOGGED_IN"
      | "TOKEN"
      | "done.invoke.loader"
      | "xstate.stop";
    stopVerifying:
      | "LOGGED_IN"
      | "TOKEN"
      | "done.invoke.checker"
      | "error.platform.checker"
      | "xstate.stop";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    checker: "CHECK" | "LOADED" | "done.invoke.loader";
    getUserDevices: "TOKEN" | "done.invoke.token";
    getUserProfile: "TOKEN" | "done.invoke.token";
    loader: "CHECK" | "LOGGED_IN" | "TOKEN" | "xstate.init";
    login: "LOGIN" | "REAUTH";
    logout: "LOGOUT";
    token: "LOGGED_IN" | "done.invoke.checker" | "done.state.auth.login";
  };
  matchesStates:
    | "authorized"
    | "error"
    | "loading"
    | "login"
    | "logout"
    | "token"
    | "unauthorized"
    | "verifying";
  tags: never;
}
