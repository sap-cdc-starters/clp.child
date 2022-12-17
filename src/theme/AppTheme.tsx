import { createTheme, ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
   palette: {
        // secondary: {
        //     main: '#999'
        // },
        primary: {
            main: '#7a7a7a'
        }

    },

    typography: {
        h5: {
            font: 'Questrial',
            fontStyle: 'lighter',
            fontWeight: 'lighter',
            fontSize: '14px',
            fontFamily: "'Questrial', sans-serif !important"
        },
        button:{
            font: 'Questrial',
            fontStyle: 'lighter',
            fontWeight: 'lighter',
            fontFamily: "'Questrial', sans-serif !important",
            fontSize: '14px',
            opacity: 0.8
        },
        fontFamily: [
            'Questrial',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',

            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
};

export const theme = createTheme(themeOptions);