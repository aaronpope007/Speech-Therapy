import * as React from "react";
import Typography from "@mui/material/Typography";
import assessmentAreas from "../AssessmentAreas";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Box,
  Alert,
  Chip,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

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
}

interface AssessmentCardProps {
  selectedGrades: { [key: number]: number | null };
  setSelectedGrades: React.Dispatch<React.SetStateAction<{ [key: number]: number | null }>>;
  patientInfo: PatientInfo;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  selectedGrades,
  setSelectedGrades,
  patientInfo,
  setPatientInfo,
}) => {
  const [notes, setNotes] = React.useState<string>("");
  const [saveMessage, setSaveMessage] = React.useState<string>("");

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('masa-assessment');
    if (savedData) {
      try {
        const parsedData: AssessmentData = JSON.parse(savedData);
        setPatientInfo(parsedData.patientInfo);
        setSelectedGrades(parsedData.selectedGrades);
        setNotes(parsedData.notes || "");
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Handle selection from button or radio
  const handleSelect = (areaIdx: number, gradeValue: number) => {
    setSelectedGrades((prev) => ({ ...prev, [areaIdx]: gradeValue }));
  };

  // Calculate total score
  const totalScore = Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);

  // Get scoring interpretation
  const getScoringInterpretation = (score: number) => {
    if (score >= 178) {
      return { severity: "No abnormality", color: "success", description: "No abnormality detected" };
    } else if (score >= 168) {
      return { severity: "Mild dysphagia", color: "warning", description: "Mild dysphagia" };
    } else if (score >= 139) {
      return { severity: "Moderate dysphagia", color: "warning", description: "Moderate dysphagia" };
    } else {
      return { severity: "Severe dysphagia", color: "error", description: "Severe dysphagia" };
    }
  };

  // Get aspiration risk interpretation
  const getAspirationRisk = (score: number) => {
    if (score >= 170) {
      return { severity: "No aspiration risk", color: "success" };
    } else if (score >= 149) {
      return { severity: "Mild aspiration risk", color: "warning" };
    } else if (score >= 141) {
      return { severity: "Moderate aspiration risk", color: "warning" };
    } else {
      return { severity: "Severe aspiration risk", color: "error" };
    }
  };

  // Save assessment to localStorage
  const saveAssessment = () => {
    const assessmentData: AssessmentData = {
      patientInfo,
      selectedGrades,
      notes,
      savedDate: new Date().toISOString(),
    };
    
    localStorage.setItem('masa-assessment', JSON.stringify(assessmentData));
    setSaveMessage("Assessment saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // Clear assessment
  const clearAssessment = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setSelectedGrades({});
      setPatientInfo({
        name: "",
        dateOfBirth: "",
        assessmentDate: new Date().toISOString().split('T')[0],
        clinician: "",
      });
      setNotes("");
      localStorage.removeItem('masa-assessment');
      setSaveMessage("Assessment cleared!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const interpretation = getScoringInterpretation(totalScore);
  const aspirationRisk = getAspirationRisk(totalScore);

  return (
    <div>
      {/* Patient Information Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Patient Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient Name"
              value={patientInfo.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo((prev: PatientInfo) => ({ ...prev, name: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={patientInfo.dateOfBirth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo((prev: PatientInfo) => ({ ...prev, dateOfBirth: e.target.value }))}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Assessment Date"
              type="date"
              value={patientInfo.assessmentDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo((prev: PatientInfo) => ({ ...prev, assessmentDate: e.target.value }))}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Clinician"
              value={patientInfo.clinician}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientInfo((prev: PatientInfo) => ({ ...prev, clinician: e.target.value }))}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Save/Load Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={saveAssessment}
          color="primary"
        >
          Save Assessment
        </Button>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={clearAssessment}
          color="error"
        >
          Clear All
        </Button>
        {saveMessage && (
          <Alert severity="success" sx={{ py: 0 }}>
            {saveMessage}
          </Alert>
        )}
      </Box>

      {/* Scoring Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Assessment Results
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography variant="h4" color="primary">
              {totalScore}/200
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Score
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip
              label={interpretation.severity}
              color={interpretation.color as any}
              size="medium"
              sx={{ fontSize: '1rem', py: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Chip
              label={aspirationRisk.severity}
              color={aspirationRisk.color as any}
              variant="outlined"
              size="medium"
              sx={{ fontSize: '1rem', py: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Assessment Areas */}
      {assessmentAreas.map((area, areaIdx) => (
        <Accordion key={areaIdx} sx={{ minWidth: 275, margin: 2, padding: 2 }}>
          <AccordionSummary
            aria-controls={`panel${areaIdx}-content`}
            id={`panel${areaIdx}-header`}
            expandIcon={<ArrowDownwardIcon />}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {area.title}
                {selectedGrades[areaIdx] && (
                  <Chip
                    label={`Score: ${selectedGrades[areaIdx]}`}
                    size="small"
                    color="primary"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginLeft: "1.5rem" }}>
                {Object.values(area.grades)
                  .sort((a, b) => b.value - a.value)
                  .map((grade) => (
                    <div key={grade.value}>
                      {grade.shortText && (
                        <Button
                          variant={selectedGrades[areaIdx] === grade.value ? "contained" : "outlined"}
                          color="primary"
                          size="small"
                          sx={{ marginTop: "0.3rem", minWidth: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(areaIdx, grade.value);
                          }}
                        >
                          {grade.value}
                        </Button>
                      )}
                    </div>
                  ))}
              </Stack>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Description:
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
                {area.description}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Task:
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
                {area.task}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <FormControl required component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                Select Score:
              </FormLabel>
              <RadioGroup
                aria-label="grades"
                name={`grades-${areaIdx}`}
                value={selectedGrades[areaIdx] ?? ''}
                onChange={(e) => handleSelect(areaIdx, Number(e.target.value))}
              >
                {Object.values(area.grades)
                  .sort((a, b) => b.value - a.value)
                  .map((grade) => (
                    <FormControlLabel
                      key={grade.value}
                      value={grade.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {grade.value} points
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {grade.text}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 2, alignItems: 'flex-start' }}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Clinical Notes */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Clinical Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Additional observations and recommendations"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          placeholder="Enter any additional clinical observations, recommendations, or notes here..."
        />
      </Paper>
    </div>
  );
};

export default AssessmentCard;