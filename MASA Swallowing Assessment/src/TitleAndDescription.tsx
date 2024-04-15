import { Typography } from "@mui/material";

const TitleAndDescription: React.FC = () => {
  return (
    <>
      <Typography variant="h2" component="h2">
        MASA: The Mann Assessment of Swallowing Ability
      </Typography>
      <Typography fontSize="24px" marginTop={"2rem"} marginBottom={"3rem"}>
        The MASA score is measured using a 5-point to 10-point rating scale. The
        total score of the MASA is 200 points, and the cutoff value is 177
        points. The results of the MASA are interpreted as no abnormality
        (≥178), mild dysphagia (168–177), moderate dysphagia (139–167), and
        severe dysphagia (≤138).
      </Typography>
    </>
  );
};

export default TitleAndDescription;
