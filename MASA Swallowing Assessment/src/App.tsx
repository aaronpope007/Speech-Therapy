import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import MasaMain from "./assets/Components/MasaMain";
import LoginModal from "./components/Auth/LoginModal";
import SetupUsers from "./components/Auth/SetupUsers";
import FirebaseError from "./components/Auth/FirebaseError";
import AuthService, { AuthUser } from "./services/AuthService";

// When vanilla is completed, make another, short form app with button groups in MUI to select.
// Can display longer (verbose) text on hover or something

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authService = AuthService.getInstance();
        authService.initialize();
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        // If no user is logged in, check if we need setup
        if (!currentUser) {
          // For now, we'll show setup if no user is logged in
          // In a real app, you might want to check if any users exist in Firebase
          setNeedsSetup(true);
        }
      } catch (error) {
        console.error('App: Auth state check failed:', error);
        // If Firebase is not configured, show error message
        if (error instanceof Error && error.message.includes('Firebase not initialized')) {
          setFirebaseError(true);
        } else {
          setNeedsSetup(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLoginModal(true);
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

  return (
    <>
      {user ? (
        <MasaMain onLogout={handleLogout} />
      ) : firebaseError ? (
        <FirebaseError />
      ) : needsSetup ? (
        <SetupUsers onSetupComplete={handleSetupComplete} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <LoginModal
            open={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </Box>
      )}
    </>
  );
}

export default App;
