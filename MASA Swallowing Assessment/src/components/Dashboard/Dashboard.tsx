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
} from '@mui/icons-material';
import { PatientService } from '../../services/PatientService';
import { PatientWithAssessments, AssessmentData } from '../../types/Patient';

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
  const [newPatientDialog, setNewPatientDialog] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    dateOfBirth: '',
    mrn: '',
  });
  const [viewMode, setViewMode] = useState<'all' | 'patients'>('all');

  useEffect(() => {
    loadPatients();
    // Migrate existing data on first load
    PatientService.migrateExistingAssessments();
  }, []);

  const loadPatients = () => {
    const patientsWithAssessments = PatientService.getPatientsWithAssessments();
    setPatients(patientsWithAssessments);
  };

  const handleCreatePatient = () => {
    if (newPatientData.name && newPatientData.dateOfBirth) {
      PatientService.createPatient(newPatientData);
      setNewPatientData({ name: '', dateOfBirth: '', mrn: '' });
      setNewPatientDialog(false);
      loadPatients();
    }
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient and all their assessments?')) {
      PatientService.deletePatient(patientId);
      loadPatients();
    }
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      PatientService.deleteAssessment(assessmentId);
      loadPatients();
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

  const totalAssessments = patients.reduce((sum, patient) => sum + patient.totalAssessments, 0);
  const totalPatients = patients.length;

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
                {patients.filter(p => p.averageScore && p.averageScore >= 178).length}
              </Typography>
              <Typography variant="body2">Normal Results</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">
                {patients.filter(p => p.averageScore && p.averageScore < 178).length}
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
        <Grid container spacing={3}>
          {patients.flatMap(patient => 
            patient.assessments.map(assessment => (
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
            ))
          )}
        </Grid>
      ) : (
        // By Patient View
        <Grid container spacing={3}>
          {patients.map(patient => (
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

                  {patient.latestAssessment && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Latest Assessment:
                      </Typography>
                      {(() => {
                        const score = Object.values(patient.latestAssessment.selectedGrades).reduce((acc: number, val) => 
                          acc + (typeof val === 'number' ? val : 0), 0);
                        const interpretation = getScoringInterpretation(score);
                        return (
                          <Chip 
                            label={interpretation.severity} 
                            color={interpretation.color} 
                            size="small"
                          />
                        );
                      })()}
                    </Box>
                  )}

                  {patient.assessments.length > 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {patient.assessments.length} assessments over time
                      </Typography>
                    </Box>
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
          ))}
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

      {/* Empty State */}
      {patients.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No patients found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first patient to start creating assessments and tracking progress over time.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewPatientDialog(true)}
            size="large"
          >
            Add First Patient
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard; 