import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

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
  id: string;
}

interface AssessmentListProps {
  onLoadAssessment: (assessment: AssessmentData) => void;
  onStartNew: () => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({
  onLoadAssessment,
  onStartNew,
}) => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<AssessmentData | null>(null);

  // Load all saved assessments from localStorage
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    const savedAssessments: AssessmentData[] = [];
    
    // Get all localStorage keys that start with 'masa-assessment'
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

    // Sort by saved date (newest first)
    savedAssessments.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
    setAssessments(savedAssessments);
  };

  const handleLoadAssessment = (assessment: AssessmentData) => {
    onLoadAssessment(assessment);
  };

  const handleViewAssessment = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
    setViewDialogOpen(true);
  };

  const handleDeleteAssessment = (assessment: AssessmentData) => {
    setAssessmentToDelete(assessment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assessmentToDelete) {
      localStorage.removeItem(assessmentToDelete.id);
      loadAssessments(); // Reload the list
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    }
  };

  const getScoringInterpretation = (score: number) => {
    if (score >= 178) {
      return { severity: "No abnormality", color: "success" as const };
    } else if (score >= 168) {
      return { severity: "Mild dysphagia", color: "warning" as const };
    } else if (score >= 139) {
      return { severity: "Moderate dysphagia", color: "warning" as const };
    } else {
      return { severity: "Severe dysphagia", color: "error" as const };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Saved Assessments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onStartNew}
          sx={{ minWidth: 120 }}
        >
          New Assessment
        </Button>
      </Box>

      {assessments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No saved assessments found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start a new assessment to begin evaluating swallowing function.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onStartNew}
            size="large"
          >
            Start New Assessment
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {assessments.map((assessment, index) => {
              const totalScore = Object.values(assessment.selectedGrades).reduce(
                (acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0
              );
              const interpretation = getScoringInterpretation(totalScore);
              const completedAreas = Object.values(assessment.selectedGrades).filter(
                (val) => val !== null
              ).length;

              return (
                <React.Fragment key={assessment.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" component="span">
                            {assessment.patientInfo.name || 'Unnamed Patient'}
                          </Typography>
                          <Chip
                            label={interpretation.severity}
                            color={interpretation.color}
                            size="small"
                          />
                          <Chip
                            label={`${totalScore}/200`}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Assessment Date:</strong> {assessment.patientInfo.assessmentDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Clinician:</strong> {assessment.patientInfo.clinician || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Areas Completed:</strong> {completedAreas}/24
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Saved:</strong> {formatDate(assessment.savedDate)}
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          aria-label="view"
                          onClick={() => handleViewAssessment(assessment)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="load"
                          onClick={() => handleLoadAssessment(assessment)}
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteAssessment(assessment)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < assessments.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}

      {/* View Assessment Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Assessment Details - {selectedAssessment?.patientInfo.name || 'Unnamed Patient'}
        </DialogTitle>
        <DialogContent>
          {selectedAssessment && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Patient Name:</strong> {selectedAssessment.patientInfo.name || 'Not specified'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date of Birth:</strong> {selectedAssessment.patientInfo.dateOfBirth || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assessment Date:</strong> {selectedAssessment.patientInfo.assessmentDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Clinician:</strong> {selectedAssessment.patientInfo.clinician || 'Not specified'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Assessment Scores
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {Object.entries(selectedAssessment.selectedGrades).map(([areaIdx, score]) => {
                  if (score !== null) {
                    return (
                      <Typography key={areaIdx} variant="body2" sx={{ mb: 1 }}>
                        Area {parseInt(areaIdx) + 1}: {score}/10
                      </Typography>
                    );
                  }
                  return null;
                })}
              </Box>

              {selectedAssessment.notes && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {selectedAssessment.notes}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              if (selectedAssessment) {
                handleLoadAssessment(selectedAssessment);
                setViewDialogOpen(false);
              }
            }}
            variant="contained"
            color="primary"
          >
            Load Assessment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Assessment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the assessment for{' '}
            <strong>{assessmentToDelete?.patientInfo.name || 'Unnamed Patient'}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentList; 