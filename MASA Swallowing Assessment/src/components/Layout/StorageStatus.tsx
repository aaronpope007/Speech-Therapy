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
  DialogActions
} from '@mui/material';
import { 
  Cloud as CloudIcon, 
  Storage as StorageIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import { EnhancedPatientService } from '../../services/EnhancedPatientService';

const StorageStatus: React.FC = () => {
  const [status, setStatus] = useState(EnhancedPatientService.getStorageStatus());
  const [loading, setLoading] = useState(false);
  const [migrationDialog, setMigrationDialog] = useState(false);
  const [migrationResult, setMigrationResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Update status periodically
    const interval = setInterval(() => {
      setStatus(EnhancedPatientService.getStorageStatus());
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