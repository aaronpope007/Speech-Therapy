import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { sendEmailLink } from '../../firebase/auth';
import { auth } from '../../firebase/config';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  details?: any;
}

const FirebaseDiagnosticRoute: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);

    const newResults: DiagnosticResult[] = [];

    // Test 1: Check if Firebase is initialized
    try {
      if (!auth) {
        newResults.push({
          test: 'Firebase Initialization',
          status: 'fail',
          message: 'Firebase Auth is not initialized. Check your configuration.',
        });
      } else {
        newResults.push({
          test: 'Firebase Initialization',
          status: 'pass',
          message: 'Firebase Auth is properly initialized.',
          details: { authDomain: auth.config.authDomain }
        });
      }
    } catch (error) {
      newResults.push({
        test: 'Firebase Initialization',
        status: 'fail',
        message: `Firebase initialization error: ${error}`,
      });
    }

    // Test 2: Check environment variables
    const envVars = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const missingVars = Object.entries(envVars)
      .filter(([, value]) => !value || value.includes('your-'))
      .map(([key]) => key);

    if (missingVars.length > 0) {
      newResults.push({
        test: 'Environment Variables',
        status: 'fail',
        message: `Missing or invalid environment variables: ${missingVars.join(', ')}`,
        details: envVars
      });
    } else {
      newResults.push({
        test: 'Environment Variables',
        status: 'pass',
        message: 'All required environment variables are set.',
        details: envVars
      });
    }

    // Test 3: Check current URL
    newResults.push({
      test: 'Current URL',
      status: 'pass',
      message: `Current URL: ${window.location.href}`,
      details: {
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search
      }
    });

    // Test 4: Check if we're on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      newResults.push({
        test: 'Localhost Detection',
        status: 'pass',
        message: 'Running on localhost - this is expected for development.',
      });
    } else {
      newResults.push({
        test: 'Localhost Detection',
        status: 'fail',
        message: `Not running on localhost: ${window.location.hostname}`,
      });
    }

    setResults(newResults);
    setLoading(false);
  };

  const testEmailLink = async () => {
    if (!testEmail) return;

    setLoading(true);
    try {
      await sendEmailLink(testEmail);
      setResults(prev => [...prev, {
        test: 'Email Link Test',
        status: 'pass',
        message: `Successfully sent email link to ${testEmail}`,
      }]);
    } catch (error) {
      setResults(prev => [...prev, {
        test: 'Email Link Test',
        status: 'fail',
        message: `Failed to send email link: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { email: testEmail, error }
      }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Firebase Diagnostic Tool
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This tool helps diagnose Firebase email link authentication issues.
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Diagnostic Results
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography>Running diagnostics...</Typography>
          </Box>
        )}

        <List>
          {results.map((result, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: result.status === 'pass' ? 'success.main' : 
                                 result.status === 'fail' ? 'error.main' : 'warning.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {result.test}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: result.status === 'pass' ? 'success.light' : 
                                   result.status === 'fail' ? 'error.light' : 'warning.light',
                          color: result.status === 'pass' ? 'success.dark' : 
                                 result.status === 'fail' ? 'error.dark' : 'warning.dark',
                        }}
                      >
                        {result.status.toUpperCase()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {result.message}
                      </Typography>
                      {result.details && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                            {JSON.stringify(result.details, null, 2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Button
          variant="contained"
          onClick={runDiagnostics}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Re-run Diagnostics
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Email Link
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <input
            type="email"
            placeholder="Enter email to test"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <Button
            variant="contained"
            onClick={testEmailLink}
            disabled={loading || !testEmail}
          >
            Test Email Link
          </Button>
        </Box>

        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Common Issues:</strong>
          </Typography>
          <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>Email Link Authentication not enabled in Firebase Console</li>
            <li>localhost not added to authorized domains</li>
            <li>Email templates not configured</li>
            <li>Firebase project not properly configured</li>
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default FirebaseDiagnosticRoute;
