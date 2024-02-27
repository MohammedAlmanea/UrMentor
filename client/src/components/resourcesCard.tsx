import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
export const ResourcesCard = ({ resource, onResourceDelete }) => {
  const [open, setOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(null);
  };
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    await axios.delete(`http://localhost:5600/api/resources/${id}`, {
      withCredentials: true,
    });
    setIsLoading(false);
    onResourceDelete();
  };

  return (
    <Card
      sx={{
        boxShadow: 24,
        backgroundColor: 'transparent',
        ':hover': {
          borderColor: 'gray',
          borderWidth: '2px',
          borderStyle: 'solid',
          position: 'relative',
        },
      }}
      elevation={20}
    >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Box
          onClick={() => navigate('/resource', { state: { resource } })}
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
        <IconButton
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
          onClick={handleOpen}
        >
          <MoreVertIcon
            sx={{
              fontSize: 30,
              color: 'black',
            }}
          />
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
              width: 100,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isLoading ? (
              <Box padding={1}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <IconButton
                onClick={() => {
                  handleDelete(resource.id);
                }}
              >
                <DeleteIcon
                  sx={{
                    color: 'red',
                  }}
                />
              </IconButton>
            )}
          </Box>
        </Popover>
      </Box>

      <Stack
        spacing={2}
        sx={{ p: 3 }}
        onClick={() => navigate('/resource', { state: { resource } })}
      >
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
