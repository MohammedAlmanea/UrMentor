import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const Logo = ({ sx }) => {
  const navigate = useNavigate();
  return (
    <Box
      component="img"
      src="/logo.png"
      onClick={() => navigate('/dashboard')}
      sx={{ width: 80, height: 80, cursor: 'pointer', ...sx }}
    />
  );
};

export default Logo;
