import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import assessmentAreas from "../AssessmentAreas"; // Assuming AssessmentAreas.tsx is in the same directory

const AssessmentCard: React.FC = () => {
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
              <RadioGroup aria-label="grades" name="grades">
                {Object.keys(area.grades)
                  .reverse()
                  .map((gradeKey) => (
                    <FormControlLabel
                      key={gradeKey}
                      value={gradeKey}
                      control={<Radio />}
                      label={`${gradeKey}: ${
                        area.grades[gradeKey as keyof typeof area.grades]?.text
                      }`}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AssessmentCard;
