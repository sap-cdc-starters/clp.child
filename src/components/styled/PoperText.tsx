import * as React from 'react';
import Box from '@mui/material/Box';
import Popper, { PopperProps } from '@mui/material/Popper';
import Button, { ButtonProps } from '@mui/material/Button/Button';
import { ExpandOutlined } from '@mui/icons-material';

export default function PopperToggle({popper,toggle, children}:React.PropsWithChildren<{popper?: Partial<PopperProps>, toggle?:ButtonProps  }>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      
      <Button aria-describedby={id}  onClick={handleClick} startIcon={<ExpandOutlined/>}  {...toggle} />

      <Popper id={id} open={open} anchorEl={anchorEl} {...popper} sx={{position:'initial'}} >
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
           {children}
        </Box>
      </Popper>
    </div>
  );
}