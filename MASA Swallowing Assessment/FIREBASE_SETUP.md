# Firebase Setup Guide

## 🔑 Step 1: Get Your Firebase Web API Key

1. **Go to Firebase Console**: Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Select Your Project**: Choose project number `383948008382`
3. **Project Settings**: Click the gear icon ⚙️ next to "Project Overview" → "Project settings"
4. **General Tab**: Scroll down to "Your apps" section
5. **Add Web App**: Click "Add app" → "Web" (</>) icon
6. **Register App**: 
   - Give it a nickname like "MASA Web App"
   - Check "Also set up Firebase Hosting" if you want to deploy later
   - Click "Register app"
7. **Copy Config**: You'll see a config object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

## 🔧 Step 2: Create Environment File

Create a `.env.local` file in your project root with your Firebase config:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 🔒 Step 3: Set Up Firestore Security Rules

In Firebase Console → Firestore Database → Rules, set up these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or for development, allow all access (NOT for production)
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

## 🚀 Step 4: Enable Firestore Database

1. **Firebase Console** → **Firestore Database**
2. **Create Database** → **Start in test mode** (for development)
3. **Choose Location** → Select closest to your users
4. **Done**

## 📱 Step 5: Test Integration

After setting up the environment variables, restart your development server:

```bash
npm run dev
```

The app should now connect to Firebase automatically! 