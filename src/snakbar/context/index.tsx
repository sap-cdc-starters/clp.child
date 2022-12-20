import React,{ lazy } from "react";

export const SnackbarProvider = lazy(() => import("./provider"));
export const SnackbarConsumer = lazy(() => import("./context"));
