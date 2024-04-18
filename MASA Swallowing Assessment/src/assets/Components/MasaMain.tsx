import React from "react";

import AssessmentCard from "./AssessmentCard";
import TitleAndDescription from "../../TitleAndDescription";
import { Paper } from "@mui/material";
import ClinicalSummary from "./ClinicalSummary";

const MasaMain: React.FC = () => {
  return (
    <Paper sx={{ margin: "2rem", padding: "2rem" }}>
      {/* add stack of titl and description and side drawer for navigation */}
      <TitleAndDescription />
      <AssessmentCard />
      {/* clinical summary section will be used to auto generate text in a textfield that can be edited */}
      {/* note patient's level of physical activity */}
      <ClinicalSummary />
    </Paper>
  );
};

export default MasaMain;
