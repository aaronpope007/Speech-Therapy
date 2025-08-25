import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, Button, Typography } from '@mui/material';
import MasaMain from "./assets/Components/MasaMain";
import UnifiedAuth from "./components/Auth/UnifiedAuth";
import SimpleAuthFallback from "./components/Auth/SimpleAuthFallback";
import FirebaseDiagnostic from "./components/Auth/FirebaseDiagnostic";
import EmailLinkVerification from "./components/Auth/EmailLinkVerification";
import EmailLinkTest from "./components/Auth/EmailLinkTest";
import FirebaseError from "./components/Auth/FirebaseError";
import AuthService, { AuthUser } from "./services/AuthService";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

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

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setAuthTimeout(true);
      setLoading(false);
    }, 5000); // 5 second timeout

    initializeAuth();

    return () => clearTimeout(timeoutId);
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

  const handleBypassAuth = () => {
    setAuthTimeout(false);
    setLoading(false);
  };

  const handleSimpleLogin = () => {
    // Set a mock user for development
    const mockUser: AuthUser = {
      uid: 'dev-user-123',
      email: 'developer@masa.com',
      displayName: 'Developer User',
      role: 'admin',
      organization: 'MASA Development',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
      emailVerified: true
    };
    setUser(mockUser);
  };

  const handleEmailLinkSuccess = () => {
    // Email link verification was successful, user will be set by auth state listener
    console.log('Email link verification successful');
  };

  const handleEmailLinkError = (error: string) => {
    console.error('Email link verification failed:', error);
    // You could show a toast notification here
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          gap: 2
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
          Initializing MASA Assessment...
        </Typography>
        {authTimeout && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
              Authentication is taking longer than expected. This might be due to Firebase configuration.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={handleBypassAuth}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Continue Without Authentication
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setShowDiagnostic(true)}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': { borderColor: 'grey.300' }
                }}
              >
                Run Diagnostic
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  if (firebaseError) {
    return <FirebaseError />;
  }

  if (showDiagnostic) {
    return (
      <FirebaseDiagnostic 
        onRetry={() => {
          setShowDiagnostic(false);
          setAuthTimeout(false);
          setLoading(true);
          // Restart the auth initialization
          const authService = AuthService.getInstance();
          authService.initialize().then(() => {
            setLoading(false);
          }).catch(() => {
            setLoading(false);
          });
        }} 
      />
    );
  }

  return (
    <Routes>
      {/* Email link verification route */}
      <Route 
        path="/auth/verify" 
        element={
          <EmailLinkVerification 
            onSuccess={handleEmailLinkSuccess}
            onError={handleEmailLinkError}
          />
        } 
      />
      
      {/* Email link test route (for development/testing only) */}
      {import.meta.env.DEV && (
        <Route 
          path="/test/email-link" 
          element={<EmailLinkTest />} 
        />
      )}
      
      {/* Main app routes */}
      <Route 
        path="/*" 
        element={
          user ? (
            <MasaMain onLogout={handleLogout} />
          ) : authTimeout ? (
            <SimpleAuthFallback onLoginSuccess={handleSimpleLogin} />
          ) : (
            <UnifiedAuth />
          )
        } 
      />
    </Routes>
  );
}

export default App;
