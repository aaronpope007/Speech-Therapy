import { 
  signIn, 
  signUp, 
  signOutUser, 
  resetPassword, 
  getAuthState, 
  onAuthStateChange,
  hasRole,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  AuthUser,
  UserProfile
} from '../firebase/auth';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  username?: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private unsubscribe: (() => void) | null = null;

  private constructor() {
    // Set up auth state listener
    this.unsubscribe = onAuthStateChange((user) => {
      this.currentUser = user;
    });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize the auth service
  async initialize(): Promise<void> {
    try {
      // Get current auth state
      this.currentUser = await getAuthState();
    } catch (error) {
      console.error('Error initializing AuthService:', error);
      this.currentUser = null;
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Sign in with email and password
  async authenticate(credentials: UserCredentials): Promise<AuthUser> {
    try {
      const user = await signIn(credentials.email, credentials.password);
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Sign up new user
  async signUp(data: SignUpData): Promise<AuthUser> {
    try {
      const user = await signUp(data.email, data.password, {
        displayName: data.displayName,
        role: data.role,
        organization: data.organization,
        username: data.username
      });
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign out
  async logout(): Promise<void> {
    try {
      await signOutUser();
      this.currentUser = null;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase logout fails, clear local state
      this.currentUser = null;
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Check if user has required role
  hasRole(requiredRole: 'clinician' | 'admin'): boolean {
    return hasRole(this.currentUser, requiredRole);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.isActive;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is clinician
  isClinician(): boolean {
    return this.hasRole('clinician');
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<UserProfile[]> {
    if (!this.isAdmin()) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    try {
      return await getAllUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Update user role (admin only)
  async updateUserRole(uid: string, role: 'clinician' | 'admin'): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    try {
      await updateUserRole(uid, role);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Toggle user status (admin only)
  async toggleUserStatus(uid: string, isActive: boolean): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    try {
      await toggleUserStatus(uid, isActive);
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Cleanup
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

export default AuthService;
export type { AuthUser, UserProfile }; 