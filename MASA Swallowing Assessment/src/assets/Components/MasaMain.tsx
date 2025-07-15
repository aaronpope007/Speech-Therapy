import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, Button, AppBar, Toolbar, LinearProgress, Chip } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import ClinicalSummary from "./ClinicalSummary";
import AssessmentList from "./AssessmentList";
import PatientTracking from "./PatientTracking";
import { List as ListIcon, Assessment as AssessmentIcon, Analytics as AnalyticsIcon, Person as PersonIcon } from "@mui/icons-material";

interface PatientInfo {
  name: string;
  dateOfBirth: string;
  assessmentDate: string;
  clinician: string;
}

interface AssessmentData {
  patientInfo: PatientInfo;
  selectedGrades: { [key: number]: number | null };
  notes: string;
  savedDate: string;
  id?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const MasaMain: React.FC = () => {
  const [selectedGrades, setSelectedGrades] = useState<{ [key: number]: number | null }>({});
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    dateOfBirth: "",
    assessmentDate: new Date().toISOString().split('T')[0],
    clinician: "",
  });
  const [notes, setNotes] = useState<string>("");
  const [currentView, setCurrentView] = useState<'assessment' | 'list' | 'analytics' | 'patients'>('list');

  // Calculate total score
  const totalScore = Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);

  // Calculate completion progress
  const completedAreas = Object.values(selectedGrades).filter(val => val !== null).length;
  const totalAreas = 24; // Total MASA assessment areas
  const progressPercentage = (completedAreas / totalAreas) * 100;

  const handleLoadAssessment = (assessment: { selectedGrades: { [key: number]: number | null }; patientInfo: PatientInfo; notes: string }) => {
    setSelectedGrades(assessment.selectedGrades);
    setPatientInfo(assessment.patientInfo);
    setNotes(assessment.notes || "");
    setCurrentView('assessment');
  };

  const handleStartNew = () => {
    setSelectedGrades({});
    setPatientInfo({
      name: "",
      dateOfBirth: "",
      assessmentDate: new Date().toISOString().split('T')[0],
      clinician: "",
    });
    setNotes("");
    setCurrentView('assessment');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
        <AppBar position="static" sx={{ mb: 3, width: '100%', maxWidth: 600 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MASA Swallowing Assessment
            </Typography>
            <Button
              color="inherit"
              startIcon={
                currentView === 'list' ? <AssessmentIcon /> : 
                currentView === 'analytics' ? <AnalyticsIcon /> : 
                currentView === 'patients' ? <PersonIcon /> : 
                <ListIcon />
              }
              onClick={() => {
                if (currentView === 'list') setCurrentView('assessment');
                else if (currentView === 'assessment') setCurrentView('analytics');
                else if (currentView === 'analytics') setCurrentView('patients');
                else setCurrentView('list');
              }}
            >
              {currentView === 'list' ? 'New Assessment' : 
               currentView === 'analytics' ? 'Saved Assessments' : 
               currentView === 'patients' ? 'Analytics' : 
               'Patient Tracking'}
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, width: '100%', maxWidth: 1200 }}>
          {currentView === 'list' ? (
            <AssessmentList
              onLoadAssessment={handleLoadAssessment}
              onStartNew={handleStartNew}
            />
          ) : currentView === 'analytics' ? (
            <AnalyticsView />
          ) : currentView === 'patients' ? (
            <PatientTracking onLoadAssessment={handleLoadAssessment} />
          ) : (
            <>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  MASA Swallowing Assessment
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Mann Assessment of Swallowing Ability
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Complete the assessment below to evaluate swallowing function and generate clinical recommendations.
                </Typography>
              </Box>

              {/* Progress Indicator */}
              {completedAreas > 0 && (
                <Box sx={{ width: '100%', mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Assessment Progress
                    </Typography>
                    <Chip 
                      label={`${completedAreas}/${totalAreas} areas completed`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              <AssessmentCard
                selectedGrades={selectedGrades}
                setSelectedGrades={setSelectedGrades}
                patientInfo={patientInfo}
                setPatientInfo={setPatientInfo}
                notes={notes}
                setNotes={setNotes}
              />
              <ClinicalSummary
                totalScore={totalScore}
                selectedGrades={selectedGrades}
                patientInfo={patientInfo}
              />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

// Analytics Component
const AnalyticsView: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);

  useEffect(() => {
    const savedAssessments: AssessmentData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('masa-assessment-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          savedAssessments.push(data);
        } catch (error) {
          console.error('Error loading assessment:', error);
        }
      }
    }
    setAssessments(savedAssessments);
  }, []);

  const getAverageScore = () => {
    if (assessments.length === 0) return 0;
    const totalScores = assessments.map(assessment => {
      return Object.values(assessment.selectedGrades).reduce((acc: number, val: number | null) => acc + (typeof val === 'number' ? val : 0), 0);
    });
    return Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length);
  };

  const getSeverityDistribution = () => {
    const distribution = { normal: 0, mild: 0, moderate: 0, severe: 0 };
    assessments.forEach(assessment => {
      const score = Object.values(assessment.selectedGrades).reduce((acc: number, val: number | null) => acc + (typeof val === 'number' ? val : 0), 0);
      if (score >= 178) distribution.normal++;
      else if (score >= 168) distribution.mild++;
      else if (score >= 139) distribution.moderate++;
      else distribution.severe++;
    });
    return distribution;
  };

  const distribution = getSeverityDistribution();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Assessment Analytics
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">{assessments.length}</Typography>
          <Typography variant="body2">Total Assessments</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">{getAverageScore()}</Typography>
          <Typography variant="body2">Average Score</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">{distribution.normal}</Typography>
          <Typography variant="body2">Normal Results</Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">{distribution.mild + distribution.moderate}</Typography>
          <Typography variant="body2">Dysphagia Cases</Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        Severity Distribution
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip label={`Normal: ${distribution.normal}`} color="success" />
        <Chip label={`Mild: ${distribution.mild}`} color="warning" />
        <Chip label={`Moderate: ${distribution.moderate}`} color="warning" />
        <Chip label={`Severe: ${distribution.severe}`} color="error" />
      </Box>

      {assessments.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No assessments found. Complete some assessments to see analytics.
        </Typography>
      )}
    </Box>
  );
};

export default MasaMain;