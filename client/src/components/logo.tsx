import Box from '@mui/material/Box';

const Logo = ({ sx }) => {
  return (
    <Box
      component="img"
      src="/logo.png"
      sx={{ width: 80, height: 80, cursor: 'pointer', ...sx }}
    />
  );
};

export default Logo;
