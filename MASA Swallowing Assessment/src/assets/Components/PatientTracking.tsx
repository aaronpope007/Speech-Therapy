import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { AssessmentData } from "../../types/Patient";



interface PatientTrackingProps {
  onLoadAssessment: (assessment: AssessmentData) => void;
}

interface PatientData {
  name: string;
  dateOfBirth: string;
  assessments: AssessmentData[];
  totalAssessments: number;
  firstAssessment: string;
  lastAssessment: string;
  averageScore: number;
  scoreTrend: 'improving' | 'declining' | 'stable' | 'insufficient';
  severityHistory: Array<{
    date: string;
    score: number;
    severity: string;
    color: string;
  }>;
}

const PatientTracking: React.FC<PatientTrackingProps> = ({ onLoadAssessment }) => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Load all assessments
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    const savedAssessments: AssessmentData[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('masa-assessment-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          savedAssessments.push({
            ...data,
            id: key,
          });
        } catch (error) {
          console.error('Error loading assessment:', error);
        }
      }
    }

    savedAssessments.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
    setAssessments(savedAssessments);
  };

  // Group assessments by patient
  const patients = useMemo(() => {
    const patientMap = new Map<string, AssessmentData[]>();
    
    assessments.forEach(assessment => {
      const patientKey = `${assessment.patientInfo.name}-${assessment.patientInfo.dateOfBirth}`;
      if (!patientMap.has(patientKey)) {
        patientMap.set(patientKey, []);
      }
      patientMap.get(patientKey)!.push(assessment);
    });

    const patientData: PatientData[] = [];
    
    patientMap.forEach((patientAssessments, patientKey) => {
      const [name, dateOfBirth] = patientKey.split('-');
      
      // Sort assessments by date
      const sortedAssessments = patientAssessments.sort(
        (a, b) => new Date(a.patientInfo.assessmentDate).getTime() - new Date(b.patientInfo.assessmentDate).getTime()
      );

      // Calculate scores and trends
      const scores = sortedAssessments.map(assessment => {
        const score = Object.values(assessment.selectedGrades).reduce(
          (acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0
        );
        return score;
      });

      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      // Determine trend
      let scoreTrend: 'improving' | 'declining' | 'stable' | 'insufficient' = 'insufficient';
      if (scores.length >= 3) {
        const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
        const secondHalf = scores.slice(Math.ceil(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 5) scoreTrend = 'improving';
        else if (secondAvg < firstAvg - 5) scoreTrend = 'declining';
        else scoreTrend = 'stable';
      }

      // Create severity history
      const severityHistory = sortedAssessments.map(assessment => {
        const score = Object.values(assessment.selectedGrades).reduce(
          (acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0
        );
        
        let severity = "Unknown";
        let color = "default";
        
        if (score >= 178) {
          severity = "No abnormality";
          color = "success";
        } else if (score >= 168) {
          severity = "Mild dysphagia";
          color = "warning";
        } else if (score >= 139) {
          severity = "Moderate dysphagia";
          color = "warning";
        } else {
          severity = "Severe dysphagia";
          color = "error";
        }

        return {
          date: assessment.patientInfo.assessmentDate,
          score,
          severity,
          color,
        };
      });

      patientData.push({
        name,
        dateOfBirth,
        assessments: sortedAssessments,
        totalAssessments: sortedAssessments.length,
        firstAssessment: sortedAssessments[0]?.patientInfo.assessmentDate || '',
        lastAssessment: sortedAssessments[sortedAssessments.length - 1]?.patientInfo.assessmentDate || '',
        averageScore,
        scoreTrend,
        severityHistory,
      });
    });

    return patientData.sort((a, b) => b.totalAssessments - a.totalAssessments);
  }, [assessments]);

  const selectedPatientData = patients.find(p => `${p.name}-${p.dateOfBirth}` === selectedPatient);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUpIcon color="success" />;
      case 'declining':
        return <TrendingUpIcon sx={{ transform: 'rotate(180deg)', color: 'error.main' }} />;
      case 'stable':
        return <TimelineIcon color="primary" />;
      default:
        return <AssessmentIcon color="disabled" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Declining';
      case 'stable':
        return 'Stable';
      default:
        return 'Insufficient Data';
    }
  };

  const exportPatientReport = (patient: PatientData) => {
    const report = {
      patient: {
        name: patient.name,
        dateOfBirth: patient.dateOfBirth,
        totalAssessments: patient.totalAssessments,
        firstAssessment: patient.firstAssessment,
        lastAssessment: patient.lastAssessment,
        averageScore: patient.averageScore,
        scoreTrend: patient.scoreTrend,
      },
      assessments: patient.assessments,
      severityHistory: patient.severityHistory,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient-report-${patient.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Patient Progress Tracking
      </Typography>

      <Grid container spacing={3}>
        {/* Patient List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Patients ({patients.length})
            </Typography>
            <List>
              {patients.map((patient) => {
                const patientKey = `${patient.name}-${patient.dateOfBirth}`;
                return (
                  <ListItem
                    key={patientKey}
                    button
                    selected={selectedPatient === patientKey}
                    onClick={() => setSelectedPatient(patientKey)}
                    sx={{ mb: 1, borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" />
                          <Typography variant="subtitle1">
                            {patient.name}
                          </Typography>
                          <Chip
                            label={patient.totalAssessments}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            DOB: {patient.dateOfBirth}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            {getTrendIcon(patient.scoreTrend)}
                            <Typography variant="body2" color="text.secondary">
                              {getTrendLabel(patient.scoreTrend)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Patient Details */}
        <Grid item xs={12} md={8}>
          {selectedPatientData ? (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {selectedPatientData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth: {selectedPatientData.dateOfBirth}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => exportPatientReport(selectedPatientData)}
                >
                  Export Report
                </Button>
              </Box>

              {/* Patient Summary */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {selectedPatientData.totalAssessments}
                      </Typography>
                      <Typography variant="body2">Total Assessments</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        {selectedPatientData.averageScore}
                      </Typography>
                      <Typography variant="body2">Average Score</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        {selectedPatientData.firstAssessment}
                      </Typography>
                      <Typography variant="body2">First Assessment</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        {selectedPatientData.lastAssessment}
                      </Typography>
                      <Typography variant="body2">Latest Assessment</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Progress Trend */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Progress Trend
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getTrendIcon(selectedPatientData.scoreTrend)}
                  <Typography variant="body1">
                    {getTrendLabel(selectedPatientData.scoreTrend)}
                  </Typography>
                  {selectedPatientData.scoreTrend === 'insufficient' && (
                    <Alert severity="info" sx={{ flex: 1 }}>
                      Need at least 3 assessments to determine trend
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Assessment History */}
              <Accordion defaultExpanded={selectedPatientData.assessments.length <= 3}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="assessment-history-content"
                  id="assessment-history-header"
                >
                  <Typography variant="h6">
                    Assessment History ({selectedPatientData.assessments.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedPatientData.assessments.map((assessment, index) => {
                      const score = Object.values(assessment.selectedGrades).reduce(
                        (acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0
                      );
                      
                      let severity = "Unknown";
                      let color: "success" | "warning" | "error" | "default" = "default";
                      
                      if (score >= 178) {
                        severity = "No abnormality";
                        color = "success";
                      } else if (score >= 168) {
                        severity = "Mild dysphagia";
                        color = "warning";
                      } else if (score >= 139) {
                        severity = "Moderate dysphagia";
                        color = "warning";
                      } else {
                        severity = "Severe dysphagia";
                        color = "error";
                      }

                      return (
                        <ListItem
                          key={assessment.id}
                          sx={{ mb: 1, border: 1, borderColor: 'grey.300', borderRadius: 1 }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1">
                                  Assessment #{index + 1}
                                </Typography>
                                <Chip label={`${score}/200`} color="primary" size="small" />
                                <Chip label={severity} color={color} size="small" />
                                <Typography variant="body2" color="text.secondary">
                                  {assessment.patientInfo.assessmentDate}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Clinician: {assessment.patientInfo.clinician}
                                </Typography>
                                {assessment.notes && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Notes: {assessment.notes}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => onLoadAssessment(assessment)}
                              color="primary"
                            >
                              <AssessmentIcon />
                            </IconButton>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a patient to view progress
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose a patient from the list to see their assessment history and progress trends.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientTracking; 