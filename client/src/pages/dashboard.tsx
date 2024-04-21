import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { ResourcesCard } from './../components/resourcesCard';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import axios from 'axios';
import Box from '@mui/material/Box';

import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from './../theme/css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

// ----------------------------------------------------------------------

type Resource = {
  id: string;
  title: string;
  userId: string;
};

export default function Dashboard() {
  const [resource, setResource] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5600/api/resources', {
        withCredentials: true,
      });
      setResource(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching objects:', error);
    }
  };
  useEffect(() => {
    fetchResources();
  }, []);

  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    if (acceptedFiles.length > 1) return;
    try {
      setIsLoading(true);
      await axios.post('http://localhost:5600/api/upload', formData, {
        withCredentials: true,
      });

      fetchResources();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  // const navigate = useNavigate();
  const theme = useTheme();

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemm = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
        minHeight: '100vh',
      }}
      // height={}
    >
      <Container>
        <Typography variant="h1" sx={{ mb: 5 }}>
          Resources
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            width: 1,
            height: 150,
            mb: 10,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'gray',
          }}
          boxShadow={24}
          display="flex"
          flexDirection={'column'}
          alignItems="center"
          justifyContent="center"
          className="bg-gradient-to-tr from-gray-400/40 via-slate-300/40 to-gray-200/40"
        >
          {isLoading ? (
            <CircularProgress size={80} />
          ) : (
            <>
              <input {...getInputProps()} />
              <Typography variant="h5" className="italic">
                Drag and drop or click to upload file
              </Typography>
              <UploadFileIcon fontSize="large" />
            </>
          )}
        </Box>
          {isLoading ? (
            <CircularProgress size={80}/>
          ) : (
            <motion.div variants={container} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {resource.map((item) => (
              <Grid
                key={item.id}
                xs={12}
                sm={6}
                md={3}
                marginX={6}
                marginBottom={3}
              >
                <motion.div variants={itemm}>
                  <ResourcesCard
                    resource={item}
                    key={item.id}
                    onResourceDelete={fetchResources}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
          )}
      </Container>
    </Box>
  );
}
