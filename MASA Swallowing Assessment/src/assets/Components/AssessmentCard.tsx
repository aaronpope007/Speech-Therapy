import * as React from "react";
import Typography from "@mui/material/Typography";
import assessmentAreas from "../AssessmentAreas";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonGroup,
  Stack,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const AssessmentCard: React.FC = () => {
  // State: { [areaIndex]: selectedGradeValue }
  const [selectedGrades, setSelectedGrades] = React.useState<{ [key: number]: number | null }>({});

  // Handle selection from button or radio
  const handleSelect = (areaIdx: number, gradeValue: number) => {
    setSelectedGrades((prev) => ({ ...prev, [areaIdx]: gradeValue }));
  };

  // Calculate total score
  const totalScore = Object.values(selectedGrades).reduce((acc: number, val) => acc + (typeof val === 'number' ? val : 0), 0);

  return (
    <div>
      {assessmentAreas.map((area, areaIdx) => (
        <Accordion key={areaIdx} sx={{ minWidth: 275, margin: 4, padding: 3 }}>
          <AccordionSummary
            aria-controls={`panel${areaIdx}-content`}
            id={`panel${areaIdx}-header`}
            expandIcon={<ArrowDownwardIcon />}
          >
            <Typography variant="h4">{area.title}</Typography>
            <Stack direction="row" spacing={1} sx={{ marginLeft: "1.5rem" }}>
              {Object.values(area.grades)
                .sort((a, b) => b.value - a.value)
                .map((grade) => (
                  <div key={grade.value}>
                    {grade.shortText && (
                      <ButtonGroup size="small">
                        <Button
                          variant={selectedGrades[areaIdx] === grade.value ? "contained" : "outlined"}
                          color="primary"
                          sx={{ marginTop: "0.3rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(areaIdx, grade.value);
                          }}
                        >
                          {grade.value}: {grade.shortText}
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                ))}
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="h5" sx={{ mb: 5 }} color="text.secondary">
              Description: {area.description}
            </Typography>
            <Typography variant="h5" sx={{ mb: 5 }} color="text.secondary">
              Task: {area.task}
            </Typography>
            <FormLabel component="legend">Scores</FormLabel>
            <FormControl required component="fieldset">
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
                      label={`${grade.value}: ${grade.text}`}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      ))}
      <Typography variant="h5" sx={{ mt: 4, textAlign: 'right' }}>
        Total Score: {totalScore}
      </Typography>
    </div>
  );
};

export default AssessmentCard;
