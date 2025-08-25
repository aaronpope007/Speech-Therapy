import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AuthService from '../../services/AuthService';

const EmailLinkTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testEmailLink = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setTestResults([]);

    try {
      addTestResult('Starting email link test...');
      
      const authService = AuthService.getInstance();
      addTestResult('AuthService instance created');
      
      await authService.sendEmailLink(email);
      addTestResult('Email link sent successfully');
      
      setSuccess(true);
      addTestResult('Test completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      addTestResult(`Test failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testIsEmailLink = () => {
    const authService = AuthService.getInstance();
    const isLink = authService.isEmailLink();
    addTestResult(`Current URL is email link: ${isLink}`);
  };

  const clearResults = () => {
    setTestResults([]);
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
            Email Link Test
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test the email link authentication after Dynamic Links migration
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email link sent successfully! Check your email and click the link to test authentication.
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={testEmailLink}
              disabled={loading || !email}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Test Link'}
            </Button>

            <Button
              variant="outlined"
              onClick={testIsEmailLink}
              disabled={loading}
            >
              Check Current URL
            </Button>

            <Button
              variant="outlined"
              onClick={clearResults}
              disabled={loading}
            >
              Clear Results
            </Button>
          </Box>
        </Box>

        {testResults.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test Results:
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 200,
                overflow: 'auto',
                bgcolor: 'grey.50',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {testResults.map((result, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  {result}
                </Typography>
              ))}
            </Paper>
          </Box>
        )}

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Test Instructions:</strong>
            <br />
            1. Enter your email address above
            <br />
            2. Click "Send Test Link" to send an email link
            <br />
            3. Check your email and click the link
            <br />
            4. Verify that you're redirected to the verification page
            <br />
            5. Complete the authentication process
            <br />
            <br />
            <strong>Expected Behavior:</strong>
            <br />
            • Email link should be sent successfully
            <br />
            • Link should redirect to /auth/verify
            <br />
            • Authentication should complete without errors
            <br />
            • No Dynamic Links dependency should be required
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailLinkTest;
