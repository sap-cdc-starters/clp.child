
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.loader": { type: "done.invoke.loader"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.login.password:invocation[0]": { type: "done.invoke.login.password:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.login.signup:invocation[0]": { type: "done.invoke.login.signup:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.login.social:invocation[0]": { type: "done.invoke.login.social:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.login.sso:invocation[0]": { type: "done.invoke.login.sso:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.waitForLogin": { type: "done.invoke.waitForLogin"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.loader": { type: "error.platform.loader"; data: unknown };
"error.platform.login.password:invocation[0]": { type: "error.platform.login.password:invocation[0]"; data: unknown };
"error.platform.login.signup:invocation[0]": { type: "error.platform.login.signup:invocation[0]"; data: unknown };
"error.platform.login.social:invocation[0]": { type: "error.platform.login.social:invocation[0]"; data: unknown };
"error.platform.login.sso:invocation[0]": { type: "error.platform.login.sso:invocation[0]"; data: unknown };
"error.platform.waitForLogin": { type: "error.platform.waitForLogin"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "loader": "done.invoke.loader";
"performPasswordLogin": "done.invoke.login.password:invocation[0]";
"performSignup": "done.invoke.login.signup:invocation[0]";
"performSocialLogin": "done.invoke.login.social:invocation[0]";
"performSsoLogin": "done.invoke.login.sso:invocation[0]";
"waitForLogin": "done.invoke.waitForLogin";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: "loader" | "performPasswordLogin" | "performSignup" | "performSocialLogin" | "performSsoLogin" | "waitForLogin";
        };
        eventsCausingActions: {
          "logEventData": "error.platform.loader" | "error.platform.login.password:invocation[0]" | "error.platform.login.signup:invocation[0]" | "error.platform.login.social:invocation[0]" | "error.platform.login.sso:invocation[0]" | "error.platform.waitForLogin";
"onError": "error.platform.loader" | "error.platform.login.password:invocation[0]" | "error.platform.login.signup:invocation[0]" | "error.platform.login.social:invocation[0]" | "error.platform.login.sso:invocation[0]" | "error.platform.waitForLogin";
"onErrorEntry": "error.platform.loader" | "error.platform.login.password:invocation[0]" | "error.platform.login.signup:invocation[0]" | "error.platform.login.social:invocation[0]" | "error.platform.login.sso:invocation[0]" | "error.platform.waitForLogin";
"onLoaded": "LOADED" | "done.invoke.loader";
"onLoadedEntry": "LOADED" | "done.invoke.loader";
"onLoadingEntry": "LOGGED_IN" | "xstate.init";
"onLoadingExit": "LOADED" | "LOGGED_IN" | "done.invoke.loader" | "error.platform.loader" | "xstate.stop";
"onLoginEntry": "LOGGED_IN" | "xstate.init";
"onLoginExit": "LOGGED_IN" | "done.invoke.login.password:invocation[0]" | "done.invoke.login.signup:invocation[0]" | "done.invoke.login.social:invocation[0]" | "done.invoke.login.sso:invocation[0]" | "done.invoke.waitForLogin" | "error.platform.loader" | "error.platform.login.password:invocation[0]" | "error.platform.login.signup:invocation[0]" | "error.platform.login.social:invocation[0]" | "error.platform.login.sso:invocation[0]" | "error.platform.waitForLogin" | "xstate.stop";
"onSuccess": "LOGGED_IN" | "done.invoke.login.password:invocation[0]" | "done.invoke.login.signup:invocation[0]" | "done.invoke.login.social:invocation[0]" | "done.invoke.login.sso:invocation[0]" | "done.invoke.waitForLogin";
"onSuccessEntry": "LOGGED_IN" | "done.invoke.login.password:invocation[0]" | "done.invoke.login.signup:invocation[0]" | "done.invoke.login.social:invocation[0]" | "done.invoke.login.sso:invocation[0]" | "done.invoke.waitForLogin";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "loader": "LOGGED_IN" | "xstate.init";
"performPasswordLogin": "PASSWORD";
"performSignup": "SIGNUP";
"performSocialLogin": "SOCIAL";
"performSsoLogin": "SSO";
"waitForLogin": "LOADED" | "done.invoke.loader";
        };
        matchesStates: "error" | "loaded" | "loading" | "password" | "signup" | "social" | "sso" | "success";
        tags: never;
      }
  