import { Paper, PaperProps,  styled} from "@mui/material";

export const StyledPaper = styled(Paper)<PaperProps>(
    ({ theme }) =>({
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    
        
    }),
  );
  export const StyledDiv = styled('div')(
    ({ theme }) =>({
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: theme.spacing(1),
    }),
  );
 export default StyledDiv;