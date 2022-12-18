// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.(machine).password:invocation[0]": {
      type: "done.invoke.(machine).password:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).signup:invocation[0]": {
      type: "done.invoke.(machine).signup:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).social:invocation[0]": {
      type: "done.invoke.(machine).social:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).sso:invocation[0]": {
      type: "done.invoke.(machine).sso:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.loader": {
      type: "done.invoke.loader";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.waitForLogin": {
      type: "done.invoke.waitForLogin";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.(machine).password:invocation[0]": {
      type: "error.platform.(machine).password:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).signup:invocation[0]": {
      type: "error.platform.(machine).signup:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).social:invocation[0]": {
      type: "error.platform.(machine).social:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).sso:invocation[0]": {
      type: "error.platform.(machine).sso:invocation[0]";
      data: unknown;
    };
    "error.platform.loader": { type: "error.platform.loader"; data: unknown };
    "error.platform.waitForLogin": {
      type: "error.platform.waitForLogin";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    loader: "done.invoke.loader";
    performPasswordLogin: "done.invoke.(machine).password:invocation[0]";
    performSignup: "done.invoke.(machine).signup:invocation[0]";
    performSocialLogin: "done.invoke.(machine).social:invocation[0]";
    performSsoLogin: "done.invoke.(machine).sso:invocation[0]";
    waitForLogin: "done.invoke.waitForLogin";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services:
      | "loader"
      | "performPasswordLogin"
      | "performSignup"
      | "performSocialLogin"
      | "performSsoLogin"
      | "waitForLogin";
  };
  eventsCausingActions: {
    logEventData:
      | "error.platform.(machine).password:invocation[0]"
      | "error.platform.(machine).signup:invocation[0]"
      | "error.platform.(machine).social:invocation[0]"
      | "error.platform.(machine).sso:invocation[0]"
      | "error.platform.loader"
      | "error.platform.waitForLogin";
    onError:
      | "error.platform.(machine).password:invocation[0]"
      | "error.platform.(machine).signup:invocation[0]"
      | "error.platform.(machine).social:invocation[0]"
      | "error.platform.(machine).sso:invocation[0]"
      | "error.platform.loader"
      | "error.platform.waitForLogin";
    onErrorEntry:
      | "error.platform.(machine).password:invocation[0]"
      | "error.platform.(machine).signup:invocation[0]"
      | "error.platform.(machine).social:invocation[0]"
      | "error.platform.(machine).sso:invocation[0]"
      | "error.platform.loader"
      | "error.platform.waitForLogin";
    onLoaded: "LOADED" | "done.invoke.loader";
    onLoadedEntry: "LOADED" | "done.invoke.loader";
    onLoadingEntry: "LOGGED_IN" | "xstate.init";
    onLoadingExit:
      | "LOADED"
      | "LOGGED_IN"
      | "done.invoke.loader"
      | "error.platform.loader"
      | "xstate.stop";
    onLoginEntry: "LOGGED_IN" | "xstate.init";
    onLoginExit:
      | "LOGGED_IN"
      | "done.invoke.(machine).password:invocation[0]"
      | "done.invoke.(machine).signup:invocation[0]"
      | "done.invoke.(machine).social:invocation[0]"
      | "done.invoke.(machine).sso:invocation[0]"
      | "done.invoke.waitForLogin"
      | "error.platform.(machine).password:invocation[0]"
      | "error.platform.(machine).signup:invocation[0]"
      | "error.platform.(machine).social:invocation[0]"
      | "error.platform.(machine).sso:invocation[0]"
      | "error.platform.loader"
      | "error.platform.waitForLogin"
      | "xstate.stop";
    onSuccess:
      | "LOGGED_IN"
      | "done.invoke.(machine).password:invocation[0]"
      | "done.invoke.(machine).signup:invocation[0]"
      | "done.invoke.(machine).social:invocation[0]"
      | "done.invoke.(machine).sso:invocation[0]"
      | "done.invoke.waitForLogin";
    onSuccessEntry:
      | "LOGGED_IN"
      | "done.invoke.(machine).password:invocation[0]"
      | "done.invoke.(machine).signup:invocation[0]"
      | "done.invoke.(machine).social:invocation[0]"
      | "done.invoke.(machine).sso:invocation[0]"
      | "done.invoke.waitForLogin";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    loader: "LOGGED_IN" | "xstate.init";
    performPasswordLogin: "PASSWORD";
    performSignup: "SIGNUP";
    performSocialLogin: "SOCIAL";
    performSsoLogin: "SSO";
    waitForLogin: "LOADED" | "done.invoke.loader";
  };
  matchesStates:
    | "error"
    | "loaded"
    | "loading"
    | "password"
    | "signup"
    | "social"
    | "sso"
    | "success";
  tags: never;
}
