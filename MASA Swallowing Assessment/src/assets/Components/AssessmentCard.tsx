import * as React from "react";
import { useForm } from "react-hook-form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import assessmentAreas from "../AssessmentAreas"; // Assuming AssessmentAreas.tsx is in the same directory

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
      {assessmentAreas.map((area, index) => (
        <Card
          key={index}
          elevation={10}
          sx={{ minWidth: 275, margin: 4, padding: 3 }}
        >
          <CardContent>
            <Typography variant="h2" color="text.secondary" gutterBottom>
              {area.title}
            </Typography>

            <Typography variant="h5" sx={{ mb: 5 }} color="text.secondary">
              {area.description}
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
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" onClick={calculateTotal}>
        Calculate Total
      </Button>
    </div>
  );
};

export default AssessmentCard;
