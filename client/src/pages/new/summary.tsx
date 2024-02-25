import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import Box from '@mui/material/Box';

import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '../../theme/css';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import CircularProgress from '@mui/material/CircularProgress';

interface Summary {
  content: string;
  id: string;
  audioURL?: string;
}

const SummaryComponent: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen(null);
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5600/api/summary/${resourceId}`,
        {
          credentials: 'include',
          method: 'GET',
        }
      );
      const data: Summary = await response.json();
      setSummary(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);

      setIsLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleTTSClick = async () => {
    try {
      await fetch(`http://localhost:5600/api/tts/${summary?.id}`, {
        credentials: 'include',
        method: 'GET',
      });
      fetchSummary();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/background/overlay_2.jpg',
        }),
        paddingTop: 15,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // height: 1,
      }}
      display={'flex'}
      justifyContent={'center'}

      // height={}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        maxWidth={1200}
        sx={{
          boxShadow: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          p: { xs: 2, sm: 4, md: 8 },
          borderRadius: 2,
        }}
      >
        {summary ? (
          <>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              sx={{ width: 1 }}
              onClick={handleOpen}
            >
              <Typography variant="h2">Summary</Typography>
              {summary.audioURL ? (
                <Box
                  display={'flex'}
                  justifyContent={'center'}
                  alignContent={'center'}
                  alignItems={'center'}
                  sx={{
                    boxShadow: 24,
                    borderRadius: 2,
                  }}
                >
                  <audio controls src={summary.audioURL} />
                </Box>
              ) : (
                <Button
                  sx={{
                    boxShadow: 6,
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Box
                    component={'img'}
                    src={'../../../public/ttsIcon.png'}
                    maxWidth={70}
                  />
                </Button>
              )}
            </Box>

            <Popover
              open={!!open}
              anchorEl={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  p: 3,
                  mt: 2,
                  ml: 0.75,
                  width: 300,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6">Convert Text To Speech</Typography>
                {isLoading ? (
                  <Box padding={1}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    className="bg-gradient-to-r from-gray-700 via-gray-900 to-black"
                    onClick={handleTTSClick}
                    // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    TTS
                  </Button>
                )}
              </Box>
            </Popover>

            <Box className="mb-4 prose">
              <Markdown
                className={'text-xl md:text-2xl lg:text-2xl font-normal'}
              >
                {summary.content}
              </Markdown>
            </Box>
          </>
        ) : (
          <CircularProgress size={100} />
        )}
      </Stack>
    </Box>
  );
};

export default SummaryComponent;
