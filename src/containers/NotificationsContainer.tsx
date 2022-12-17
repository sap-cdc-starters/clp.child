import React, {useEffect} from "react";
import { Paper, Typography , styled,PaperProps} from "@mui/material";
import {NotificationUpdatePayload} from "../models";
import {AuthService} from "../machines/authMachine";
import {NotificationsService} from "../machines/notificationsMachine";
import {useActor} from "@xstate/react";
import {useAppLogger, NotificationsList} from "../logger";
 
export const StyledPaper = styled(Paper)<PaperProps>(
    ({ theme }) =>({
        minHeight: "90vh",
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    
        
    }),
  );



export interface Props {
    authService: AuthService;
    notificationsService: NotificationsService;
}

const NotificationsContainer: React.FC<Props> = ({authService, notificationsService}) => {
    const [notificationsState] = useActor(notificationsService);


    useAppLogger(authService , notificationsService.send );

   

    const updateNotification = (payload: NotificationUpdatePayload) => {
    };

    return (
        <Paper  >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Notifications
            </Typography>
            <NotificationsList
                notifications={notificationsState?.context?.notifications!}
                updateNotification={updateNotification}
            />
        </Paper>
    );
};

export default NotificationsContainer;
function generateUniqueID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}