import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------
export const ResourcesCard = ({ resource }) => {
  return (
    <Card
      sx={{
        boxShadow: 24,
        backgroundColor: 'transparent',
        ':hover': {
          borderColor: 'gray',
          borderWidth: '2px', 
          borderStyle: 'solid', 
        },
      }}
      elevation={20}
    >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Box
          component="img"
          alt={resource.title}
          src={'./file3.jpg'}
          sx={{
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
          fontSize={18}
        >
          {resource.title}
        </Link>
      </Stack>
    </Card>
  );
};
