import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

// Test each import individually
const TestImports: React.FC = () => {
  const [currentTest, setCurrentTest] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const tests = [
    {
      name: 'Basic React + Material-UI',
      component: () => (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">✅ Basic React + Material-UI working</Typography>
        </Box>
      )
    },
    {
      name: 'AuthService Import',
      component: () => {
        try {
          // Test if the file can be imported
          import('../services/AuthService').then(() => {
            console.log('AuthService import successful');
          }).catch((err) => {
            console.error('AuthService import failed:', err);
          });
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">✅ AuthService import test initiated</Typography>
              <Typography variant="body2">Check console for result</Typography>
            </Box>
          );
        } catch (err) {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="error">❌ AuthService import failed</Typography>
              <Typography variant="body2" color="error">{err instanceof Error ? err.message : 'Unknown error'}</Typography>
            </Box>
          );
        }
      }
    },
    {
      name: 'LoginModal Import',
      component: () => {
        try {
          const LoginModal = require('../components/Auth/LoginModal').default;
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">✅ LoginModal import working</Typography>
            </Box>
          );
        } catch (err) {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="error">❌ LoginModal import failed</Typography>
              <Typography variant="body2" color="error">{err instanceof Error ? err.message : 'Unknown error'}</Typography>
            </Box>
          );
        }
      }
    },
    {
      name: 'SetupUsers Import',
      component: () => {
        try {
          const SetupUsers = require('../components/Auth/SetupUsers').default;
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">✅ SetupUsers import working</Typography>
            </Box>
          );
        } catch (err) {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="error">❌ SetupUsers import failed</Typography>
              <Typography variant="body2" color="error">{err instanceof Error ? err.message : 'Unknown error'}</Typography>
            </Box>
          );
        }
      }
    },
    {
      name: 'FirebaseError Import',
      component: () => {
        try {
          const FirebaseError = require('../components/Auth/FirebaseError').default;
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">✅ FirebaseError import working</Typography>
            </Box>
          );
        } catch (err) {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="error">❌ FirebaseError import failed</Typography>
              <Typography variant="body2" color="error">{err instanceof Error ? err.message : 'Unknown error'}</Typography>
            </Box>
          );
        }
      }
    },
    {
      name: 'MasaMain Import',
      component: () => {
        try {
          const MasaMain = require('../assets/Components/MasaMain').default;
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">✅ MasaMain import working</Typography>
            </Box>
          );
        } catch (err) {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="error">❌ MasaMain import failed</Typography>
              <Typography variant="body2" color="error">{err instanceof Error ? err.message : 'Unknown error'}</Typography>
            </Box>
          );
        }
      }
    }
  ];

  const CurrentTestComponent = tests[currentTest].component;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4
      }}
    >
      <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
        Import Test {currentTest + 1} of {tests.length}
      </Typography>
      
      <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 3, mb: 3, minWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Testing: {tests[currentTest].name}
        </Typography>
        <CurrentTestComponent />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => setCurrentTest(Math.max(0, currentTest - 1))}
          disabled={currentTest === 0}
        >
          Previous
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setCurrentTest(Math.min(tests.length - 1, currentTest + 1))}
          disabled={currentTest === tests.length - 1}
        >
          Next
        </Button>
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      )}
    </Box>
  );
};

export default TestImports; 