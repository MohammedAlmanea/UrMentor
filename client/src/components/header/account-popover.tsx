import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    photoURL: ''
  });
  const [isLoading, setisLoading] = useState(false);
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const fetchUser = async () => {
    try {
      setisLoading(true)
      const response = await axios.get('http://localhost:5600/auth/user', {
        withCredentials: true,
      });
       
      setUser(response.data)
      console.log(response.data);
      
      setisLoading(false)
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const response = await axios.get('http://localhost:5600/auth/logout',{
      withCredentials: true,
    })
    if (response.status === 200 ) {
      navigate('/');
    }
    setOpen(null);
  }

  if (isLoading) {
    return <div></div>
  }
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08)
        }}
      >
        <Avatar
          src={user.photoURL}
          alt={user.name}
          sx={{
            width: 45,
            height: 45,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}