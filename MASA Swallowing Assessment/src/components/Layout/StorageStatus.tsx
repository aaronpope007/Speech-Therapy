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
  ExpandMore as ExpandMoreIcon,
  DataObject as DataObjectIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { EnhancedPatientService } from '../../services/EnhancedPatientService';
import { FirebaseService } from '../../services/FirebaseService';
import { DemoDataGenerator } from '../../utils/generateDemoData';

const StorageStatus: React.FC = () => {
  const [status, setStatus] = useState(EnhancedPatientService.getStorageStatus());
  const [loading, setLoading] = useState(false);
  const [migrationDialog, setMigrationDialog] = useState(false);
  const [migrationResult, setMigrationResult] = useState<'success' | 'error' | null>(null);
  const [demoDataDialog, setDemoDataDialog] = useState(false);
  const [storageStats, setStorageStats] = useState(DemoDataGenerator.getStorageStats());
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
      setStorageStats(DemoDataGenerator.getStorageStats());
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

  const handleGenerateDemoData = () => {
    if (window.confirm('This will generate demo patient data. Continue?')) {
      DemoDataGenerator.generateDemoData();
      setStorageStats(DemoDataGenerator.getStorageStats());
      setDemoDataDialog(false);
      // Refresh the page to show new data
      window.location.reload();
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL patient and assessment data? This cannot be undone.')) {
      DemoDataGenerator.clearAllData();
      setStorageStats(DemoDataGenerator.getStorageStats());
      // Refresh the page
      window.location.reload();
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

      {/* Demo Data Controls - Only show when using localStorage */}
      {status.currentMethod === 'localStorage' && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<DataObjectIcon />}
            onClick={() => setDemoDataDialog(true)}
            variant="outlined"
            color="secondary"
          >
            Generate Demo Data
          </Button>
          {storageStats.patientCount > 0 && (
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleClearAllData}
              variant="outlined"
              color="error"
            >
              Clear All Data
            </Button>
          )}
        </Box>
      )}

      {/* Storage Statistics */}
      {status.currentMethod === 'localStorage' && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Local Storage Statistics:
          </Typography>
          <Typography variant="body2">
            Patients: {storageStats.patientCount} | Assessments: {storageStats.assessmentCount} | 
            Size: {(storageStats.totalStorageSize / 1024).toFixed(2)} KB
          </Typography>
        </Box>
      )}

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

      {/* Demo Data Dialog */}
      <Dialog open={demoDataDialog} onClose={() => setDemoDataDialog(false)}>
        <DialogTitle>Generate Demo Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will create 5 sample patients with 1-3 assessments each. 
            This is useful for demonstrating the application without real patient data.
          </Typography>
          {storageStats.patientCount > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You already have {storageStats.patientCount} patient(s) in storage. 
              Generating demo data will add to your existing data.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDemoDataDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateDemoData}
            variant="contained"
            color="secondary"
            startIcon={<DataObjectIcon />}
          >
            Generate Demo Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StorageStatus; 