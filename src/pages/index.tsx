// import logo from "./logo.svg";
import React from "react";
import "./index.css";
import "../styles/globals.css";
import { responsiveFontSizes, StyledEngineProvider, ThemeProvider} from "@mui/material";
import { theme } from "../theme/AppTheme";
import { Dashbaord } from "./Dashbaord";
import { useRoutes } from "react-router";

 
export function AppRoutes(props:any) {
    let element = useRoutes([
      {
        path: "/",
        element: <Dashbaord {...props} />
      }

    ]);

    return element;
  }
const App = () => {


 
    const responsiveTheme = responsiveFontSizes(theme);

     return (
        <div>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={responsiveTheme}> 
                      <AppRoutes />
                </ThemeProvider>
            </StyledEngineProvider>
        </div>
    );
};




export default App;
