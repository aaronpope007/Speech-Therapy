import { signUp } from '../firebase/auth';

const defaultUsers = [
  {
    email: 'admin@masa.com',
    password: 'admin123',
    displayName: 'Administrator',
    role: 'admin' as const,
    organization: 'MASA Clinic',
    username: 'admin'
  },
  {
    email: 'clinician@masa.com',
    password: 'clinician123',
    displayName: 'Speech Therapist',
    role: 'clinician' as const,
    organization: 'MASA Clinic',
    username: 'clinician'
  }
];

export const createDefaultUsers = async () => {
  console.log('Creating default users...');
  
  for (const userData of defaultUsers) {
    try {
      await signUp(userData.email, userData.password, {
        displayName: userData.displayName,
        role: userData.role,
        organization: userData.organization,
        username: userData.username
      });
      console.log(`✅ Created user: ${userData.email}`);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${userData.email}`);
      } else {
        console.error(`❌ Failed to create user ${userData.email}:`, error);
      }
    }
  }
  
  console.log('Default users setup complete!');
  console.log('Login credentials:');
  console.log('- Admin: admin@masa.com / admin123');
  console.log('- Clinician: clinician@masa.com / clinician123');
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).createDefaultUsers = createDefaultUsers;
}
