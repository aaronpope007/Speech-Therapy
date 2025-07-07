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
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

// Memoized Patient Information Section
const PatientInfoSection = React.memo<{
  patientInfo: PatientInfo;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
}>(({ patientInfo, setPatientInfo }) => {
  const handlePatientInfoChange = React.useCallback((field: keyof PatientInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPatientInfo((prev) => ({ ...prev, [field]: e.target.value }));
  }, [setPatientInfo]);

  return (
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
            onChange={handlePatientInfoChange('name')}
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
            onChange={handlePatientInfoChange('dateOfBirth')}
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
            onChange={handlePatientInfoChange('assessmentDate')}
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
            onChange={handlePatientInfoChange('clinician')}
            variant="outlined"
            size="small"
          />
        </Grid>
      </Grid>
    </Paper>
  );
});

// Memoized Scoring Summary Section
const ScoringSummary = React.memo<{
  totalScore: number;
  interpretation: { severity: string; color: string };
  aspirationRisk: { severity: string; color: string };
}>(({ totalScore, interpretation, aspirationRisk }) => (
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
          color={interpretation.color as "success" | "warning" | "error"}
          size="medium"
          sx={{ fontSize: '1rem', py: 2 }}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <Chip
          label={aspirationRisk.severity}
          color={aspirationRisk.color as "success" | "warning" | "error"}
          variant="outlined"
          size="medium"
          sx={{ fontSize: '1rem', py: 2 }}
        />
      </Grid>
    </Grid>
  </Paper>
));

interface Grade {
  value: number;
  text: string;
  shortText?: string;
}

interface AssessmentAreaData {
  title: string;
  description: string;
  task: string;
  grades: Record<number, Grade>;
}

// Memoized Assessment Area Component
const AssessmentArea = React.memo<{
  area: AssessmentAreaData;
  areaIdx: number;
  selectedGrades: { [key: number]: number | null };
  onSelect: (areaIdx: number, gradeValue: number) => void;
}>(({ area, areaIdx, selectedGrades, onSelect }) => {
  const handleSelect = React.useCallback((gradeValue: number) => {
    onSelect(areaIdx, gradeValue);
  }, [areaIdx, onSelect]);

  const handleButtonClick = React.useCallback((e: React.MouseEvent, gradeValue: number) => {
    e.stopPropagation();
    handleSelect(gradeValue);
  }, [handleSelect]);

  return (
    <Accordion sx={{ minWidth: 275, margin: 2, padding: 2 }}>
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
                  .sort((a: Grade, b: Grade) => b.value - a.value)
                  .map((grade: Grade) => (
                    <div key={grade.value}>
                      {grade.shortText && (
                        <Button
                          variant={selectedGrades[areaIdx] === grade.value ? "contained" : "outlined"}
                          color="primary"
                          size="small"
                          sx={{ marginTop: "0.3rem", minWidth: 'auto' }}
                          onClick={(e) => handleButtonClick(e, grade.value)}
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
                onChange={(e) => handleSelect(Number(e.target.value))}
              >
                {Object.values(area.grades)
                  .sort((a: Grade, b: Grade) => b.value - a.value)
                  .map((grade: Grade) => (
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
  );
});

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  selectedGrades,
  setSelectedGrades,
  patientInfo,
  setPatientInfo,
  notes,
  setNotes,
}) => {
  const [saveMessage, setSaveMessage] = React.useState<string>("");

  // Memoized calculations
  const totalScore = React.useMemo(() => 
    Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0),
    [selectedGrades]
  );

  const interpretation = React.useMemo(() => {
    if (totalScore >= 178) {
      return { severity: "No abnormality", color: "success", description: "No abnormality detected" };
    } else if (totalScore >= 168) {
      return { severity: "Mild dysphagia", color: "warning", description: "Mild dysphagia" };
    } else if (totalScore >= 139) {
      return { severity: "Moderate dysphagia", color: "warning", description: "Moderate dysphagia" };
    } else {
      return { severity: "Severe dysphagia", color: "error", description: "Severe dysphagia" };
    }
  }, [totalScore]);

  const aspirationRisk = React.useMemo(() => {
    if (totalScore >= 170) {
      return { severity: "No aspiration risk", color: "success" };
    } else if (totalScore >= 149) {
      return { severity: "Mild aspiration risk", color: "warning" };
    } else if (totalScore >= 141) {
      return { severity: "Moderate aspiration risk", color: "warning" };
    } else {
      return { severity: "Severe aspiration risk", color: "error" };
    }
  }, [totalScore]);

  // Memoized handlers
  const handleSelect = React.useCallback((areaIdx: number, gradeValue: number) => {
    setSelectedGrades((prev) => ({ ...prev, [areaIdx]: gradeValue }));
  }, [setSelectedGrades]);

  const saveAssessment = React.useCallback(() => {
    const assessmentId = `masa-assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const assessmentData: AssessmentData = {
      patientInfo,
      selectedGrades,
      notes,
      savedDate: new Date().toISOString(),
    };
    
    localStorage.setItem(assessmentId, JSON.stringify(assessmentData));
    setSaveMessage("Assessment saved successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  }, [patientInfo, selectedGrades, notes]);

  const clearAssessment = React.useCallback(() => {
    if (window.confirm("Are you sure you want to start a new assessment? All current data will be cleared.")) {
      setSelectedGrades({});
      setPatientInfo({
        name: "",
        dateOfBirth: "",
        assessmentDate: new Date().toISOString().split('T')[0],
        clinician: "",
      });
      setNotes("");
      setSaveMessage("New assessment started!");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  }, [setSelectedGrades, setPatientInfo, setNotes]);

  const handleNotesChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  }, [setNotes]);

  return (
    <div>
      <PatientInfoSection 
        patientInfo={patientInfo} 
        setPatientInfo={setPatientInfo} 
      />

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

      <ScoringSummary 
        totalScore={totalScore}
        interpretation={interpretation}
        aspirationRisk={aspirationRisk}
      />

      {/* Assessment Areas */}
      {assessmentAreas.map((area, areaIdx) => (
        <AssessmentArea
          key={areaIdx}
          area={area as AssessmentAreaData}
          areaIdx={areaIdx}
          selectedGrades={selectedGrades}
          onSelect={handleSelect}
        />
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
          onChange={handleNotesChange}
          variant="outlined"
          placeholder="Enter any additional clinical observations, recommendations, or notes here..."
        />
      </Paper>
    </div>
  );
};

export default React.memo(AssessmentCard);