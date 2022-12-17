import { Avatar, AvatarProps, styled } from "@mui/material";

export const StyledAvatar= styled(Avatar)<AvatarProps>(
    ({ theme }) =>({
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.contrastText,
        width: theme.spacing(12),
        height: theme.spacing(12),
    }),
  );

export default Avatar;