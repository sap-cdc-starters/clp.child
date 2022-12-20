import { Avatar, AvatarProps, styled } from "@mui/material";

export const StyledAvatar= styled(Avatar)<AvatarProps>(
    ({ theme }) =>({
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        width: theme.spacing(20),
        height: theme.spacing(20),
    }),
  );

export default Avatar;