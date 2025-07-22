import { signOutUser } from '../firebase/auth';
import { 
  createUser, 
  getUserByUsername, 
  updateUserPassword, 
  updateUserLastLogin, 
  verifyUserPassword,
  UserData 
} from '../firebase/database';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  uid: string;
  username: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize default users in Firebase (run once for setup)
  async initializeDefaultUsers(): Promise<void> {
    try {
      const defaultUsers = [
        {
          username: 'admin',
          displayName: 'Administrator',
          role: 'admin' as const,
          organization: 'MASA Clinic',
          password: 'admin123'
        },
        {
          username: 'clinician',
          displayName: 'Speech Therapist',
          role: 'clinician' as const,
          organization: 'MASA Clinic',
          password: 'clinician123'
        }
      ];

      for (const userData of defaultUsers) {
        // Check if user already exists
        const existingUser = await getUserByUsername(userData.username);
        if (!existingUser) {
          await createUser({
            username: userData.username,
            displayName: userData.displayName,
            role: userData.role,
            organization: userData.organization
          }, userData.password);
          console.log(`Created default user: ${userData.username}`);
        }
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }

  // Authenticate user with username and password
  async authenticate(credentials: UserCredentials): Promise<AuthUser> {
    try {
      const userData = await getUserByUsername(credentials.username);
      
      if (!userData) {
        throw new Error('Invalid username or password');
      }

      if (!userData.isActive) {
        throw new Error('Account is deactivated');
      }

      if (!verifyUserPassword(userData, credentials.password)) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      await updateUserLastLogin(userData.id);

      // Convert UserData to AuthUser
      const authUser: AuthUser = {
        uid: userData.id,
        username: userData.username,
        displayName: userData.displayName,
        role: userData.role,
        organization: userData.organization,
        createdAt: userData.createdAt.toDate().toISOString(),
        lastLogin: userData.lastLogin.toDate().toISOString(),
        isActive: userData.isActive
      };

      // Store user in localStorage for persistence
      localStorage.setItem('masa_current_user', JSON.stringify(authUser));
      
      this.currentUser = authUser;
      return authUser;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Get current authenticated user
  getCurrentUser(): AuthUser | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from localStorage
    const storedUser = localStorage.getItem('masa_current_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('masa_current_user');
      }
    }

    return null;
  }

  // Change password for current user
  async changePassword(newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No user is currently authenticated');
    }

    try {
      await updateUserPassword(user.uid, newPassword);
      
      // Update the user's last login to indicate password change
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('masa_current_user', JSON.stringify(user));
      
      console.log('Password changed successfully for user:', user.username);
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password');
    }
  }

  // Logout current user
  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('masa_current_user');
    
    // Also try to logout from Firebase if available
    try {
      await signOutUser();
    } catch (error) {
      // Firebase logout failed, but that's okay for local auth
      console.log('Firebase logout failed, but local logout successful');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user role
  getUserRole(): 'clinician' | 'admin' | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Initialize auth service
  initialize(): void {
    // Check for existing session
    this.getCurrentUser();
  }

  // Create a new user (admin only)
  async createNewUser(
    username: string,
    displayName: string,
    role: 'admin' | 'clinician',
    organization: string,
    password: string
  ): Promise<string> {
    try {
      const userId = await createUser({
        username,
        displayName,
        role,
        organization
      }, password);
      
      console.log(`Created new user: ${username}`);
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}

export default AuthService; 