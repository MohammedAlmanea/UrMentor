import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from '../../theme/css';

import Logo from '../../components/logo';
import GoogleIcon from '@mui/icons-material/Google';
// ----------------------------------------------------------------------
export default function LoginView() {
  const theme = useTheme();
  const handleClick = async () => {
    window.location.href = 'http://localhost:5600/auth/google';
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h3" align="center">
            Welcome To UrMentor
          </Typography>
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleClick}
            sx={{ mt: 10 }}
          >
            Login with
            <Box sx={{ ml: 1 }}>
              <GoogleIcon fontSize='large'/>
            </Box>
          </Button>
        </Card>
      </Stack>
    </Box>
  );
}
