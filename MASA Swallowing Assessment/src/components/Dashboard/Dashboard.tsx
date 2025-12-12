import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { EnhancedPatientService } from '../../services/EnhancedPatientService';
import { PatientWithAssessments, AssessmentData } from '../../types/Patient';
import { DemoDataGenerator } from '../../utils/generateDemoData';

interface DashboardProps {
  onStartNewAssessment: () => void;
  onLoadAssessment: (assessment: AssessmentData) => void;
  onNavigateToPatients: () => void;
  onNavigateToAnalytics: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onStartNewAssessment,
  onLoadAssessment,
  onNavigateToPatients,
  onNavigateToAnalytics,
}) => {
  const [patients, setPatients] = useState<PatientWithAssessments[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPatientDialog, setNewPatientDialog] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    dateOfBirth: '',
    mrn: '',
  });
  const [viewMode, setViewMode] = useState<'all' | 'patients'>('all');

  useEffect(() => {
    loadPatients();
    // Also reload when component becomes visible (handles tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPatients();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      // Force localStorage mode before loading
      EnhancedPatientService.switchToLocalStorage();
      // Small delay to ensure switch takes effect
      await new Promise(resolve => setTimeout(resolve, 50));
      const patientsWithAssessments = await EnhancedPatientService.getPatientsWithAssessments();
      console.log('Loaded patients:', patientsWithAssessments.length);
      console.log('Patients data:', patientsWithAssessments);
      if (patientsWithAssessments.length > 0) {
        console.log('Sample patient:', patientsWithAssessments[0]);
        console.log('Total assessments:', patientsWithAssessments.reduce((sum, p) => sum + (p.totalAssessments || 0), 0));
      }
      setPatients(patientsWithAssessments);
    } catch (error) {
      console.error('Error loading patients:', error);
      // Fallback: try loading directly from PatientService
      try {
        const { PatientService } = await import('../../services/PatientService');
        const directPatients = PatientService.getPatientsWithAssessments();
        console.log('Fallback load:', directPatients.length, 'patients');
        setPatients(directPatients);
      } catch (fallbackError) {
        console.error('Fallback load also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    if (newPatientData.name && newPatientData.dateOfBirth) {
      try {
        await EnhancedPatientService.createPatient(newPatientData);
        setNewPatientData({ name: '', dateOfBirth: '', mrn: '' });
        setNewPatientDialog(false);
        loadPatients();
      } catch (error) {
        console.error('Error creating patient:', error);
      }
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient and all their assessments?')) {
      try {
        await EnhancedPatientService.deletePatient(patientId);
        loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await EnhancedPatientService.deleteAssessment(assessmentId);
        loadPatients();
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const getScoringInterpretation = (score: number) => {
    if (score >= 178) return { severity: "No abnormality", color: "success" as const };
    if (score >= 168) return { severity: "Mild dysphagia", color: "warning" as const };
    if (score >= 139) return { severity: "Moderate dysphagia", color: "warning" as const };
    return { severity: "Severe dysphagia", color: "error" as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate stats - ensure we handle undefined/null values
  const totalAssessments = patients.reduce((sum, patient) => {
    return sum + (patient.totalAssessments || (patient.assessments ? patient.assessments.length : 0));
  }, 0);
  const totalPatients = patients.length;
  
  // Calculate normal and dysphagia cases based on average scores
  const normalResults = patients.filter(p => {
    const score = p.averageScore;
    return score !== undefined && score !== null && score >= 178;
  }).length;
  
  const dysphagiaCases = patients.filter(p => {
    const score = p.averageScore;
    return score !== undefined && score !== null && score < 178;
  }).length;

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          MASA Swallowing Assessment
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Mann Assessment of Swallowing Ability
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{totalPatients}</Typography>
              <Typography variant="body2">Total Patients</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{totalAssessments}</Typography>
              <Typography variant="body2">Total Assessments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">
                {normalResults}
              </Typography>
              <Typography variant="body2">Normal Results</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">
                {dysphagiaCases}
              </Typography>
              <Typography variant="body2">Dysphagia Cases</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={onStartNewAssessment}
          sx={{ minWidth: 200 }}
        >
          New Assessment
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<PersonIcon />}
          onClick={loadPatients}
          sx={{ minWidth: 200 }}
          title="Refresh data from storage"
        >
          Refresh Data
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<PersonIcon />}
          onClick={onNavigateToPatients}
          sx={{ minWidth: 200 }}
        >
          Manage Patients
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<AnalyticsIcon />}
          onClick={onNavigateToAnalytics}
          sx={{ minWidth: 200 }}
        >
          Analytics
        </Button>
      </Box>

      {/* View Toggle */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant={viewMode === 'all' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('all')}
          sx={{ mr: 1 }}
        >
          All Assessments
        </Button>
        <Button
          variant={viewMode === 'patients' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('patients')}
        >
          By Patient
        </Button>
      </Box>

      {/* Content */}
      {viewMode === 'all' ? (
        // All Assessments View
        <Box>
          {(() => {
            const allAssessments = patients.flatMap(patient => patient.assessments);
            if (allAssessments.length === 0) {
              return (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No assessments found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {patients.length > 0 
                      ? 'Patients exist but have no assessments yet. Switch to "By Patient" view to see them.'
                      : 'Create assessments to see them here.'}
                  </Typography>
                  {patients.length > 0 && (
                    <Button
                      variant="outlined"
                      onClick={() => setViewMode('patients')}
                      size="small"
                    >
                      View By Patient
                    </Button>
                  )}
                </Box>
              );
            }
            return (
              <Accordion defaultExpanded={true} sx={{ boxShadow: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="all-assessments-content"
                  id="all-assessments-header"
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      All Assessments ({allAssessments.length})
                    </Typography>
                    <Chip 
                      label={`${allAssessments.length} total`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Grid container spacing={3} sx={{ p: 3 }}>
                    {allAssessments.map(assessment => (
              <Grid item xs={12} md={6} lg={4} key={assessment.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getInitials(assessment.patientInfo.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3">
                          {assessment.patientInfo.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          MRN: {assessment.patientInfo.mrn}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      {(() => {
                        const score = Object.values(assessment.selectedGrades).reduce((acc: number, val) => 
                          acc + (typeof val === 'number' ? val : 0), 0);
                        const interpretation = getScoringInterpretation(score);
                        return (
                          <>
                            <Chip 
                              label={interpretation.severity} 
                              color={interpretation.color} 
                              size="small" 
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`${score}/200`} 
                              variant="outlined" 
                              size="small"
                            />
                          </>
                        );
                      })()}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {formatDate(assessment.patientInfo.assessmentDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <MedicalIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {assessment.patientInfo.clinician}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Tooltip title="View Assessment">
                        <IconButton 
                          size="small" 
                          onClick={() => onLoadAssessment(assessment)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export Assessment">
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            const dataStr = JSON.stringify(assessment, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `masa-assessment-${assessment.patientInfo.name}-${assessment.patientInfo.assessmentDate}.json`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          color="secondary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Delete Assessment">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            );
          })()}
        </Box>
      ) : (
        // By Patient View
        <Grid container spacing={3}>
          {patients.length > 0 ? patients.map(patient => (
            <Grid item xs={12} md={6} lg={4} key={patient.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getInitials(patient.name)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3">
                        {patient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        MRN: {patient.mrn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        DOB: {formatDate(patient.dateOfBirth)}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeletePatient(patient.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${patient.totalAssessments} assessment${patient.totalAssessments !== 1 ? 's' : ''}`} 
                      color="primary" 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    {patient.averageScore && (
                      <Chip 
                        label={`Avg: ${patient.averageScore}/200`} 
                        variant="outlined" 
                        size="small"
                      />
                    )}
                  </Box>

                  {patient.assessments.length > 0 && (
                    <Accordion sx={{ mt: 2, boxShadow: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`patient-${patient.id}-assessments-content`}
                        id={`patient-${patient.id}-assessments-header`}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {patient.assessments.length} Assessment{patient.assessments.length !== 1 ? 's' : ''}
                          {patient.latestAssessment && (() => {
                            const score = Object.values(patient.latestAssessment.selectedGrades).reduce((acc: number, val) => 
                              acc + (typeof val === 'number' ? val : 0), 0);
                            const interpretation = getScoringInterpretation(score);
                            return (
                              <Chip 
                                label={`Latest: ${interpretation.severity}`} 
                                color={interpretation.color} 
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            );
                          })()}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {patient.assessments.map((assessment, index) => {
                            const score = Object.values(assessment.selectedGrades).reduce((acc: number, val) => 
                              acc + (typeof val === 'number' ? val : 0), 0);
                            const interpretation = getScoringInterpretation(score);
                            return (
                              <Card key={assessment.id} variant="outlined" sx={{ p: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box>
                                    <Typography variant="body2" fontWeight="medium">
                                      Assessment #{index + 1} - {formatDate(assessment.patientInfo.assessmentDate)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                                      <Chip 
                                        label={interpretation.severity} 
                                        color={interpretation.color} 
                                        size="small"
                                      />
                                      <Chip 
                                        label={`${score}/200`} 
                                        variant="outlined" 
                                        size="small"
                                      />
                                      {assessment.patientInfo.clinician && (
                                        <Typography variant="caption" color="text.secondary">
                                          {assessment.patientInfo.clinician}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="View Assessment">
                                      <IconButton 
                                        size="small" 
                                        onClick={() => onLoadAssessment(assessment)}
                                        color="primary"
                                      >
                                        <ViewIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </Card>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={onStartNewAssessment}
                    fullWidth
                  >
                    New Assessment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No patients found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first patient to start tracking assessments.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Floating Action Button for New Patient */}
      <Fab
        color="primary"
        aria-label="add patient"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setNewPatientDialog(true)}
      >
        <PersonIcon />
      </Fab>

      {/* New Patient Dialog */}
      <Dialog open={newPatientDialog} onClose={() => setNewPatientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Patient Name"
            fullWidth
            variant="outlined"
            value={newPatientData.name}
            onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Date of Birth"
            type="date"
            fullWidth
            variant="outlined"
            value={newPatientData.dateOfBirth}
            onChange={(e) => setNewPatientData({ ...newPatientData, dateOfBirth: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Medical Record Number (MRN)"
            fullWidth
            variant="outlined"
            value={newPatientData.mrn}
            onChange={(e) => setNewPatientData({ ...newPatientData, mrn: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPatientDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePatient} variant="contained" disabled={!newPatientData.name || !newPatientData.dateOfBirth}>
            Add Patient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading State */}
      {loading && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading patients...
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {!loading && patients.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No patients found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first patient to start creating assessments and tracking progress over time.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewPatientDialog(true)}
              size="large"
            >
              Add First Patient
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={async () => {
                if (window.confirm('Generate demo data with 5 sample patients and assessments? This is great for testing and demos.')) {
                  try {
                    // Force EnhancedPatientService to use localStorage first
                    EnhancedPatientService.switchToLocalStorage();
                    // Generate the demo data
                    const result = DemoDataGenerator.generateDemoData();
                    console.log('Generated demo data:', result);
                    // Wait a moment for localStorage to be written
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Force reload from PatientService directly to bypass any caching
                    const directPatients = await EnhancedPatientService.getPatientsWithAssessments();
                    console.log('Direct load result:', directPatients.length, 'patients');
                    // Update state
                    setPatients(directPatients);
                    setLoading(false);
                    // Double-check after a brief delay
                    setTimeout(async () => {
                      const verifyPatients = await EnhancedPatientService.getPatientsWithAssessments();
                      if (verifyPatients.length > 0 && patients.length === 0) {
                        setPatients(verifyPatients);
                      }
                    }, 200);
                  } catch (error) {
                    console.error('Error generating demo data:', error);
                    alert('Error generating demo data. Please refresh the page.');
                  }
                }
              }}
              size="large"
              color="secondary"
            >
              Generate Demo Data
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard; 