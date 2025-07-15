import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  useTheme,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { signUp } from '../../firebase/auth';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
  onSignUpSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    organization: '',
    role: 'clinician' as 'clinician' | 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<'clinician' | 'admin'>) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value as 'clinician' | 'admin'
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      onSignUpSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError(errorMessage);
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
            Join MASA Assessment platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignUp}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.displayName}
            onChange={handleChange('displayName')}
            margin="normal"
            required
            autoComplete="name"
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            margin="normal"
            required
            autoComplete="email"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Organization"
            value={formData.organization}
            onChange={handleChange('organization')}
            margin="normal"
            required
            placeholder="Hospital, Clinic, or Practice Name"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              label="Role"
              onChange={handleSelectChange}
            >
              <MenuItem value="clinician">Clinician</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            margin="normal"
            required
            autoComplete="new-password"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            margin="normal"
            required
            autoComplete="new-password"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
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
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUpForm; 