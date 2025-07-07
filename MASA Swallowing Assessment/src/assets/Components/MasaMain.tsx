import React, { useState } from "react";
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AssessmentCard from "./AssessmentCard";
import ClinicalSummary from "./ClinicalSummary";

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

  // Calculate total score
  const totalScore = Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
        />

        <ClinicalSummary
          totalScore={totalScore}
          selectedGrades={selectedGrades}
          patientInfo={patientInfo}
        />
      </Container>
    </ThemeProvider>
  );
};

export default MasaMain;
