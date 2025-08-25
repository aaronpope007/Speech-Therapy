import { signUp } from '../firebase/auth';

interface DefaultUser {
  email: string;
  password: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  username?: string;
}

// Get default users from environment variables or use fallbacks
const getDefaultUsers = (): DefaultUser[] => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@masa.com';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const clinicianEmail = import.meta.env.VITE_CLINICIAN_EMAIL || 'clinician@masa.com';
  const clinicianPassword = import.meta.env.VITE_CLINICIAN_PASSWORD || 'clinician123';

  return [
    {
      email: adminEmail,
      password: adminPassword,
      displayName: 'Administrator',
      role: 'admin',
      organization: 'MASA Clinic',
      username: 'admin'
    },
    {
      email: clinicianEmail,
      password: clinicianPassword,
      displayName: 'Speech Therapist',
      role: 'clinician',
      organization: 'MASA Clinic',
      username: 'clinician'
    }
  ];
};

export const setupDefaultUsers = async (): Promise<void> => {
  console.log('Setting up default users in Firebase...');
  
  const defaultUsers = getDefaultUsers();
  
  try {
    for (const userData of defaultUsers) {
      try {
        // Create user with Firebase Auth
        await signUp(userData.email, userData.password, {
          displayName: userData.displayName,
          role: userData.role,
          organization: userData.organization,
          username: userData.username
        });
        
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Failed to create user ${userData.email}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }
    
    console.log('Default users setup completed successfully!');
    console.log('Default credentials (check your .env file for actual values):');
    console.log(`- Admin: ${defaultUsers[0].email} / [password from .env]`);
    console.log(`- Clinician: ${defaultUsers[1].email} / [password from .env]`);
  } catch (error) {
    console.error('Error setting up default users:', error);
    throw error;
  }
};

// Export for use in setup components
export default setupDefaultUsers; 