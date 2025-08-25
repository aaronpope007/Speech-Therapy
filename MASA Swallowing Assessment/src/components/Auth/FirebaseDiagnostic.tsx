import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

interface FirebaseDiagnosticProps {
  onRetry: () => void;
}

const FirebaseDiagnostic: React.FC<FirebaseDiagnosticProps> = ({ onRetry }) => {
  const [diagnostics, setDiagnostics] = useState<Array<{
    name: string;
    status: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = () => {
    const results: Array<{
      name: string;
      status: 'success' | 'error' | 'warning' | 'info';
      message: string;
    }> = [];

    // Check environment variables
    const envVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = envVars.filter(varName => !import.meta.env[varName]);
    
    if (missingVars.length === 0) {
      results.push({
        name: 'Environment Variables',
        status: 'success',
        message: 'All Firebase environment variables are configured'
      });
    } else {
      results.push({
        name: 'Environment Variables',
        status: 'error',
        message: `Missing environment variables: ${missingVars.join(', ')}`
      });
    }

    // Check if Firebase config file exists
    try {
      const firebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY;
      if (firebaseConfig) {
        results.push({
          name: 'Firebase Configuration',
          status: 'success',
          message: 'Firebase configuration is present'
        });
      } else {
        results.push({
          name: 'Firebase Configuration',
          status: 'error',
          message: 'Firebase configuration is missing'
        });
      }
    } catch (error) {
      results.push({
        name: 'Firebase Configuration',
        status: 'error',
        message: 'Error loading Firebase configuration'
      });
    }

    // Check network connectivity
    results.push({
      name: 'Network Connectivity',
      status: navigator.onLine ? 'success' : 'error',
      message: navigator.onLine ? 'Internet connection is available' : 'No internet connection'
    });

    // Check if we're in development mode
    results.push({
      name: 'Development Mode',
      status: import.meta.env.DEV ? 'info' : 'warning',
      message: import.meta.env.DEV ? 'Running in development mode' : 'Running in production mode'
    });

    setDiagnostics(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 2 : 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: isMobile ? 3 : 4,
          width: '100%',
          maxWidth: isMobile ? '100%' : 600,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Firebase Diagnostic
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Checking your Firebase configuration
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            This diagnostic tool helps identify common Firebase configuration issues. 
            Review the results below and fix any errors before proceeding.
          </Typography>
        </Alert>

        <List sx={{ mb: 3 }}>
          {diagnostics.map((diagnostic, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              <ListItemIcon>
                {getStatusIcon(diagnostic.status)}
              </ListItemIcon>
              <ListItemText
                primary={diagnostic.name}
                secondary={diagnostic.message}
                primaryTypographyProps={{
                  color: getStatusColor(diagnostic.status),
                  fontWeight: 'bold'
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={runDiagnostics}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'grey.300' } }}
          >
            Run Diagnostics Again
          </Button>
          <Button
            variant="contained"
            onClick={onRetry}
            sx={{ 
              bgcolor: 'white', 
              color: '#667eea',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Try Authentication Again
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Next Steps:</strong> If you see errors above, please check your Firebase Console setup 
            and ensure all environment variables are properly configured in your .env.local file.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FirebaseDiagnostic;
