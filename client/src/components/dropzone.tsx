import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export const dropZone = ({ resource }) => {
  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Box
          sx={{
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }}
        >
            
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {resource.title}
        </Link>
      </Stack>
    </Card>
  );
};
