import React, { useState, useEffect } from 'react';
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
import { signInWithEmailLink, isEmailLink } from '../../firebase/auth';

interface EmailLinkVerificationProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const EmailLinkVerification: React.FC<EmailLinkVerificationProps> = ({
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const verifyEmailLink = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if this is a valid email link
        if (!isEmailLink()) {
          setError('Invalid or expired sign-in link. Please request a new one.');
          setIsValidLink(false);
          return;
        }

        setIsValidLink(true);

        // Attempt to sign in with the email link
        await signInWithEmailLink();
        
        // Success - notify parent component
        onSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify email link';
        setError(errorMessage);
        onError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmailLink();
  }, [onSuccess, onError]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

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
            Verifying Sign-in Link...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your email link.
          </Typography>
        </Paper>
      </Box>
    );
  }

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
            MASA Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email Link Verification
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Verification Failed
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
            {error.includes('expired') && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                Email links expire after 15 minutes for security reasons.
              </Typography>
            )}
          </Alert>
        )}

        {!isValidLink && !error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              This doesn't appear to be a valid sign-in link. Please check your email and click the correct link.
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleRetry}
            size="large"
          >
            Try Again
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoBack}
            size="large"
          >
            Back to Sign In
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Need help?</strong> If you're having trouble with email link sign-in, 
            you can use password-based authentication instead. Contact your administrator 
            if you need assistance.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailLinkVerification;
