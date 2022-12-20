import { styled } from "@mui/material";

export const StyledForm= styled('form')(
    ({ theme }) =>({
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "transparent",
        margin: theme.spacing(1),

        

    }),
  );
 
export default StyledForm;