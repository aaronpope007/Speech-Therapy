import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Divider,
} from '@mui/material';
import { AutoAwesome as AIIcon } from '@mui/icons-material';
import { geminiService } from '../../services/GeminiService';

const GeminiAPITest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState('Hello, can you respond with "API test successful" if you can read this message?');

  const handleTestConnection = async () => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const isConnected = await geminiService.testConnection();
      if (isConnected) {
        setTestResult('✅ Gemini API connection successful! The AI report generation feature is ready to use.');
      } else {
        setError('❌ API connection failed. Please check your API key configuration.');
      }
    } catch (err) {
      setError(`❌ Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCustomTest = async () => {
    if (!testPrompt.trim()) {
      setError('Please enter a test prompt');
      return;
    }

    setIsTesting(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await geminiService['makeRequest'](testPrompt);
      setTestResult(`✅ API Response:\n\n${response}`);
    } catch (err) {
      setError(`❌ Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AIIcon color="primary" />
        Gemini API Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This tool helps verify that your Gemini API integration is working correctly for AI report generation.
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Connection Test
        </Typography>
        <Button
          variant="contained"
          startIcon={isTesting ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={handleTestConnection}
          disabled={isTesting}
          sx={{ mb: 2 }}
        >
          {isTesting ? 'Testing...' : 'Test API Connection'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Custom Test
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Test Prompt"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={handleCustomTest}
          disabled={isTesting || !testPrompt.trim()}
        >
          {isTesting ? 'Testing...' : 'Send Custom Test'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {testResult && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {testResult}
          </Typography>
        </Alert>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> If the connection test fails, please:
        </Typography>
        <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1, pl: 2 }}>
          <li>Verify your API key is set in the .env file</li>
          <li>Check that the API key is valid and active</li>
          <li>Ensure you have sufficient API quota</li>
          <li>Restart the development server after adding the API key</li>
        </Typography>
      </Box>
    </Paper>
  );
};

export default GeminiAPITest;
