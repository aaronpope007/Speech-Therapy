# AI Clinical Report Integration Guide

This guide will walk you through the steps needed to get the AI clinical report generation feature working in your MASA Swallowing Assessment application.

## 🔍 Current Status

The AI report generation feature is **implemented** but requires configuration to work. The following components are already in place:

- ✅ `AIReportGenerator` component (fully functional)
- ✅ `GeminiService` service (updated with latest API)
- ✅ Integration with assessment workflow
- ❌ **Missing**: API key configuration

## 📋 Step-by-Step Integration Checklist

### Step 1: Get a Google Gemini API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" button
   - Select "Create API key in new project" (or choose existing project)
   - Copy the generated API key immediately (you won't be able to see it again)

3. **Note API Quota**
   - Free tier: 15 requests/minute, 1,500 requests/day
   - Paid tier available for higher usage

### Step 2: Configure Environment Variables

1. **Create `.env` file** (if it doesn't exist)
   - In your project root directory
   - Copy from `env.example` if needed

2. **Add Gemini API Key**
   ```bash
   # Add this line to your .env file
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Verify Environment File**
   - Make sure `.env` is in `.gitignore` (should not be committed)
   - File should be at: `MASA Swallowing Assessment/.env`

### Step 3: Restart Development Server

**IMPORTANT**: Environment variables are only loaded when the server starts.

1. Stop your current development server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test the Integration

1. **Use the Test Component** (if available in your app)
   - Navigate to the Gemini API Test component
   - Click "Test API Connection"
   - Should see: "✅ Gemini API connection successful!"

2. **Test with Assessment**
   - Complete all 24 MASA assessment areas
   - Fill in patient information
   - Click "Generate AI Clinical Report"
   - Wait 5-10 seconds for generation

### Step 5: Verify Everything Works

✅ **Success Indicators:**
- No "API key not configured" error
- Report generates successfully
- Clinical impression appears
- Severity level is displayed
- Confidence score is shown

❌ **Common Issues:**
- "API key not configured" → Check `.env` file and restart server
- "API key is empty" → Verify the key value in `.env`
- "PERMISSION_DENIED" → API key may be invalid or expired
- "RESOURCE_EXHAUSTED" → API quota exceeded (wait or upgrade)

## 🔧 Technical Details

### API Configuration

The service uses:
- **Model**: `gemini-1.5-flash` (fast and efficient)
- **Alternative**: Can change to `gemini-1.5-pro` for better quality (slower)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Temperature**: 0.3 (low randomness for consistent clinical output)

### Code Locations

- **Service**: `src/services/GeminiService.ts`
- **Component**: `src/components/Assessment/AIReportGenerator.tsx`
- **Test Component**: `src/components/Assessment/GeminiAPITest.tsx`
- **Integration**: `src/assets/Components/AssessmentCard.tsx` (line 560-573)

### Recent Updates

✅ Updated to use `gemini-1.5-flash` model (latest)
✅ Improved error handling with specific error messages
✅ Added safety filter checks
✅ Fixed test component to use proper service methods

## 🚨 Troubleshooting

### Issue: "Gemini API key not configured"

**Solution:**
1. Check that `.env` file exists in project root
2. Verify `VITE_GEMINI_API_KEY` is set (no quotes needed)
3. Restart development server
4. Check browser console for environment variable loading

### Issue: "API key is empty"

**Solution:**
1. Open `.env` file
2. Ensure the line looks like: `VITE_GEMINI_API_KEY=AIza...` (no spaces around `=`)
3. Remove any quotes around the key value
4. Restart server

### Issue: "PERMISSION_DENIED" or "INVALID_ARGUMENT"

**Solution:**
1. Verify API key is correct (no typos)
2. Check if API key is active in Google AI Studio
3. Ensure API key hasn't been revoked
4. Try creating a new API key

### Issue: "RESOURCE_EXHAUSTED"

**Solution:**
1. You've hit the free tier quota (15/min or 1500/day)
2. Wait a few minutes and try again
3. Consider upgrading to paid tier for higher limits
4. Check usage in Google AI Studio dashboard

### Issue: Report generation is slow

**Solution:**
1. This is normal (5-10 seconds is typical)
2. Can switch to `gemini-1.5-flash` (faster) vs `gemini-1.5-pro` (better quality)
3. Check internet connection
4. Verify API quota isn't being throttled

### Issue: Content blocked by safety filters

**Solution:**
1. This is rare but can happen with certain medical terminology
2. The safety settings are configured for healthcare compliance
3. Try rephrasing or adjusting the prompt
4. Contact support if persistent

## 📊 API Usage Monitoring

### Check Your Usage

1. Visit: https://makersuite.google.com/app/apikey
2. Click on your API key
3. View usage statistics and quota limits

### Best Practices

- **Monitor Usage**: Check regularly to avoid hitting limits
- **Cache Reports**: Consider caching generated reports to reduce API calls
- **Batch Requests**: Group multiple assessments if possible
- **Error Handling**: Implement retry logic for transient failures

## 🔒 Security & Privacy

### HIPAA Compliance

✅ **Current Implementation:**
- No data stored on Google servers
- Data sent only for processing (not training)
- HTTPS encryption for all API calls
- Audit trail with timestamps

⚠️ **Important Notes:**
- Review your organization's data sharing policies
- Ensure API key is kept secure (never commit to git)
- Consider additional encryption for sensitive data
- Document AI usage in clinical records

### API Key Security

- ✅ Never commit `.env` file to version control
- ✅ Use different keys for development/production
- ✅ Rotate keys periodically
- ✅ Restrict API key permissions if possible

## 🎯 Next Steps After Integration

1. **Test Thoroughly**
   - Generate reports with various assessment scores
   - Test different severity levels
   - Try different report tones
   - Verify export functionality

2. **Train Users**
   - Show clinicians how to use the feature
   - Explain AI-generated content disclaimers
   - Review report quality expectations

3. **Monitor Performance**
   - Track API usage and costs
   - Collect user feedback
   - Monitor error rates
   - Optimize as needed

4. **Consider Enhancements**
   - Save generated reports to patient records
   - Add report templates
   - Implement report history
   - Add batch generation

## 📞 Support Resources

### Google AI Studio
- **Dashboard**: https://makersuite.google.com/
- **Documentation**: https://ai.google.dev/docs
- **Community**: https://ai.google.dev/community

### Application Support
- Check error logs in browser console
- Review `GEMINI_API_SETUP.md` for additional details
- Test with `GeminiAPITest` component

## ✅ Final Checklist

Before considering integration complete:

- [ ] API key obtained from Google AI Studio
- [ ] `.env` file created with `VITE_GEMINI_API_KEY`
- [ ] Development server restarted
- [ ] API connection test successful
- [ ] Report generation works with test assessment
- [ ] Error handling verified
- [ ] Security considerations reviewed
- [ ] Team trained on feature usage

---

**Status**: Ready for integration - just needs API key configuration!

**Last Updated**: After code improvements for better error handling and latest API model support.

