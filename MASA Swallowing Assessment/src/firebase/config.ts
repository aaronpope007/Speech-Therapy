import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Security check: Ensure we're not exposing placeholder values
const validateConfig = (config: any) => {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  const missingFields = requiredFields.filter(field => 
    !config[field] || 
    config[field].includes('your-') || 
    config[field].includes('placeholder')
  );
  
  if (missingFields.length > 0) {
    console.error('Missing or invalid Firebase configuration:', missingFields);
    return false;
  }
  
  return true;
};

// Your Firebase configuration
// Use environment variables for production security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase with error handling and security validation
let app;
try {
  // Validate configuration before initializing
  if (!validateConfig(firebaseConfig)) {
    throw new Error('Invalid Firebase configuration. Please check your .env file.');
  }
  
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback to localStorage-only mode
  app = null;
}

// Initialize Firestore only if Firebase is available
export const db = app ? getFirestore(app) : null;

// Initialize Auth only if Firebase is available
export const auth = app ? getAuth(app) : null;

export default app; 