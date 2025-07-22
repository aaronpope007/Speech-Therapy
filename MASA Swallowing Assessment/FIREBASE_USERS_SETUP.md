# Firebase Users Collection Setup

## Overview

The MASA Assessment tool now stores user accounts in Firebase Firestore in a `users` collection. This provides secure, scalable user management with the ability to add, modify, and deactivate user accounts.

## Firebase Collections

Your Firebase project now has three main collections:

1. **`patients`** - Patient data with encrypted PHI
2. **`assessments`** - Assessment results and clinical data
3. **`users`** - User accounts and authentication data

## Users Collection Structure

### User Document Fields

```typescript
interface UserData {
  id: string;                    // Auto-generated document ID
  username: string;              // Unique username for login
  displayName: string;           // Full name for display
  email?: string;                // Optional email address
  role: 'admin' | 'clinician';   // User role and permissions
  organization: string;          // Organization/clinic name
  isActive: boolean;             // Account status
  lastLogin: Timestamp;          // Last login timestamp
  createdAt: Timestamp;          // Account creation date
  updatedAt: Timestamp;          // Last update timestamp
  encryptedPassword: string;     // Encrypted password hash
}
```

### Security Rules

Add these Firestore security rules for the users collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Existing rules for patients and assessments...
  }
}
```

## Initial Setup

### 1. First-Time Setup

When you first run the application, you'll see a setup screen that creates default users:

- **Admin:** `admin` / `admin123`
- **Clinician:** `clinician` / `clinician123`

### 2. Manual Setup (Alternative)

If you prefer to set up users manually, you can run this in the browser console:

```javascript
// Open browser console and run:
setupMasaUsers()
```

### 3. Programmatic Setup

You can also call the setup function programmatically:

```typescript
import { setupDefaultUsers } from './src/utils/setupFirebaseUsers';

await setupDefaultUsers();
```

## User Management Functions

### Available Functions

The database module provides these user management functions:

```typescript
// Create a new user
createUser(userData, password): Promise<string>

// Get user by username
getUserByUsername(username): Promise<UserData | null>

// Get user by ID
getUserById(userId): Promise<UserData | null>

// Get all users in an organization
getUsersByOrganization(organization): Promise<UserData[]>

// Update user data
updateUser(userId, updates): Promise<void>

// Change user password
updateUserPassword(userId, newPassword): Promise<void>

// Update last login timestamp
updateUserLastLogin(userId): Promise<void>

// Deactivate user account
deactivateUser(userId): Promise<void>

// Delete user account
deleteUser(userId): Promise<void>

// Verify password
verifyUserPassword(user, password): boolean
```

### Example Usage

```typescript
import { 
  createUser, 
  getUserByUsername, 
  updateUserPassword 
} from './src/firebase/database';

// Create a new clinician
const userId = await createUser({
  username: 'dr.smith',
  displayName: 'Dr. Jane Smith',
  role: 'clinician',
  organization: 'MASA Clinic'
}, 'securepassword123');

// Get user by username
const user = await getUserByUsername('dr.smith');

// Change password
await updateUserPassword(userId, 'newpassword456');
```

## Authentication Flow

### 1. Login Process

1. User enters username and password
2. System queries Firebase for user by username
3. Password is verified using encryption
4. Last login timestamp is updated
5. User session is stored in localStorage
6. User is redirected to main application

### 2. Session Management

- User sessions persist across browser restarts
- Sessions are stored in localStorage
- Logout clears session data
- Inactive users can be deactivated

### 3. Password Security

- Passwords are encrypted before storage
- Password changes update the encrypted hash
- Failed login attempts are logged
- Account deactivation prevents login

## Adding New Users

### Through the Application

Currently, new users must be added programmatically or through Firebase console. Future versions will include an admin interface.

### Programmatically

```typescript
import AuthService from './src/services/AuthService';

const authService = AuthService.getInstance();

// Only admins can create new users
if (authService.getUserRole() === 'admin') {
  await authService.createNewUser(
    'newuser',
    'New User Name',
    'clinician',
    'MASA Clinic',
    'initialpassword123'
  );
}
```

### Through Firebase Console

1. Go to Firebase Console → Firestore Database
2. Navigate to the `users` collection
3. Click "Add document"
4. Fill in the required fields:
   - `username`: Unique login name
   - `displayName`: Full name
   - `role`: 'admin' or 'clinician'
   - `organization`: Clinic name
   - `isActive`: true
   - `encryptedPassword`: Encrypted password hash
   - `createdAt`: Current timestamp
   - `updatedAt`: Current timestamp
   - `lastLogin`: Current timestamp

## User Roles and Permissions

### Admin Role
- Full access to all features
- Can create, modify, and delete users
- Can access all patient and assessment data
- Can manage system settings

### Clinician Role
- Standard access to assessments
- Can manage patient data
- Cannot modify user accounts
- Limited to their organization's data

## Security Considerations

### Data Encryption
- Passwords are encrypted using AES encryption
- Encryption key should be stored securely in production
- Consider using Firebase Auth for enhanced security

### Access Control
- Users can only access data from their organization
- Role-based permissions are enforced
- Inactive accounts cannot login

### Audit Trail
- All user actions are timestamped
- Login attempts are logged
- Password changes are tracked

## Troubleshooting

### Common Issues

1. **Setup Fails**
   - Check Firebase configuration
   - Verify Firestore rules allow write access
   - Check browser console for errors

2. **Login Issues**
   - Verify username exists in Firebase
   - Check if account is active
   - Ensure password is correct

3. **Permission Errors**
   - Verify user role has required permissions
   - Check Firestore security rules
   - Ensure user belongs to correct organization

### Debug Commands

```javascript
// Check if users exist
// In Firebase console, query: collection('users')

// Check current user session
// In browser console:
localStorage.getItem('masa_current_user')

// Clear user session
// In browser console:
localStorage.removeItem('masa_current_user')
```

## Migration from Local Users

If you were previously using local hardcoded users, the system will automatically migrate to Firebase when you run the setup. The old local authentication will be replaced with Firebase-based authentication.

## Future Enhancements

Planned improvements for user management:

1. **Admin Interface**: Web-based user management UI
2. **Bulk Operations**: Import/export user lists
3. **Advanced Permissions**: Granular role-based access
4. **Multi-factor Authentication**: SMS or email verification
5. **Password Policies**: Enforce strong password requirements
6. **Audit Logging**: Comprehensive activity tracking 