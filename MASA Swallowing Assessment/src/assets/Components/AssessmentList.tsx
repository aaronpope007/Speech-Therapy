import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
} from "@mui/icons-material";
import { EnhancedPatientService } from "../../services/EnhancedPatientService";
import { AssessmentData } from "../../types/Patient";



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
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string>("");

  // Load all saved assessments from localStorage
  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const savedAssessments = await EnhancedPatientService.getAllAssessments();
      setAssessments(savedAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
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

  const confirmDelete = async () => {
    if (assessmentToDelete) {
      try {
        await EnhancedPatientService.deleteAssessment(assessmentToDelete.id);
        loadAssessments(); // Reload the list
        setDeleteDialogOpen(false);
        setAssessmentToDelete(null);
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const handleExportAssessment = (assessment: AssessmentData) => {
    const dataStr = JSON.stringify(assessment, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `masa-assessment-${assessment.patientInfo.name || 'unnamed'}-${assessment.patientInfo.assessmentDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(assessments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `masa-assessments-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportAssessments = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate imported data structure
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid file format: Expected array of assessments');
        }

        // Validate each assessment has required fields
        const validAssessments = importedData.filter((assessment: AssessmentData) => {
          return assessment.patientInfo && assessment.selectedGrades && assessment.savedDate;
        });

        if (validAssessments.length === 0) {
          throw new Error('No valid assessments found in file');
        }

        // Import assessments with new IDs
        for (const assessment of validAssessments) {
          const assessmentToSave = {
            ...assessment,
            savedDate: new Date().toISOString(),
          };
          await EnhancedPatientService.createAssessment(assessmentToSave);
        }

        loadAssessments();
        setImportDialogOpen(false);
        setImportError("");
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to import assessments');
      }
    };
    reader.readAsText(file);
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {assessments.length > 0 && (
            <>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={handleExportAll}
                size="small"
              >
                Export All
              </Button>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                onClick={() => setImportDialogOpen(true)}
                size="small"
              >
                Import
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={onStartNew}
            sx={{ minWidth: 120 }}
          >
            New Assessment
          </Button>
        </Box>
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
                          <IconButton
                            edge="start"
                            aria-label="view"
                            onClick={() => handleViewAssessment(assessment)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <ViewIcon />
                          </IconButton>
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
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <IconButton
                                edge="end"
                                aria-label="load"
                                onClick={() => handleLoadAssessment(assessment)}
                                color="primary"
                                size="small"
                              >
                                <DownloadIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="export"
                                onClick={() => handleExportAssessment(assessment)}
                                color="secondary"
                                size="small"
                              >
                                <ExportIcon />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteAssessment(assessment)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
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

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <DialogTitle>Import Assessments</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a JSON file containing MASA assessments to import.
          </Typography>
          {importError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {importError}
            </Alert>
          )}
          <input
            accept=".json"
            style={{ display: 'none' }}
            id="import-file"
            type="file"
            onChange={handleImportAssessments}
          />
          <label htmlFor="import-file">
            <Button variant="contained" component="span">
              Choose File
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentList; 