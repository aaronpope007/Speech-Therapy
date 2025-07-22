# MASA Assessment Login System

## Overview

The MASA Assessment tool now includes a secure login system that allows users to authenticate with username and password credentials. The system supports both local authentication and integration with Firebase (when configured).

## Default Credentials

The system comes with two default user accounts:

### Administrator Account
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin
- **Permissions:** Full access to all features

### Clinician Account
- **Username:** `clinician`
- **Password:** `clinician123`
- **Role:** Clinician
- **Permissions:** Standard assessment and patient management

## Features

### Login Modal
- Clean, professional login interface
- Username and password authentication
- Password visibility toggle
- Error handling and validation
- Responsive design for all devices

### Account Management
- **Change Password:** Users can change their passwords after logging in
- **Session Persistence:** Login sessions are maintained across browser sessions
- **Secure Logout:** Proper session cleanup on logout

### Security Features
- Password validation (minimum 6 characters)
- Secure password storage (in production, use proper encryption)
- Session management
- Error handling for invalid credentials

## How to Use

### For Users
1. **Login:** Enter your username and password in the login modal
2. **Change Password:** After logging in, click "Account Settings" to change your password
3. **Logout:** Use the logout button in the top navigation bar

### For Administrators
1. **Initial Setup:** The default credentials are hardcoded in `src/services/AuthService.ts`
2. **Customize Users:** Modify the `getDefaultUsers()` method to add/remove users
3. **Password Management:** Users can change their own passwords through the interface

## Customization

### Adding New Users
To add new users, modify the `getDefaultUsers()` method in `src/services/AuthService.ts`:

```typescript
private getDefaultUsers(): { [username: string]: { password: string; user: AuthUser } } {
  return {
    'admin': {
      password: 'admin123',
      user: {
        uid: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
        organization: 'MASA Clinic',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    },
    'newuser': {
      password: 'newpassword123',
      user: {
        uid: 'user-001',
        username: 'newuser',
        displayName: 'New User',
        role: 'clinician',
        organization: 'MASA Clinic',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    }
  };
}
```

### User Roles
- **admin:** Full access to all features including user management
- **clinician:** Standard access to assessments and patient management

## Security Considerations

### Production Deployment
For production use, consider implementing:

1. **Backend Authentication:** Move user management to a secure backend
2. **Password Hashing:** Use bcrypt or similar for password storage
3. **JWT Tokens:** Implement proper token-based authentication
4. **HTTPS:** Ensure all communication is encrypted
5. **Rate Limiting:** Prevent brute force attacks
6. **Audit Logging:** Track login attempts and user actions

### Current Implementation
The current implementation is suitable for:
- Development and testing
- Small-scale deployments
- Prototype demonstrations
- Internal clinic use

## File Structure

```
src/
├── components/Auth/
│   └── LoginModal.tsx          # Main login interface
├── services/
│   └── AuthService.ts          # Authentication logic
└── App.tsx                     # Main app with auth flow
```

## Troubleshooting

### Common Issues

1. **Login Not Working:**
   - Check that the username and password match exactly
   - Ensure the AuthService is properly initialized
   - Check browser console for errors

2. **Session Not Persisting:**
   - Verify localStorage is enabled in the browser
   - Check for browser privacy settings blocking storage

3. **Password Change Not Working:**
   - Ensure new password meets minimum requirements (6 characters)
   - Check that confirmation password matches

### Development Notes

- The system uses localStorage for session persistence
- Firebase integration is optional and can be disabled
- All authentication logic is centralized in AuthService
- The login modal is responsive and accessible

## Future Enhancements

Potential improvements for future versions:

1. **Multi-factor Authentication:** Add SMS or email verification
2. **Password Policies:** Implement stronger password requirements
3. **User Management UI:** Admin interface for managing users
4. **Role-based Permissions:** Granular permission system
5. **Audit Trail:** Comprehensive logging of user actions
6. **SSO Integration:** Single sign-on with existing systems 