import AuthService from '../services/AuthService';

/**
 * Setup script to initialize default users in Firebase
 * Run this once when setting up the application for the first time
 */
export const setupDefaultUsers = async (): Promise<void> => {
  try {
    console.log('Setting up default users in Firebase...');
    
    const authService = AuthService.getInstance();
    await authService.initializeDefaultUsers();
    
    console.log('Default users setup completed successfully!');
    console.log('Default credentials:');
    console.log('- Admin: admin / admin123');
    console.log('- Clinician: clinician / clinician123');
  } catch (error) {
    console.error('Error setting up default users:', error);
    throw error;
  }
};

/**
 * Function to be called from the browser console or a setup page
 */
export const runSetup = async (): Promise<void> => {
  try {
    await setupDefaultUsers();
    alert('Default users setup completed! You can now login with admin/admin123 or clinician/clinician123');
  } catch (error) {
    console.error('Setup failed:', error);
    alert('Setup failed. Check console for details.');
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).setupMasaUsers = runSetup;
} 