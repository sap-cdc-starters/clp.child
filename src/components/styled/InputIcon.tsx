import React from 'react'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 20,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

type InputIconProps={icon:any} & Partial<InputBaseProps>;
// export const InputIcon=({icon,  ...props}:InputIconProps)=>{
// <Container>
//             <IconWrapper>
//               {icon }
//             </IconWrapper>
//             <StyledInputBase
//               {...props}
//             />
//           </Container>
// }

export default {
  Container,
  Icon: IconWrapper,
  Input: StyledInputBase
}