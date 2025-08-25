import { signUp } from '../firebase/auth';

interface DefaultUser {
  email: string;
  password: string;
  displayName: string;
  role: 'clinician' | 'admin';
  organization: string;
  username?: string;
}

const defaultUsers: DefaultUser[] = [
  {
    email: 'admin@masa.com',
    password: 'admin123',
    displayName: 'Administrator',
    role: 'admin',
    organization: 'MASA Clinic',
    username: 'admin'
  },
  {
    email: 'clinician@masa.com',
    password: 'clinician123',
    displayName: 'Speech Therapist',
    role: 'clinician',
    organization: 'MASA Clinic',
    username: 'clinician'
  }
];

export const setupDefaultUsers = async (): Promise<void> => {
  console.log('Setting up default users in Firebase...');
  
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
    console.log('Default credentials:');
    console.log('- Admin: admin@masa.com / admin123');
    console.log('- Clinician: clinician@masa.com / clinician123');
  } catch (error) {
    console.error('Error setting up default users:', error);
    throw error;
  }
};

// Export for use in setup components
export default setupDefaultUsers; 