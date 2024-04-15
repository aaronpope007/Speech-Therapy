import React from "react";

import AssessmentCard from "./Assessment";
import TitleAndDescription from "../../TitleAndDescription";
import { Paper } from "@mui/material";

const MasaMain: React.FC = () => {
  return (
    <Paper sx={{ margin: "2rem", padding: "2rem" }}>
      <TitleAndDescription />
      <AssessmentCard />
    </Paper>
  );
};

export default MasaMain;
