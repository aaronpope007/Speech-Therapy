# Firebase Email Link Authentication Setup

This guide will help you set up Firebase Email Link Authentication for the MASA Swallowing Assessment app with support for Apple and Android mobile apps.

## 🚀 **Step 1: Firebase Console Setup**

### **1.1 Enable Email Link Authentication**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email link (passwordless sign-in)**
5. Click **Enable**
6. Configure the following settings:
   - **Action URL**: `https://your-domain.com/auth/verify` (replace with your actual domain)
   - **Action code settings**:
     - **URL**: `https://your-domain.com/auth/verify`
     - **Handle code in app**: ✅ **Enabled**
     - **iOS bundle ID**: `com.masa.swallowingassessment`
     - **Android package name**: `com.masa.swallowingassessment`
     - **Android install app**: ✅ **Enabled**
     - **Android minimum version**: `12`

### **1.2 Set Up Dynamic Links (for Mobile Apps)**

1. In Firebase Console, go to **Dynamic Links**
2. Click **Get started**
3. Create a new dynamic link domain: `your-app-name.page.link`
4. Note this domain for the next step

### **1.3 Update Action Code Settings**

Update the `actionCodeSettings` in `src/firebase/auth.ts`:

```typescript
const actionCodeSettings: ActionCodeSettings = {
  url: 'https://your-domain.com/auth/verify', // Replace with your domain
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.masa.swallowingassessment'
  },
  android: {
    packageName: 'com.masa.swallowingassessment',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'your-app-name.page.link' // Replace with your dynamic link domain
};
```

## 🔧 **Step 2: Environment Variables**

Update your `.env.local` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Email Link Settings
VITE_APP_DOMAIN=https://your-domain.com
VITE_DYNAMIC_LINK_DOMAIN=your-app-name.page.link
```

## 📱 **Step 3: Mobile App Configuration**

### **3.1 iOS App Setup**

1. **Add URL Scheme** in `Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.masa.swallowingassessment</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.masa.swallowingassessment</string>
    </array>
  </dict>
</array>
```

2. **Add Associated Domains** in `Info.plist`:
```xml
<key>com.apple.developer.associated-domains</key>
<array>
  <string>applinks:your-app-name.page.link</string>
</array>
```

### **3.2 Android App Setup**

1. **Add Intent Filter** in `AndroidManifest.xml`:
```xml
<activity android:name=".MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="your-app-name.page.link" />
  </intent-filter>
</activity>
```

2. **Add Digital Asset Links** in `app/src/main/assets/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.masa.swallowingassessment",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

## 🌐 **Step 4: Web App Configuration**

### **4.1 Add Email Link Verification Route**

Create a route handler for email link verification. In your routing setup, add:

```typescript
// Route for email link verification
if (window.location.pathname === '/auth/verify') {
  // This will be handled by EmailLinkVerification component
  return <EmailLinkVerification />;
}
```

### **4.2 Update Firebase Security Rules**

Update your Firestore security rules to support email link authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' && 
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['role', 'isActive', 'lastLogin']);
    }
    
    // Patients collection
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🔐 **Step 5: Security Considerations**

### **5.1 Email Link Security**

- **Link Expiration**: Links expire after 15 minutes by default
- **Single Use**: Each link can only be used once
- **HTTPS Required**: All links use HTTPS for security
- **Domain Verification**: Only whitelisted domains can receive links

### **5.2 Additional Security Measures**

1. **Rate Limiting**: Firebase automatically limits email sending
2. **Email Verification**: Users must verify their email ownership
3. **Audit Logging**: All authentication events are logged
4. **Session Management**: Automatic session cleanup

## 📧 **Step 6: Email Templates**

### **6.1 Customize Email Templates**

1. In Firebase Console, go to **Authentication** → **Templates**
2. Select **Email link sign-in**
3. Customize the email template:

**Subject**: `Sign in to MASA Assessment`
**HTML Body**:
```html
<h2>Welcome to MASA Assessment</h2>
<p>Click the link below to sign in to your account:</p>
<a href="{{LINK}}" style="background-color: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Sign In</a>
<p>This link will expire in 15 minutes.</p>
<p>If you didn't request this email, you can safely ignore it.</p>
```

## 🧪 **Step 7: Testing**

### **7.1 Test Email Link Sign-in**

1. **Web Testing**:
   - Open your app in a browser
   - Click "Sign in with email link"
   - Enter your email address
   - Check your email and click the link
   - Verify you're signed in successfully

2. **Mobile Testing**:
   - Install your mobile app
   - Request an email link
   - Click the link in your email
   - Verify the app opens and you're signed in

### **7.2 Test Error Scenarios**

- **Invalid Email**: Try signing in with an invalid email format
- **Expired Link**: Wait 15+ minutes and try using an old link
- **Used Link**: Try using the same link twice
- **Wrong Domain**: Try accessing the link from an unauthorized domain

## 🚀 **Step 8: Production Deployment**

### **8.1 Domain Configuration**

1. **Add Authorized Domains**:
   - In Firebase Console, go to **Authentication** → **Settings**
   - Add your production domain to "Authorized domains"

2. **Update Action Code Settings**:
   - Change the URL in `actionCodeSettings` to your production domain
   - Update the dynamic link domain if needed

### **8.2 SSL Certificate**

Ensure your domain has a valid SSL certificate for HTTPS.

### **8.3 Email Deliverability**

- **SPF/DKIM**: Configure email authentication for better deliverability
- **Domain Reputation**: Monitor email delivery rates
- **Bounce Handling**: Set up proper bounce handling

## 🔧 **Step 9: Troubleshooting**

### **Common Issues**

1. **Links Not Working**:
   - Check domain whitelist in Firebase Console
   - Verify action code settings
   - Check browser console for errors

2. **Mobile App Not Opening**:
   - Verify bundle ID/package name
   - Check associated domains setup
   - Test with Firebase Dynamic Links console

3. **Email Not Received**:
   - Check spam folder
   - Verify email address
   - Check Firebase Console logs

### **Debug Mode**

Enable debug logging in development:

```typescript
// In src/firebase/auth.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Email link auth debug mode enabled');
}
```

## 📚 **Step 10: Additional Resources**

- [Firebase Email Link Documentation](https://firebase.google.com/docs/auth/web/email-link-auth)
- [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links)
- [iOS Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android App Links](https://developer.android.com/training/app-links)

## ✅ **Verification Checklist**

- [ ] Email link authentication enabled in Firebase Console
- [ ] Action code settings configured correctly
- [ ] Dynamic links domain set up
- [ ] Environment variables updated
- [ ] Mobile app configuration completed
- [ ] Web app routes configured
- [ ] Security rules deployed
- [ ] Email templates customized
- [ ] Testing completed
- [ ] Production domain configured

Your MASA Swallowing Assessment app now supports secure, passwordless authentication with email links and mobile app integration!
