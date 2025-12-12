import { Typography, Paper, Box, Alert, Button, Divider, Chip } from "@mui/material";
import { PictureAsPdf as PdfIcon, Lightbulb as LightbulbIcon } from "@mui/icons-material";
import React, { useRef, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import assessmentAreas from "../AssessmentAreas";

interface ClinicalSummaryProps {
  totalScore: number;
  selectedGrades: { [key: number]: number | null };
  patientInfo: {
    name: string;
    dateOfBirth: string;
    assessmentDate: string;
    clinician: string;
  };
}

const ClinicalSummary: React.FC<ClinicalSummaryProps> = ({ 
  totalScore, 
  selectedGrades, 
  patientInfo 
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  // Get severity level
  const severityLevel = useMemo(() => {
    if (totalScore >= 178) return { level: "No abnormality detected", severity: "normal", color: "success" as const };
    if (totalScore >= 168) return { level: "Mild dysphagia", severity: "mild", color: "warning" as const };
    if (totalScore >= 139) return { level: "Moderate dysphagia", severity: "moderate", color: "warning" as const };
    return { level: "Severe dysphagia", severity: "severe", color: "error" as const };
  }, [totalScore]);

  // Identify areas of concern (low scores)
  const areasOfConcern = useMemo(() => {
    const concerns: Array<{ area: string; score: number; maxScore: number; description: string }> = [];
    
    Object.entries(selectedGrades).forEach(([areaIdx, score]) => {
      if (score !== null) {
        const idx = parseInt(areaIdx);
        const area = assessmentAreas[idx];
        if (area) {
          const maxScore = Math.max(...Object.keys(area.grades).map(k => parseInt(k)));
          // Consider it a concern if score is less than 70% of max or <= 3 for any area
          if (score < maxScore * 0.7 || score <= 3) {
            concerns.push({
              area: area.title,
              score,
              maxScore,
              description: area.description
            });
          }
        }
      }
    });
    
    return concerns.sort((a, b) => a.score - b.score); // Sort by lowest scores first
  }, [selectedGrades]);

  // Get completed areas count
  const completedAreas = useMemo(() => {
    return Object.values(selectedGrades).filter(score => score !== null).length;
  }, [selectedGrades]);

  const generatePDF = async () => {
    if (!summaryRef.current) return;

    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `masa-report-${patientInfo.name || 'patient'}-${patientInfo.assessmentDate}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon color="primary" />
          <Typography variant="h5">
            Report Writing Guide & Key Findings
          </Typography>
        </Box>
        {totalScore > 0 && (
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={generatePDF}
            size="small"
          >
            Export PDF
          </Button>
        )}
      </Box>
      
      <Box ref={summaryRef}>
        {totalScore > 0 ? (
          <Box>
            {/* Key Findings Summary */}
            <Alert 
              severity={severityLevel.color}
              sx={{ mb: 3 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                MASA Assessment Results
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Total Score:</strong> {totalScore}/200
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Severity Level:</strong> {severityLevel.level}
              </Typography>
              <Typography variant="body2">
                <strong>Areas Completed:</strong> {completedAreas}/24
              </Typography>
            </Alert>

            {/* Areas of Concern */}
            {areasOfConcern.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  Areas of Concern (Low Scores)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  The following areas showed scores below expected levels and should be addressed in your report:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {areasOfConcern.map((concern, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {concern.area}
                        </Typography>
                        <Chip 
                          label={`${concern.score}/${concern.maxScore}`}
                          color="error"
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {concern.description}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Report Writing Template */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Report Writing Template & Prompts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
              Use the following sections as a guide to structure your clinical report. Expand on each section with specific findings from this assessment.
            </Typography>

            {/* Section 1: Background/Referral */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                1. Background/Referral Information
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Patient demographics: {patientInfo.name ? `${patientInfo.name}, DOB: ${patientInfo.dateOfBirth}` : 'Include patient name, DOB, MRN'}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Referral source and reason for assessment
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Medical history relevant to swallowing function
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Assessment date: {patientInfo.assessmentDate}
                </Typography>
                <Typography component="li" variant="body2">
                  Clinician: {patientInfo.clinician || 'Include your name/credentials'}
                </Typography>
              </Box>
            </Paper>

            {/* Section 2: Assessment Results */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                2. Assessment Results
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  <strong>MASA Total Score: {totalScore}/200</strong> - {severityLevel.level}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Number of areas assessed: {completedAreas}/24
                </Typography>
                {areasOfConcern.length > 0 && (
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Areas of concern:</strong> {areasOfConcern.map(c => c.area).join(', ')}
                  </Typography>
                )}
                <Typography component="li" variant="body2">
                  Describe the assessment process and tools used (MASA)
                </Typography>
              </Box>
            </Paper>

            {/* Section 3: Clinical Findings */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                3. Clinical Findings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                Address each of these areas in your findings section:
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
                {areasOfConcern.length > 0 ? (
                  <>
                    <Typography component="li" variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                      Areas requiring attention:
                    </Typography>
                    {areasOfConcern.map((concern, idx) => (
                      <Typography key={idx} component="li" variant="body2" sx={{ mb: 0.5, pl: 2 }}>
                        • <strong>{concern.area}</strong> (Score: {concern.score}/{concern.maxScore}) - Describe observed deficits, impact on swallowing safety, and clinical implications
                      </Typography>
                    ))}
                  </>
                ) : (
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Overall performance across all 24 assessment areas
                  </Typography>
                )}
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Cognitive/alertness status and its impact on assessment
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Respiratory status and coordination with swallowing
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Oral motor function and pharyngeal responses
                </Typography>
                <Typography component="li" variant="body2">
                  Protective mechanisms (cough, gag reflexes)
                </Typography>
              </Box>
            </Paper>

            {/* Section 4: Clinical Interpretation */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                4. Clinical Interpretation
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Interpretation of the {totalScore}/200 score within the context of dysphagia severity levels
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Risk level for aspiration or other complications
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Impact of identified deficits on functional swallowing
                </Typography>
                <Typography component="li" variant="body2">
                  Overall swallowing safety and efficiency
                </Typography>
              </Box>
            </Paper>

            {/* Section 5: Recommendations */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                5. Recommendations & Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                Based on the assessment findings, consider including:
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>
                {totalScore < 178 && (
                  <>
                    <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Diet modifications:</strong> Consider texture/consistency recommendations based on severity level
                      {totalScore >= 168 && " (may include soft textures, thickened liquids)"}
                      {totalScore >= 139 && totalScore < 168 && " (modified textures, pureed/minced foods, thickened liquids recommended)"}
                      {totalScore < 139 && " (NPO or very restricted diet may be indicated pending further assessment)"}
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Compensatory strategies:</strong> Positioning, pacing, bolus modifications, etc.
                    </Typography>
                  </>
                )}
                {areasOfConcern.length > 0 && (
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Targeted interventions:</strong> Address specific areas of concern identified in the assessment
                  </Typography>
                )}
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Follow-up:</strong> Recommend timing and type of reassessment or monitoring
                </Typography>
                {totalScore < 139 && (
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Instrumental assessment:</strong> Consider VFSS or FEES for detailed pharyngeal function evaluation
                  </Typography>
                )}
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Interdisciplinary collaboration:</strong> Coordinate with medical team, nutrition, respiratory therapy as needed
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Patient/family education:</strong> Include safety strategies and signs/symptoms to monitor
                </Typography>
              </Box>
            </Paper>

            {/* Additional Notes Section */}
            {patientInfo.clinician && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Assessment Details:</strong><br />
                  Patient: {patientInfo.name}<br />
                  Assessment Date: {patientInfo.assessmentDate}<br />
                  Clinician: {patientInfo.clinician}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Complete the assessment to view report writing guide and key findings.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ClinicalSummary;
