import { Typography } from "@mui/material";

const ClinicalSummary: React.FC = () => {
  return (
    <>
      <Typography variant="h2" component="h2" sx={{ mt: "2rem" }}>
        This is the clinical summary holder
      </Typography>
      <Typography fontSize="24px" marginTop={"2rem"} marginBottom={"3rem"}>
        This will be a text field populated and editable with clinical results
      </Typography>
    </>
  );
};

export default ClinicalSummary;
