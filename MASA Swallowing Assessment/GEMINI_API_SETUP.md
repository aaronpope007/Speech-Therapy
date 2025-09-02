# Google Gemini API Setup Guide

This guide will help you set up Google's Gemini API for AI-powered clinical report generation in the MASA Swallowing Assessment application.

## 🚀 Getting Started

### 1. Get a Google AI Studio API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (keep it secure!)

### 2. Configure Environment Variables

Create or update your `.env` file in the project root:

```bash
# Existing Firebase variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Add Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## 🔧 API Configuration

The Gemini API is configured with the following settings for optimal clinical report generation:

- **Model**: `gemini-pro` (latest stable model)
- **Temperature**: 0.3 (low randomness for consistent clinical output)
- **Max Tokens**: 2048 (sufficient for detailed reports)
- **Safety Settings**: Enabled for healthcare compliance

## 🏥 Clinical Report Features

The AI report generator provides:

### 📋 Report Content
- **Clinical Impression**: Detailed analysis of swallowing function
- **Severity Classification**: Normal, Mild, Moderate, or Severe dysphagia
- **Confidence Scoring**: AI confidence in the assessment
- **Treatment Recommendations**: Evidence-based suggestions
- **Risk Factor Analysis**: Aspiration and complication risks

### 🎛️ Customization Options
- **Report Tone**: Clinical, Patient-friendly, or Technical
- **Content Selection**: Include/exclude recommendations and risk factors
- **Export Options**: Copy to clipboard or download as text file

### 📊 Integration
- **Automatic Triggering**: Available when all 24 assessment areas are complete
- **Real-time Generation**: Instant report creation
- **Data Validation**: Ensures complete assessment before generation

## 🔒 Security & Privacy

### HIPAA Compliance
- **No Data Storage**: Generated reports are not stored on external servers
- **Local Processing**: Assessment data stays within your application
- **Secure API**: HTTPS encryption for all API communications
- **Audit Trail**: All generated reports include timestamps and disclaimers

### Data Handling
- **Patient Data**: Only assessment scores and basic patient info are sent
- **No PHI Storage**: Google does not store or use your data for training
- **Temporary Processing**: Data is processed and immediately discarded

## 🧪 Testing the Integration

### 1. Complete an Assessment
- Fill out all 24 MASA assessment areas
- Complete patient information
- Add any clinical notes

### 2. Generate AI Report
- Click "Generate AI Clinical Report"
- Wait for processing (typically 5-10 seconds)
- Review the generated report

### 3. Customize Settings
- Click the settings icon to adjust report options
- Choose report tone and content preferences
- Generate multiple versions as needed

## 🚨 Troubleshooting

### Common Issues

#### "API key not configured" Error
- Ensure `VITE_GEMINI_API_KEY` is set in your `.env` file
- Restart the development server
- Check for typos in the API key

#### "Failed to generate report" Error
- Verify your API key is valid and active
- Check your internet connection
- Ensure you have sufficient API quota

#### "No assessment data available" Error
- Complete all 24 assessment areas
- Fill in required patient information
- Save the assessment before generating reports

### API Quota Limits
- **Free Tier**: 15 requests per minute, 1500 requests per day
- **Paid Tier**: Higher limits available through Google Cloud Console
- **Monitoring**: Check usage in Google AI Studio dashboard

## 📈 Best Practices

### For Optimal Results
1. **Complete Assessments**: Ensure all 24 areas are scored
2. **Detailed Notes**: Include relevant clinical observations
3. **Review Reports**: Always review AI-generated content before clinical use
4. **Multiple Generations**: Try different tones for different audiences

### Clinical Validation
- **Professional Review**: Always have a qualified SLP review AI reports
- **Clinical Judgment**: Use AI as a tool, not a replacement for expertise
- **Documentation**: Include AI report generation in clinical documentation

## 🔄 Updates & Maintenance

### API Version Updates
- The application uses the latest stable Gemini model
- Updates are handled automatically
- Monitor Google AI Studio for new features

### Cost Management
- Monitor API usage in Google AI Studio
- Set up billing alerts if using paid tier
- Consider usage patterns for optimization

## 📞 Support

### Technical Support
- **Google AI Studio**: [https://makersuite.google.com/](https://makersuite.google.com/)
- **API Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Community Forum**: [https://ai.google.dev/community](https://ai.google.dev/community)

### Application Support
- Check the application's error logs
- Verify environment variable configuration
- Test with a simple assessment first

## ⚠️ Important Disclaimers

1. **AI-Generated Content**: All reports are AI-generated and should be reviewed by qualified healthcare professionals
2. **Clinical Responsibility**: The AI is a tool to assist clinicians, not replace clinical judgment
3. **Data Privacy**: Ensure compliance with your organization's data privacy policies
4. **Regulatory Compliance**: Verify that AI-generated reports meet your regulatory requirements

---

**Note**: This feature enhances clinical workflow but should be used as part of a comprehensive clinical assessment process.
