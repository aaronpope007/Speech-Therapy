import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { setupDefaultUsers } from '../../utils/setupFirebaseUsers';

interface SetupUsersProps {
  onSetupComplete: () => void;
}

const SetupUsers: React.FC<SetupUsersProps> = ({ onSetupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await setupDefaultUsers();
      setSuccess(true);
      setTimeout(() => {
        onSetupComplete();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <SettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            MASA Setup
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome to MASA Assessment! This appears to be your first time running the application. 
          We need to set up the default user accounts in Firebase.
        </Typography>

        {success ? (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Setup completed successfully!
            </Typography>
            <Typography variant="body2">
              Default users have been created. You can now login with the credentials below.
            </Typography>
          </Alert>
        ) : error ? (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Setup failed
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Default Users
            </Typography>
            <Typography variant="body2">
              The following default accounts will be created:
            </Typography>
          </Alert>
        )}

        <List sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
          <ListItem>
            <ListItemText
              primary="Administrator"
              secondary="Username: admin | Password: [configured in .env]"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Clinician"
              secondary="Username: clinician | Password: [configured in .env]"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          After setup, you can change these passwords through the login interface.
        </Typography>

        {!success && (
          <Button
            variant="contained"
            size="large"
            onClick={handleSetup}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SettingsIcon />}
            sx={{ py: 1.5, px: 4 }}
          >
            {loading ? 'Setting up...' : 'Setup Default Users'}
          </Button>
        )}

        {success && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Redirecting to login...
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default SetupUsers; 