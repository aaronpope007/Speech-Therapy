import React, { useState } from "react";
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, Button, AppBar, Toolbar } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import ClinicalSummary from "./ClinicalSummary";
import AssessmentList from "./AssessmentList";
import { List as ListIcon, Assessment as AssessmentIcon } from "@mui/icons-material";

interface PatientInfo {
  name: string;
  dateOfBirth: string;
  assessmentDate: string;
  clinician: string;
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
  const [currentView, setCurrentView] = useState<'assessment' | 'list'>('list');

  // Calculate total score
  const totalScore = Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);

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
              startIcon={currentView === 'list' ? <AssessmentIcon /> : <ListIcon />}
              onClick={() => setCurrentView(currentView === 'list' ? 'assessment' : 'list')}
            >
              {currentView === 'list' ? 'New Assessment' : 'Saved Assessments'}
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, width: '100%', maxWidth: 600 }}>
          {currentView === 'list' ? (
            <AssessmentList
              onLoadAssessment={handleLoadAssessment}
              onStartNew={handleStartNew}
            />
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

export default MasaMain;
