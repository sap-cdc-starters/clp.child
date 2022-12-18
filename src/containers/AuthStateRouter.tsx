import React, {lazy} from 'react'
import { useActor } from "@xstate/react"
import  { useServices } from '../ioc/context';
import Paper from '../components/styled/Paper';
// import SignIn from '../components/SignIn';
// import Profile from '../components/Profile';



const SignIn = lazy(() => import('../components/SignIn'));
const Profile = lazy(() => import('./ProfileContainer'));
 const Loading = lazy(() => import('@mui/lab/LoadingButton'));
 const Error = lazy(() => import('../components/JsonTreeViewer'));



 

export function AuthStateRoute() {
  const services= useServices();
    const {authService} = services;
    const [state] = useActor(authService);
    return <Paper sx={{alignItems: "stretch"}}>
       
                {state.matches('login') && <SignIn {...services} />  }
                {state.matches('authorized') && <Profile {...services} /> }
                {state.matches('unauthorized') && <SignIn {...services} /> }
                {state.matches('loading') && <Loading />  }
                {state.matches('error') && <Error data={state.context} />  }

    </Paper>
    


}

export default AuthStateRoute;