import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import MasaMain from "./assets/Components/MasaMain";
import UnifiedAuth from "./components/Auth/UnifiedAuth";

import FirebaseError from "./components/Auth/FirebaseError";
import AuthService, { AuthUser } from "./services/AuthService";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authService = AuthService.getInstance();
        await authService.initialize();
        
        // Set up auth state listener
        const unsubscribe = authService.onAuthStateChange((user) => {
          setUser(user);
          setLoading(false);
        });
        
        // Cleanup on unmount
        return () => {
          unsubscribe();
          authService.destroy();
        };
      } catch (error) {
        console.error('App: Auth initialization failed:', error);
        if (error instanceof Error && error.message.includes('Firebase not initialized')) {
          setFirebaseError(true);
        }
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear the user state
      setUser(null);
    }
  };



  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (firebaseError) {
    return <FirebaseError />;
  }

  return (
    <>
      {user ? (
        <MasaMain onLogout={handleLogout} />
      ) : (
        <UnifiedAuth />
      )}
    </>
  );
}

export default App;
