import * as React from "react";
import { useForm } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import assessmentAreas from "../AssessmentAreas"; // Assuming AssessmentAreas.tsx is in the same directory
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonGroup,
  Stack,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const AssessmentCard: React.FC = () => {
  const { register, watch } = useForm();

  // Watch for changes in the form values
  const formValues = watch();

  // Log the selected value of the radio buttons
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  // Log form values whenever they change
  React.useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  // Function to calculate the total value of selected radio buttons
  const calculateTotal = () => {
    let total = 0;
    Object.keys(formValues.grades).forEach((key) => {
      if (formValues.grades[key]) {
        total += parseInt(key);
      }
    });
    console.log("Total value:", total);
  };

  return (
    <div>
      {assessmentAreas.map((area) => (
        <Accordion sx={{ minWidth: 275, margin: 4, padding: 3 }}>
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            expandIcon={<ArrowDownwardIcon />}
          >
            <Typography variant="h4">{area.title}</Typography>

            <Stack direction="row" spacing={1} sx={{ marginLeft: "3rem" }}>
              {Object.values(area.grades)
                .reverse()
                .map((grade) => (
                  <div key={grade.value}>
                    {grade.shortText && (
                      <ButtonGroup size="small">
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ marginTop: "0.3rem" }}
                          onClick={(e) => e?.stopPropagation()}
                        >
                          {grade.shortText}
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                ))}
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Typography
              variant="h2"
              color="text.secondary"
              gutterBottom
            ></Typography>

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
                name="grades"
                onChange={handleRadioChange} // Add onChange event handler to capture selected value
              >
                {Object.keys(area.grades)
                  .reverse()
                  .map((gradeKey) => (
                    <FormControlLabel
                      key={gradeKey}
                      value={gradeKey}
                      control={<Radio />}
                      label={`${gradeKey}: ${
                        area.grades[
                          gradeKey as unknown as keyof typeof area.grades
                        ]?.text
                      }`}
                      // Register each radio button with useForm
                      {...register(`grades.${gradeKey}`)}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button variant="contained" onClick={calculateTotal}>
        Calculate Total
      </Button>
    </div>
  );
};

export default AssessmentCard;
