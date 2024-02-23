import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// ProtectedRoute Component
export const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await axios.get('http://localhost:5600/auth/verify', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
