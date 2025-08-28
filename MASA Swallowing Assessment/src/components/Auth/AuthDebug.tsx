import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

const AuthDebug: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<string>('checking');
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check current auth state
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setAuthState(user ? 'authenticated' : 'not-authenticated');
        console.log('Auth state changed:', user);
      });

      return () => unsubscribe();
    } else {
      setAuthState('firebase-not-initialized');
    }

    // Check localStorage
    const firebaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('firebase') || 
      key.includes('auth') || 
      key.includes('user')
    );
    
    const firebaseData: Record<string, string> = {};
    firebaseKeys.forEach(key => {
      firebaseData[key] = localStorage.getItem(key) || '';
    });
    setLocalStorage(firebaseData);
  }, []);

  const clearAuth = () => {
    if (auth) {
      auth.signOut();
    }
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('auth') || key.includes('user')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  const checkAuthState = () => {
    if (auth) {
      console.log('Current user:', auth.currentUser);
      console.log('Auth state:', auth.currentUser ? 'authenticated' : 'not authenticated');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Authentication Debug
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This tool helps debug authentication issues and shows the current auth state.
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Authentication State
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Firebase Auth Status"
              secondary={`Status: ${authState}`}
            />
          </ListItem>
          
          {currentUser && (
            <>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Current User"
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        <strong>Email:</strong> {currentUser.email}
                      </Typography>
                      <Typography variant="body2">
                        <strong>UID:</strong> {currentUser.uid}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email Verified:</strong> {currentUser.emailVerified ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Provider:</strong> {currentUser.providerData[0]?.providerId || 'Unknown'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            onClick={checkAuthState}
          >
            Check Auth State
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={clearAuth}
          >
            Clear Auth & Reload
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Local Storage (Firebase Related)
        </Typography>
        
        {Object.keys(localStorage).length > 0 ? (
          <List>
            {Object.entries(localStorage).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key}
                  secondary={
                    <Box>
                      <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                        {value.length > 200 ? `${value.substring(0, 200)}...` : value}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Firebase-related localStorage entries found.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AuthDebug;
