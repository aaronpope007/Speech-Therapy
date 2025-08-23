import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Error as ErrorIcon
} from '@mui/icons-material';

const FirebaseError: React.FC = () => {
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
          maxWidth: 600,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ErrorIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Configuration Required
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Firebase Configuration Missing
          </Typography>
          <Typography variant="body2">
            The application requires Firebase configuration to function properly.
          </Typography>
        </Alert>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          To fix this issue, please follow these steps:
        </Typography>

        <List sx={{ mb: 3, bgcolor: 'grey.50', borderRadius: 1, textAlign: 'left' }}>
          <ListItem>
            <ListItemText
              primary="1. Create Firebase Project"
              secondary="Go to Firebase Console and create a new project"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="2. Enable Firestore Database"
              secondary="Create a Firestore database in your project"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="3. Create Web App"
              secondary="Add a web app to your Firebase project"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="4. Copy Configuration"
              secondary="Copy the Firebase config values to your .env file"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="5. Restart Application"
              secondary="Restart your development server"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your .env file should contain the Firebase configuration values from your project settings.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Need help?</strong> Check the FIREBASE_SETUP.md file for detailed instructions.
          </Typography>
        </Alert>

        <Typography variant="caption" color="text.secondary">
          If you continue to have issues, check the browser console for specific error messages.
        </Typography>
      </Paper>
    </Box>
  );
};

export default FirebaseError; 