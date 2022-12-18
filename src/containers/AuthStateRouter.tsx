import React, {lazy, Suspense} from 'react'
import { Outlet, useRoutes } from "react-router-dom";
 import { useActor } from "@xstate/react"
import JsonView from "../components/JsonTreeViewer";
import  { useServices } from '../ioc/context';
// import SignIn from '../components/SignIn';
// import Profile from '../components/Profile';



const SignIn = lazy(() => import('../components/SignIn'));
const Profile = lazy(() => import('./ProfileContainer'));
 const Loading = lazy(() => import('@mui/lab/LoadingButton'));



 

export function AuthStateRoute() {
  const services= useServices();
    const {authService} = services;
    const [state] = useActor(authService);
    return <div style={{minWidth: "2rem"}}>
       
                {state.matches('login') && <SignIn {...services} />  }
                {state.matches('authorized') && <Profile {...services} /> }
                {state.matches('unauthorized') && <SignIn {...services} /> }
                {state.matches('loading') && <Loading />  }
                {state.matches('error') && <JsonView data={state.context} />  }

    
    
       <Outlet />
    </div>
    


}

export default AuthStateRoute;