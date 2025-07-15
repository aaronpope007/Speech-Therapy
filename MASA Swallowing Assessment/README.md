# MASA: The Mann Assessment of Swallowing Ability

A comprehensive React application for conducting MASA (Mann Assessment of Swallowing Ability) assessments with automated scoring and clinical recommendations.

## 🚀 Features

### 🔐 Authentication & Security
- **User Authentication**: Secure login/signup with Firebase Auth
- **Role-Based Access**: Clinician and Administrator roles
- **PHI Encryption**: All patient data encrypted with AES-256
- **Secure API**: Firebase Firestore with encrypted data storage
- **Session Management**: Automatic session handling and logout

### 📱 Responsive Design
- **Mobile-First**: Optimized for iPhone and Android
- **Tablet Support**: Responsive layouts for iPad and tablets
- **Desktop Experience**: Full-featured desktop interface
- **Conditional Rendering**: Viewport-based component rendering
- **Touch-Friendly**: Optimized for touch interactions

### 📋 Assessment Modes
- **Quick Assessment Mode**: Numbered buttons for rapid scoring by experienced clinicians
- **Detailed Assessment Mode**: Expandable accordions with full descriptions and instructions
- **Progress Tracking**: Visual progress bar showing completion status
- **Real-time Scoring**: Instant calculation and interpretation of results

### 💾 Data Management
- **Cloud Storage**: Secure Firebase Firestore database
- **Local Backup**: Offline capability with local storage
- **Export/Import**: JSON file export and import functionality
- **PDF Reports**: Generate professional PDF reports of assessments
- **Data Encryption**: End-to-end encryption for all sensitive data

### 📊 Analytics & Insights
- **Assessment Analytics**: View statistics across all assessments
- **Severity Distribution**: Track dysphagia severity patterns
- **Average Scores**: Monitor performance trends
- **Data Visualization**: Clear charts and metrics
- **Patient Progress Tracking**: Monitor individual patient progress over time
- **Trend Analysis**: Identify improving, declining, or stable patterns
- **Longitudinal Reports**: Export patient progress reports

### 🏥 Clinical Features
- **Automated Recommendations**: Context-sensitive clinical guidance
- **Diet Recommendations**: Specific texture and consistency suggestions
- **Risk Assessment**: Color-coded aspiration risk indicators
- **Clinical Notes**: Free-text observations and recommendations
- **Patient Management**: Complete patient lifecycle management

### ♿ Accessibility & UX
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Responsive Design**: Works on desktop, tablet, and mobile
- **PWA Support**: Install as a native app with offline capability
- **Multi-Device Sync**: Seamless data synchronization across devices

## Assessment Areas (24 Total)

The application includes all 24 MASA assessment areas:

1. **Alertness** (2-10 points)
2. **Cooperation** (2-10 points)  
3. **Auditory Comprehension** (2-10 points)
4. **Respiration** (2-10 points)
5. **Respiratory Rate for Swallow** (1, 3, 5 points)
6. **Dysphasia** (1-5 points)
7. **Dyspraxia** (1-5 points)
8. **Dysarthria** (1-5 points)
9. **Saliva** (1-5 points)
10. **Lip Seal** (1-5 points)
11. **Tongue Movement** (2-10 points)
12. **Tongue Strength** (2, 5, 8, 10 points)
13. **Tongue Coordination** (2, 5, 8, 10 points)
14. **Oral Preparation** (2-10 points)
15. **Gag** (1-5 points)
16. **Palate** (2-10 points)
17. **Bolus Clearance** (2, 5, 8, 10 points)
18. **Oral Transit** (2-10 points)
19. **Cough Reflex** (1, 3, 5 points)
20. **Voluntary Cough** (2, 5, 8, 10 points)
21. **Voice** (2-10 points)
22. **Trache** (1, 5, 10 points)
23. **Pharyngeal Phase** (2, 5, 8, 10 points)
24. **Pharyngeal Response** (1, 5, 10 points)

**Maximum Total Score: 200 points**

## 🛠️ Technical Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Build Tool**: Vite
- **Storage**: Browser localStorage + Firebase Firestore (optional)
- **PDF Generation**: jsPDF + html2canvas
- **PWA**: Service Worker support
- **State Management**: React Hooks
- **Form Handling**: React Hook Form

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Basic Setup
```bash
# Clone the repository
git clone <repository-url>
cd masa-swallowing-assessment

# Install dependencies
npm install

# Start development server
npm run dev
```

### Firebase Setup (Optional)
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Copy your Firebase config to `env.example` and rename to `.env.local`
3. Update the Firebase configuration in `src/firebase/config.ts`

### Environment Variables
Copy `env.example` to `.env.local` and configure:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 🎯 Usage Guide

### Quick Assessment (Experienced Users)
1. Enter patient information
2. Use numbered buttons for rapid scoring
3. View real-time total score and interpretation
4. Export PDF report when complete

### Detailed Assessment (Learning/Reference)
1. Enter patient information
2. Click assessment areas to expand details
3. Read descriptions and task instructions
4. Select appropriate scores using radio buttons
5. Review clinical summary and recommendations

### Data Management
- **Auto-save**: Work is automatically saved as you go
- **Export**: Download individual assessments or all data as JSON
- **Import**: Upload previously exported assessment files
- **PDF Reports**: Generate professional clinical reports
- **Analytics**: View statistics and trends across assessments

### Patient Progress Tracking
- **Patient Groups**: Automatically groups assessments by patient name and DOB
- **Progress Trends**: Identifies improving, declining, or stable patterns
- **Assessment History**: View all assessments for a specific patient
- **Trend Analysis**: Requires at least 3 assessments to determine trends
- **Progress Reports**: Export comprehensive patient progress reports
- **Quick Access**: Load any previous assessment for comparison

## 📊 Scoring Reference

### Dysphagia Severity
- **178-200**: No abnormality detected
- **168-177**: Mild dysphagia
- **139-167**: Moderate dysphagia  
- **≤138**: Severe dysphagia

### Aspiration Risk
- **≥170**: No aspiration risk
- **149-169**: Mild aspiration risk
- **141-148**: Moderate aspiration risk
- **≤140**: Severe aspiration risk

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── assets/
│   ├── Components/          # React components
│   │   ├── AssessmentCard.tsx
│   │   ├── AssessmentList.tsx
│   │   ├── ClinicalSummary.tsx
│   │   └── MasaMain.tsx
│   └── AssessmentAreas.tsx  # Assessment data
├── firebase/               # Firebase configuration
├── App.tsx                 # Main app component
└── main.tsx               # App entry point
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel/Netlify
Connect your repository to Vercel or Netlify for automatic deployments.

## 📱 PWA Features

The app can be installed as a Progressive Web App:
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen mode and native feel
- **Automatic Updates**: Updates when new versions are available
- **Home Screen Icon**: Add to home screen for quick access

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally by default
- **No Tracking**: No analytics or tracking scripts
- **HIPAA Compliance**: Designed with healthcare privacy in mind
- **Data Control**: Full control over data export and deletion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Clinical Disclaimer

This application is designed to support clinical decision-making but should not replace professional clinical judgment. Always follow your institution's protocols and consult with appropriate healthcare professionals for patient care decisions.

---

**Note**: This application stores data locally in your browser by default. For clinical use, ensure compliance with your institution's data security and privacy policies.