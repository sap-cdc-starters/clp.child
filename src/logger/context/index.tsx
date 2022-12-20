import React,{ lazy } from "react";

export const LoggerProvider = lazy(() => import("./provider"));
export const LoggerConsumer = lazy(() => import("./context"));
