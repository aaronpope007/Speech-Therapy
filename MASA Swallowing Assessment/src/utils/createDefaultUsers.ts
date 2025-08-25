import { signUp } from '../firebase/auth';

// Get default users from environment variables or use fallbacks
const getDefaultUsers = () => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@masa.com';
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const clinicianEmail = import.meta.env.VITE_CLINICIAN_EMAIL || 'clinician@masa.com';
  const clinicianPassword = import.meta.env.VITE_CLINICIAN_PASSWORD || 'clinician123';

  return [
    {
      email: adminEmail,
      password: adminPassword,
      displayName: 'Administrator',
      role: 'admin' as const,
      organization: 'MASA Clinic',
      username: 'admin'
    },
    {
      email: clinicianEmail,
      password: clinicianPassword,
      displayName: 'Speech Therapist',
      role: 'clinician' as const,
      organization: 'MASA Clinic',
      username: 'clinician'
    }
  ];
};

export const createDefaultUsers = async () => {
  console.log('Creating default users...');
  
  const defaultUsers = getDefaultUsers();
  
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
  console.log('Login credentials (check your .env file for actual values):');
  console.log(`- Admin: ${defaultUsers[0].email} / [password from .env]`);
  console.log(`- Clinician: ${defaultUsers[1].email} / [password from .env]`);
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).createDefaultUsers = createDefaultUsers;
}
