# MASA: The Mann Assessment of Swallowing Ability

A comprehensive React application for conducting MASA (Mann Assessment of Swallowing Ability) assessments with automated scoring and clinical recommendations.

## Features

### 🚀 Quick Assessment Mode
- **Short Form Buttons**: Quick score selection for clinicians familiar with MASA
- Each assessment area has numbered buttons (e.g., "10", "8", "6") for rapid scoring
- Perfect for experienced clinicians who know the MASA scoring system well

### 📋 Detailed Assessment Mode  
- **Expandable Accordions**: Click to expand any assessment area for detailed information
- **Complete Descriptions**: Full task descriptions and instructions for each area
- **Radio Button Selection**: Choose from detailed scoring options with explanations
- Ideal for learning the MASA or when you need reference information

### 💾 Save & Load Functionality
- **Local Browser Storage**: Assessments are automatically saved to your browser's local storage
- **Patient Information**: Store patient name, DOB, assessment date, and clinician
- **Persistent Data**: Your work is saved as you go and restored when you return
- **Clear All Option**: Reset the assessment with confirmation dialog

### 📊 Automated Scoring & Interpretation
- **Real-time Scoring**: Total score calculated as you complete the assessment
- **Severity Classification**: 
  - No abnormality (178-200)
  - Mild dysphagia (168-177)
  - Moderate dysphagia (139-167)
  - Severe dysphagia (≤138)
- **Aspiration Risk Assessment**: Color-coded risk indicators

### 🏥 Clinical Recommendations
- **Automated Recommendations**: Context-sensitive clinical guidance based on scores
- **Diet Recommendations**: Specific diet texture and consistency suggestions
- **Follow-up Guidelines**: Monitoring and referral recommendations
- **Area-Specific Alerts**: Special considerations for low-scoring assessment areas

### 📝 Clinical Notes
- **Free-text Notes**: Add custom observations and recommendations
- **Comprehensive Summary**: Patient info, scores, and recommendations in one view

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

## How to Use

### Quick Assessment (Experienced Users)
1. Enter patient information at the top
2. Use the numbered buttons in each section header for rapid scoring
3. View real-time total score and interpretation
4. Save when complete

### Detailed Assessment (Learning/Reference)
1. Enter patient information
2. Click on any assessment area to expand
3. Read the description and task instructions
4. Select the appropriate score using radio buttons
5. Continue through all 24 areas
6. Review clinical summary and recommendations

### Data Management
- **Auto-save**: Your work is automatically saved as you go
- **Manual Save**: Click "Save Assessment" to store current state
- **Clear All**: Use "Clear All" button to reset (with confirmation)
- **Data Persistence**: Return anytime to continue where you left off

## Technical Information

- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **Storage**: Browser localStorage
- **Scoring**: Real-time calculation with clinical interpretation
- **Responsive**: Works on desktop and tablet devices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:5173/ in your browser

## Scoring Reference

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

## Clinical Use

This application is designed to support clinical decision-making but should not replace professional clinical judgment. Always follow your institution's protocols and consult with appropriate healthcare professionals for patient care decisions.

---

**Note**: This application stores data locally in your browser. For clinical use, ensure compliance with your institution's data security and privacy policies.