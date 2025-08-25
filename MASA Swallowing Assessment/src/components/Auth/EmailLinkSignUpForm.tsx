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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { createUserWithEmailLink } from '../../firebase/auth';

interface EmailLinkSignUpFormProps {
  onSwitchToPassword: () => void;
  onSwitchToLogin: () => void;
}

const EmailLinkSignUpForm: React.FC<EmailLinkSignUpFormProps> = ({
  onSwitchToPassword,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    organization: '',
    role: 'clinician' as 'clinician' | 'admin',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.displayName.trim()) {
      return 'Full name is required';
    }
    if (!formData.organization.trim()) {
      return 'Organization is required';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createUserWithEmailLink(formData.email, {
        displayName: formData.displayName,
        role: formData.role,
        organization: formData.organization,
        username: formData.username || undefined
      });
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send sign-up link');
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createUserWithEmailLink(formData.email, {
        displayName: formData.displayName,
        role: formData.role,
        organization: formData.organization,
        username: formData.username || undefined
      });
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to send sign-up link');
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
          maxWidth: isMobile ? '100%' : 500,
          borderRadius: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up with email link
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
              Sign-up link sent!
            </Typography>
            <Typography variant="body2">
              Check your email and click the link to complete your account setup. 
              The link will expire in 15 minutes.
            </Typography>
          </Alert>
        )}

        <form onSubmit={handleSignUp}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Full Name"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            margin="normal"
            required
            autoComplete="name"
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Organization"
            value={formData.organization}
            onChange={handleInputChange('organization')}
            margin="normal"
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" disabled={loading} sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={handleInputChange('role')}
            >
              <MenuItem value="clinician">Speech Language Pathologist</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Username (Optional)"
            value={formData.username}
            onChange={handleInputChange('username')}
            margin="normal"
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !formData.email || !formData.displayName || !formData.organization}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Sign-up Link'}
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
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToLogin}
              sx={{ cursor: 'pointer' }}
            >
              Sign in
            </Link>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Prefer password sign-up?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToPassword}
              sx={{ cursor: 'pointer' }}
            >
              Use password
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>How it works:</strong> Enter your details and we'll send you a secure sign-up link. 
            Click the link in your email to complete your account setup. No password needed!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmailLinkSignUpForm;
