import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  createdAt: string;
  lastLogin: string;
}

// Authentication state management
let currentUser: User | null = null;

export const getCurrentUser = () => currentUser;

// Listen for auth state changes
if (auth) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });
}

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUp = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName
    });

    return userCredential.user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Get auth state
export const getAuthState = () => {
  if (!auth) return Promise.resolve(null);
  
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth!, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}; 