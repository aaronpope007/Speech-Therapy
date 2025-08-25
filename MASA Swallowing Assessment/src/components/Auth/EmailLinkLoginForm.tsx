import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Link,
} from '@mui/material';
import { sendEmailLink } from '../../firebase/auth';

interface EmailLinkLoginFormProps {
  onSwitchToPassword: () => void;
  onSwitchToSignUp: () => void;
}

const EmailLinkLoginForm: React.FC<EmailLinkLoginFormProps> = ({ 
  onSwitchToPassword, 
  onSwitchToSignUp 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendEmailLink(email);
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send sign-in link');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendEmailLink(email);
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send sign-in link');
    } finally {
      setLoading(false);
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
          maxWidth: isMobile ? '100%' : 400,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            MASA Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in with email link
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Sign-in link sent!
            </Typography>
            <Typography variant="body2">
              Check your email and click the link to sign in. The link will expire in 15 minutes.
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleSendLink}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !email}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Sign-in Link'}
          </Button>

          {success && (
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendLink}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Resend Link'}
            </Button>
          )}
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Prefer password sign-in?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToPassword}
              sx={{ cursor: 'pointer' }}
            >
              Use password
            </Link>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToSignUp}
              sx={{ cursor: 'pointer' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>How it works:</strong> Enter your email and we'll send you a secure sign-in link. 
            Click the link in your email to access your account. No password needed!
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            <strong>Note:</strong> Email links expire after 15 minutes for security. 
            If you're on a mobile device, make sure to open the link in your browser.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailLinkLoginForm;
