import React,{ lazy } from "react";

export const AuthProvider = lazy(() => import("./provider"));
export const AuthConsumer = lazy(() => import("./context"));
