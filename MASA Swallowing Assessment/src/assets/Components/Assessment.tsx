import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import assessmentAreas from "../AssessmentAreas"; // Assuming AssessmentAreas.tsx is in the same directory

const Assessment: React.FC = () => {
  return (
    <div>
      {assessmentAreas.map((area, index) => (
        <div key={index}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{area.title}</FormLabel>
            <RadioGroup aria-label={area.title} name={area.title}>
              {Object.keys(area.grades).map((gradeKey) => (
                <FormControlLabel
                  key={gradeKey}
                  value={gradeKey}
                  control={<Radio />}
                  label={`Grade ${gradeKey}: ${
                    area.grades[gradeKey as keyof typeof area.grades]?.text
                  }`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      ))}
    </div>
  );
};

export default Assessment;
