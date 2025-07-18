import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Chip, 
  Button, 
  Alert, 
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Cloud as CloudIcon, 
  Storage as StorageIcon,
  Sync as SyncIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { EnhancedPatientService } from '../../services/EnhancedPatientService';
import { FirebaseService } from '../../services/FirebaseService';

const StorageStatus: React.FC = () => {
  const [status, setStatus] = useState(EnhancedPatientService.getStorageStatus());
  const [loading, setLoading] = useState(false);
  const [migrationDialog, setMigrationDialog] = useState(false);
  const [migrationResult, setMigrationResult] = useState<'success' | 'error' | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    firebaseAvailable: false,
    envVars: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not Set',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not Set',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not Set',
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Not Set'
    }
  });

  useEffect(() => {
    // Update status periodically
    const interval = setInterval(() => {
      setStatus(EnhancedPatientService.getStorageStatus());
      setDebugInfo({
        firebaseAvailable: FirebaseService.isAvailable(),
        envVars: {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not Set',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set',
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not Set',
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not Set',
          appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Not Set'
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMigration = async () => {
    setLoading(true);
    setMigrationResult(null);
    
    try {
      await EnhancedPatientService.forceMigrationToFirebase();
      setMigrationResult('success');
      setStatus(EnhancedPatientService.getStorageStatus());
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationResult('error');
    } finally {
      setLoading(false);
    }
  };

  const getStorageIcon = () => {
    return status.currentMethod === 'firebase' ? <CloudIcon /> : <StorageIcon />;
  };

  const getStorageColor = () => {
    return status.currentMethod === 'firebase' ? 'success' : 'default';
  };

  const getStorageLabel = () => {
    return status.currentMethod === 'firebase' ? 'Firebase' : 'Local Storage';
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip
          icon={getStorageIcon()}
          label={getStorageLabel()}
          color={getStorageColor()}
          variant="outlined"
          size="small"
        />
        
        {status.firebaseAvailable && status.currentMethod === 'localStorage' && (
          <Button
            size="small"
            startIcon={<SyncIcon />}
            onClick={() => setMigrationDialog(true)}
            variant="outlined"
            color="primary"
          >
            Migrate to Firebase
          </Button>
        )}
        
        {!status.firebaseAvailable && (
          <Chip
            label="Firebase Unavailable"
            color="warning"
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Debug Information */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">Debug Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              <strong>Firebase Available:</strong> {debugInfo.firebaseAvailable ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              <strong>Current Storage:</strong> {status.currentMethod}
            </Typography>
            <Typography variant="body2">
              <strong>Migration Completed:</strong> {status.migrationCompleted ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Environment Variables:</strong>
            </Typography>
            {Object.entries(debugInfo.envVars).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ ml: 2 }}>
                {key}: {value}
              </Typography>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Migration Dialog */}
      <Dialog open={migrationDialog} onClose={() => setMigrationDialog(false)}>
        <DialogTitle>Migrate to Firebase</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will migrate all your local data to Firebase cloud storage. 
            Your data will be safely backed up and accessible from any device.
          </Typography>
          
          {migrationResult === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Migration completed successfully! Your data is now stored in Firebase.
            </Alert>
          )}
          
          {migrationResult === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Migration failed. Your local data remains unchanged.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMigrationDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMigration}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <SyncIcon />}
            variant="contained"
            color="primary"
          >
            {loading ? 'Migrating...' : 'Start Migration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StorageStatus; 