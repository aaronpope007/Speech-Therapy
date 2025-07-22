import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function SimpleApp() {
  console.log('SimpleApp: Component rendering...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SimpleApp: useEffect running...');
    setTimeout(() => {
      console.log('SimpleApp: Setting loading to false');
      setLoading(false);
    }, 1000);
  }, []);

  console.log('SimpleApp: Render state - loading:', loading);
  
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Typography variant="h4" sx={{ color: 'white' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Typography variant="h4" sx={{ color: 'white' }}>
        Simple App Working!
      </Typography>
    </Box>
  );
}

export default SimpleApp; 