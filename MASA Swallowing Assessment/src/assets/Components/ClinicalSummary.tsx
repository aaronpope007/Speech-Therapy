import { Typography, Paper, Box, Alert } from "@mui/material";
import React from "react";

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
  // Generate recommendations based on score
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (totalScore >= 178) {
      recommendations.push("No abnormality detected. Normal diet may be appropriate.");
      recommendations.push("Continue regular monitoring as appropriate for patient condition.");
    } else if (totalScore >= 168) {
      recommendations.push("Mild dysphagia identified. Consider texture modifications or compensatory strategies.");
      recommendations.push("Regular monitoring recommended. Follow-up assessment in 2-4 weeks.");
      recommendations.push("Consider consultation with speech-language pathologist if not already involved.");
    } else if (totalScore >= 139) {
      recommendations.push("Moderate dysphagia identified. Modified diet textures recommended.");
      recommendations.push("Speech-language pathology consultation strongly recommended.");
      recommendations.push("Consider instrumental assessment (VFSS/FEES) if available.");
      recommendations.push("Implement compensatory strategies and monitor closely.");
    } else {
      recommendations.push("Severe dysphagia identified. Immediate intervention required.");
      recommendations.push("Consider NPO status pending further evaluation.");
      recommendations.push("Urgent speech-language pathology consultation required.");
      recommendations.push("Instrumental swallowing assessment (VFSS/FEES) strongly recommended.");
      recommendations.push("Consider alternative feeding methods if oral feeding is unsafe.");
    }

    // Add specific recommendations based on low-scoring areas
    Object.entries(selectedGrades).forEach(([areaIdx, score]) => {
      const idx = parseInt(areaIdx);
      if (score !== null && score <= 3) {
        switch (idx) {
          case 0: // Alertness
            recommendations.push("Low alertness noted - ensure patient is alert before feeding.");
            break;
          case 4: // Respiratory Rate for Swallow
            recommendations.push("Respiratory-swallow coordination concerns - monitor breathing patterns during meals.");
            break;
          case 8: // Saliva
            recommendations.push("Saliva management issues noted - consider oral care protocol.");
            break;
          case 14: // Gag
            recommendations.push("Reduced/absent gag reflex - use caution with oral care and feeding.");
            break;
          case 19: // Cough Reflex
          case 20: // Voluntary Cough
            recommendations.push("Compromised cough - high aspiration risk, consider thickened liquids.");
            break;
          case 22: // Trache
            if (score === 1) {
              recommendations.push("Cuffed tracheostomy present - coordinate with respiratory team for cuff management during meals.");
            }
            break;
        }
      }
    });

    return recommendations;
  };

  const getDietRecommendations = () => {
    if (totalScore >= 178) {
      return "Regular diet with normal fluids";
    } else if (totalScore >= 168) {
      return "Soft diet with possible fluid modifications";
    } else if (totalScore >= 139) {
      return "Modified textures - pureed/minced with thickened fluids";
    } else {
      return "NPO pending further assessment";
    }
  };

  const recommendations = generateRecommendations();

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Clinical Summary & Recommendations
      </Typography>
      
      {totalScore > 0 && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity={totalScore >= 168 ? "success" : totalScore >= 139 ? "warning" : "error"}
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              MASA Total Score: {totalScore}/200
            </Typography>
            <Typography variant="body2">
              {totalScore >= 178 ? "No abnormality detected" : 
               totalScore >= 168 ? "Mild dysphagia" :
               totalScore >= 139 ? "Moderate dysphagia" : "Severe dysphagia"}
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Diet Recommendations:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            {getDietRecommendations()}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Clinical Recommendations:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {recommendations.map((rec, index) => (
              <Typography component="li" key={index} variant="body2" sx={{ mb: 1 }}>
                {rec}
              </Typography>
            ))}
          </Box>

          {patientInfo.name && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Assessment completed for: <strong>{patientInfo.name}</strong><br />
                Date: {patientInfo.assessmentDate}<br />
                Clinician: {patientInfo.clinician || 'Not specified'}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {totalScore === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Complete the assessment to generate clinical summary and recommendations.
        </Typography>
      )}
    </Paper>
  );
};

export default ClinicalSummary;
