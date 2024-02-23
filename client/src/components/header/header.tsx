import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import { HEADER } from './config-layout';
import AccountPopover from './account-popover';
import Logo from '../logo';
import { bgBlur } from '../../theme/css';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        marginBottom:2,
        boxShadow:'none',
        height: HEADER.H_DESKTOP,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
          opacity: 0.3
        })
      }}
      >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5},
        }}
      >
        <Logo sx={{}}/>
        <Box sx={{ flexGrow: 1 }} />
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccountPopover />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}