import React, { lazy, Suspense } from "react";
import ServicesProvider from "../ioc/context";
import Layout from "./Layout";
// import { Outlet, useRoutes } from "react-router-dom";
import AuthStateRoute from "../containers/AuthStateRouter";
import { useRoutes } from "react-router-dom";

// const Layout = lazy(() => import('./Layout'));
// const AuthStateRoute = lazy(() => import('./AuthStateRouter'));



export function Dashbaord(props: any) {
  return (
    <ServicesProvider>
      <Layout>
        <AuthStateRoute {...props} />
      </Layout>
    </ServicesProvider>
  );
}
