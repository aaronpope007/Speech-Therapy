import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  isEmailLink, 
  signInWithEmailLink, 
  completeUserCreation 
} from '../../firebase/auth';

interface EmailLinkVerificationProps {
  onVerificationSuccess: () => void;
  onVerificationError: (error: string) => void;
}

const EmailLinkVerification: React.FC<EmailLinkVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const verifyEmailLink = async () => {
      try {
        setLoading(true);
        setError('');

        // Check if this is an email link
        if (!isEmailLink()) {
          throw new Error('Invalid sign-in link');
        }

        // Check if we're creating a new account or signing in
        const pendingProfile = localStorage.getItem('pendingUserProfile');
        
        if (pendingProfile) {
          // Creating new account
          setIsCreatingAccount(true);
          await completeUserCreation();
        } else {
          // Signing in to existing account
          await signInWithEmailLink();
        }

        onVerificationSuccess();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        setError(errorMessage);
        onVerificationError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmailLink();
  }, [onVerificationSuccess, onVerificationError]);

  if (loading) {
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
            maxWidth: isMobile ? '100%' : 400,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isCreatingAccount ? 'Creating your account...' : 'Signing you in...'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your email link.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error) {
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
            maxWidth: isMobile ? '100%' : 400,
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Verification Failed
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {error}
            </Typography>
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => window.location.href = '/'}
              sx={{ mb: 2 }}
            >
              Return to Sign In
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              The sign-in link may have expired or is invalid. 
              Please request a new sign-in link.
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default EmailLinkVerification;
