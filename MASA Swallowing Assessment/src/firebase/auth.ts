import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  query,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  username?: string;
}

export interface AuthUser extends UserProfile {
  emailVerified: boolean;
}

// Authentication state management
let currentUser: AuthUser | null = null;
const authStateListeners: ((user: AuthUser | null) => void)[] = [];

export const getCurrentUser = () => currentUser;

// Listen for auth state changes
if (auth) {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        // Get user profile from Firestore
        const userProfile = await getUserProfile(firebaseUser.uid);
        currentUser = {
          ...userProfile,
          emailVerified: firebaseUser.emailVerified
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        currentUser = null;
      }
    } else {
      currentUser = null;
    }
    
    // Notify all listeners
    authStateListeners.forEach(listener => listener(currentUser));
  });
}

// Add auth state listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  authStateListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }
  
  return userDoc.data() as UserProfile;
};

// Create user profile in Firestore
export const createUserProfile = async (
  uid: string, 
  profile: Omit<UserProfile, 'uid' | 'createdAt' | 'lastLogin'>
): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const userProfile: UserProfile = {
    ...profile,
    uid,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true
  };
  
  await setDoc(doc(db, 'users', uid), userProfile);
};

// Update user profile
export const updateUserProfile = async (
  uid: string, 
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    lastLogin: new Date().toISOString()
  });
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile
    const profile = await getUserProfile(user.uid);
    
    // Update last login
    await updateUserProfile(user.uid, { lastLogin: new Date().toISOString() });
    
    return {
      ...profile,
      emailVerified: user.emailVerified
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Sign in error:', authError);
    
    // Provide user-friendly error messages
    switch (authError.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email address');
      case 'auth/wrong-password':
        throw new Error('Incorrect password');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later');
      default:
        throw new Error('Failed to sign in. Please check your credentials');
    }
  }
};

// Sign up with email and password
export const signUp = async (
  email: string, 
  password: string, 
  profile: Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'lastLogin' | 'isActive'>
): Promise<AuthUser> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update Firebase profile with display name
    await updateProfile(user, {
      displayName: profile.displayName
    });
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      ...profile,
      email,
      isActive: true
    });
    
    // Get the created profile
    const userProfile = await getUserProfile(user.uid);
    
    return {
      ...userProfile,
      emailVerified: user.emailVerified
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error('Sign up error:', authError);
    
    // Provide user-friendly error messages
    switch (authError.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters long');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address');
      default:
        throw new Error('Failed to create account. Please try again');
    }
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  if (!auth) throw new Error('Firebase not initialized');
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    console.error('Password reset error:', authError);
    
    if (authError.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address');
    }
    
    throw new Error('Failed to send password reset email');
  }
};

// Get auth state
export const getAuthState = (): Promise<AuthUser | null> => {
  if (!auth) return Promise.resolve(null);
  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      unsubscribe();
      
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          resolve({
            ...profile,
            emailVerified: firebaseUser.emailVerified
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// Check if user has required role
export const hasRole = (user: AuthUser | null, requiredRole: 'clinician' | 'admin'): boolean => {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  if (!db) throw new Error('Firestore not initialized');
  
  const usersQuery = query(collection(db, 'users'));
  const querySnapshot = await getDocs(usersQuery);
  
  return querySnapshot.docs.map(doc => doc.data() as UserProfile);
};

// Update user role (admin only)
export const updateUserRole = async (uid: string, role: 'clinician' | 'admin'): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  
  await updateDoc(doc(db, 'users', uid), { role });
};

// Deactivate/Activate user (admin only)
export const toggleUserStatus = async (uid: string, isActive: boolean): Promise<void> => {
  if (!db) throw new Error('Firestore not initialized');
  
  await updateDoc(doc(db, 'users', uid), { isActive });
}; 