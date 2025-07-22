import React from 'react';
import { Box, Typography } from '@mui/material';

const AppTest: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const testAppImport = async () => {
      try {
        console.log('Testing App import...');
        const AppModule = await import('./App');
        console.log('App import successful:', AppModule);
        setLoading(false);
      } catch (err) {
        console.error('App import failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testAppImport();
  }, []);

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
          Testing App Import...
        </Typography>
      </Box>
    );
  }

  if (error) {
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
        <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, maxWidth: 600 }}>
          <Typography variant="h4" color="error" sx={{ mb: 2 }}>
            App Import Failed
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The App component failed to import due to an error:
          </Typography>
          <Typography variant="body2" color="error" sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {error}
          </Typography>
        </Box>
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
        App Import Successful!
      </Typography>
    </Box>
  );
};

export default AppTest; 