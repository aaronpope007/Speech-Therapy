import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { AssessmentData } from '../../types/Patient';
import { GeminiReportRequest, GeminiReportResponse, geminiService } from '../../services/GeminiService';

interface AIReportGeneratorProps {
  assessmentData: AssessmentData;
  onReportGenerated?: (report: GeminiReportResponse) => void;
  disabled?: boolean;
}

const AIReportGenerator: React.FC<AIReportGeneratorProps> = ({
  assessmentData,
  onReportGenerated,
  disabled = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<GeminiReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Report generation settings
  const [settings, setSettings] = useState({
    includeRecommendations: true,
    includeRiskFactors: true,
    tone: 'clinical' as 'clinical' | 'patient-friendly' | 'technical',
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'success';
      case 'mild': return 'warning';
      case 'moderate': return 'error';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'normal': return <CheckIcon />;
      case 'mild': return <WarningIcon />;
      case 'moderate': return <ErrorIcon />;
      case 'severe': return <ErrorIcon />;
      default: return <InfoIcon />;
    }
  };

  const handleGenerateReport = useCallback(async () => {
    if (!assessmentData) {
      setError('No assessment data available');
      return;
    }

    console.log('Starting report generation...', { assessmentData, settings });
    setIsGenerating(true);
    setError(null);
    setReport(null);

    try {
      const request: GeminiReportRequest = {
        assessmentData,
        includeRecommendations: settings.includeRecommendations,
        includeRiskFactors: settings.includeRiskFactors,
        tone: settings.tone,
      };

      console.log('Calling geminiService.generateReport with request:', request);
      const generatedReport = await geminiService.generateReport(request);
      console.log('Received report from service:', generatedReport);
      
      if (!generatedReport || !generatedReport.clinicalImpression) {
        console.error('Report is missing clinicalImpression:', generatedReport);
        setError('Report generated but clinical impression is missing. Check console for details.');
        setReport(generatedReport); // Still set it so user can see what we got
      } else {
        setReport(generatedReport);
        onReportGenerated?.(generatedReport);
        console.log('Report successfully set in state');
      }
    } catch (err) {
      console.error('Error in handleGenerateReport:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      
      // If it's a model not found error, list available models
      if (errorMessage.includes('not found') || errorMessage.includes('not supported')) {
        console.log('Model error detected. Listing available models...');
        await geminiService.listModels();
      }
    } finally {
      setIsGenerating(false);
      console.log('Report generation finished');
    }
  }, [assessmentData, settings, onReportGenerated]);

  const handleListModels = useCallback(async () => {
    console.log('Manually listing available models...');
    await geminiService.listModels();
  }, []);

  const handleCopyReport = async () => {
    if (!report) return;

    const reportText = `
CLINICAL IMPRESSION:
${report.clinicalImpression}

SEVERITY LEVEL: ${report.severityLevel.toUpperCase()}
CONFIDENCE SCORE: ${(report.confidenceScore * 100).toFixed(1)}%

Generated on: ${new Date(report.generatedAt).toLocaleString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy report:', err);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const reportText = `
MASA ASSESSMENT - AI GENERATED CLINICAL REPORT
==============================================

PATIENT: ${assessmentData.patientInfo.name}
MRN: ${assessmentData.patientInfo.mrn}
ASSESSMENT DATE: ${assessmentData.patientInfo.assessmentDate}
CLINICIAN: ${assessmentData.patientInfo.clinician}

CLINICAL IMPRESSION:
${report.clinicalImpression}

SEVERITY LEVEL: ${report.severityLevel.toUpperCase()}
CONFIDENCE SCORE: ${(report.confidenceScore * 100).toFixed(1)}%

Generated on: ${new Date(report.generatedAt).toLocaleString()}
Generated by: AI Assistant (Google Gemini)

DISCLAIMER: This report is AI-generated and should be reviewed by a qualified healthcare professional before clinical use.
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MASA_Report_${assessmentData.patientInfo.name}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isAssessmentComplete = Object.values(assessmentData.selectedGrades).filter(score => score !== null).length === 24;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="primary" />
            AI Clinical Report Generator
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="List Available Models (Check Console)">
              <IconButton
                size="small"
                onClick={handleListModels}
                disabled={isGenerating}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Report Settings">
              <IconButton
                size="small"
                onClick={() => setShowSettings(true)}
                disabled={isGenerating}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {!isAssessmentComplete && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Complete all 24 assessment areas before generating an AI report for best results.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={isGenerating ? <CircularProgress size={20} /> : <AIIcon />}
          onClick={handleGenerateReport}
          disabled={disabled || isGenerating}
          fullWidth
          sx={{ mb: 2 }}
        >
          {isGenerating ? 'Generating Report...' : 'Generate AI Clinical Report'}
        </Button>

        {report && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">Generated Report</Typography>
              <Chip
                icon={getSeverityIcon(report.severityLevel)}
                label={`${report.severityLevel.toUpperCase()} DYSPHAGIA`}
                color={getSeverityColor(report.severityLevel) as any}
                size="small"
              />
              <Chip
                label={`${(report.confidenceScore * 100).toFixed(1)}% Confidence`}
                variant="outlined"
                size="small"
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={12}
              value={report.clinicalImpression || 'No clinical impression generated.'}
              variant="outlined"
              label="Clinical Report"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': {
                  bgcolor: 'grey.50',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                },
                '& .MuiInputBase-input': {
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                onClick={handleCopyReport}
                size="small"
              >
                {copied ? 'Copied!' : 'Copy Report'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadReport}
                size="small"
              >
                Download Report
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Generated on {new Date(report.generatedAt).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Generation Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Report Content</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.includeRecommendations}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                  />
                }
                label="Include treatment recommendations"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.includeRiskFactors}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeRiskFactors: e.target.checked }))}
                  />
                }
                label="Include risk factor analysis"
              />
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Report Tone</FormLabel>
              <RadioGroup
                value={settings.tone}
                onChange={(e) => setSettings(prev => ({ ...prev, tone: e.target.value as any }))}
              >
                <FormControlLabel value="clinical" control={<Radio />} label="Clinical (Healthcare professionals)" />
                <FormControlLabel value="patient-friendly" control={<Radio />} label="Patient-friendly (Lay audience)" />
                <FormControlLabel value="technical" control={<Radio />} label="Technical (Specialists)" />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIReportGenerator;
