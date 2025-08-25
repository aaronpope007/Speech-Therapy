# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the MASA Swallowing Assessment application.

## 🔥 **Step 1: Firebase Console Setup**

### 1.1 Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `web-development-speech-therapy`
3. In the left sidebar, click **"Authentication"**
4. Click **"Get started"**

### 1.2 Enable Sign-in Methods
1. Go to the **"Sign-in method"** tab
2. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle the switch to **"Enable"**
   - Click **"Save"**

### 1.3 (Optional) Enable Google Sign-in
1. Click on **"Google"**
2. Toggle the switch to **"Enable"**
3. Add your authorized domain
4. Click **"Save"**

## 🔐 **Step 2: Firestore Security Rules**

### 2.1 Deploy Security Rules
1. In Firebase Console, go to **"Firestore Database"**
2. Click on the **"Rules"** tab
3. Replace the existing rules with the content from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Admins can read all user profiles
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Admins can update user roles and status
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['role', 'isActive', 'lastLogin']);
    }
    
    // Patients collection - authenticated users can read/write
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
    
    // Assessments collection - authenticated users can read/write
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **"Publish"**

## 🌐 **Step 3: Environment Configuration**

### 3.1 Update Environment Variables
1. Copy your Firebase configuration from the Firebase Console
2. Update your `.env.local` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=web-development-speech-therapy.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=web-development-speech-therapy
VITE_FIREBASE_STORAGE_BUCKET=web-development-speech-therapy.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=383948008382
VITE_FIREBASE_APP_ID=your-actual-app-id

# Security Configuration
VITE_ENCRYPTION_KEY=your-secure-32-character-encryption-key-here

# App Configuration
VITE_APP_NAME=MASA Swallowing Assessment
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### 3.2 Get Firebase Config
1. In Firebase Console, go to **"Project Settings"** (gear icon)
2. Scroll down to **"Your apps"**
3. Click on your web app
4. Copy the configuration values

## 👥 **Step 4: Create Default Users**

### 4.1 Run Setup Script
1. Start your development server: `npm run dev`
2. Open the browser console (F12)
3. Run the setup script:

```javascript
import('./src/utils/setupFirebaseUsers.js').then(module => {
  module.default().then(() => {
    console.log('Setup complete!');
  });
});
```

### 4.2 Default User Credentials

After running the setup, you'll have these default users:

- **Admin User**:
  - Email: `admin@masa.com` (or value from VITE_ADMIN_EMAIL)
  - Password: Configured via VITE_ADMIN_PASSWORD environment variable
  - Role: Administrator

- **Clinician User**:
  - Email: `clinician@masa.com` (or value from VITE_CLINICIAN_EMAIL)
  - Password: Configured via VITE_CLINICIAN_PASSWORD environment variable
  - Role: Speech Language Pathologist

## 🔧 **Step 5: Test Authentication**

### 5.1 Test Login
1. Open your application
2. Try logging in with the default credentials
3. Verify that users are redirected to the main application

### 5.2 Test User Management (Admin Only)
1. Login as admin (`admin@masa.com`)
2. Verify that you can see user management features
3. Test creating new users

## 🛡️ **Step 6: Security Considerations**

### 6.1 Password Policy
- Firebase enforces a minimum 6-character password
- Consider implementing additional password requirements in your app

### 6.2 Email Verification
- Firebase can send email verification
- Consider enabling this for production

### 6.3 Multi-Factor Authentication
- Enable MFA for additional security
- Available in Firebase Console under Authentication settings

## 🚀 **Step 7: Production Deployment**

### 7.1 Update Authorized Domains
1. In Firebase Console, go to **"Authentication"**
2. Click **"Settings"** tab
3. Add your production domain to **"Authorized domains"**

### 7.2 Environment Variables
1. Update production environment variables
2. Ensure all Firebase config values are correct
3. Use strong encryption keys

### 7.3 Security Rules Review
1. Review Firestore security rules for production
2. Consider additional restrictions based on your needs
3. Test all user roles and permissions

## 🔍 **Troubleshooting**

### Common Issues

1. **"Firebase not initialized" error**
   - Check that all environment variables are set
   - Verify Firebase config in `src/firebase/config.ts`

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Verify user authentication status

3. **"User not found" errors**
   - Ensure users exist in Firebase Auth
   - Check that user profiles are created in Firestore

4. **"Invalid email" errors**
   - Verify email format
   - Check if email is already registered

### Debug Mode
Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'firebase:*');
```

## 📚 **Additional Resources**

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

## 🔄 **Migration from Old System**

If you're migrating from the old authentication system:

1. **Export existing data** from localStorage
2. **Create new users** using the setup script
3. **Migrate patient data** using the existing migration functions
4. **Test thoroughly** before switching to production

---

**Need Help?** Check the Firebase Console logs and browser console for detailed error messages. 