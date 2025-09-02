import { AssessmentData } from '../types/Patient';
import assessmentAreas from '../assets/AssessmentAreas';

export interface GeminiReportRequest {
  assessmentData: AssessmentData;
  includeRecommendations?: boolean;
  includeRiskFactors?: boolean;
  tone?: 'clinical' | 'patient-friendly' | 'technical';
}

export interface GeminiReportResponse {
  clinicalImpression: string;
  recommendations?: string;
  riskFactors?: string;
  severityLevel: 'normal' | 'mild' | 'moderate' | 'severe';
  confidenceScore: number;
  generatedAt: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async makeRequest(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  private formatAssessmentData(assessmentData: AssessmentData): string {
    const { patientInfo, selectedGrades, notes } = assessmentData;
    
    let formattedData = `PATIENT INFORMATION:
- Name: ${patientInfo.name}
- Date of Birth: ${patientInfo.dateOfBirth}
- MRN: ${patientInfo.mrn}
- Assessment Date: ${patientInfo.assessmentDate}
- Clinician: ${patientInfo.clinician}

ASSESSMENT RESULTS:\n`;

    // Calculate total score
    const totalScore = Object.values(selectedGrades).reduce((acc, val) => (acc || 0) + (val || 0), 0);
    formattedData += `- Total MASA Score: ${totalScore}/200\n\n`;

    // Format each assessment area
    assessmentAreas.forEach((area, index) => {
      const score = selectedGrades[index];
      if (score !== null && score !== undefined) {
        const gradeInfo = area.grades[score as keyof typeof area.grades];
        formattedData += `${index + 1}. ${area.title}: ${score} points\n`;
        formattedData += `   Description: ${area.description}\n`;
        formattedData += `   Assessment: ${gradeInfo?.text || 'Not specified'}\n\n`;
      }
    });

    if (notes) {
      formattedData += `CLINICIAN NOTES:\n${notes}\n\n`;
    }

    return formattedData;
  }

  private generatePrompt(request: GeminiReportRequest): string {
    const { assessmentData, includeRecommendations = true, includeRiskFactors = true, tone = 'clinical' } = request;
    
    const formattedData = this.formatAssessmentData(assessmentData);
    
    let prompt = `You are an expert speech-language pathologist specializing in dysphagia assessment and treatment. You are analyzing a MASA (Mann Assessment of Swallowing Ability) assessment report.

${formattedData}

Please provide a comprehensive clinical impression based on this MASA assessment data. The MASA is scored out of 200 points, with higher scores indicating better swallowing function.

SCORING INTERPRETATION:
- 178-200: Normal swallowing function
- 168-177: Mild dysphagia
- 139-167: Moderate dysphagia
- 0-138: Severe dysphagia

REQUIRED OUTPUT FORMAT:
Please structure your response as a JSON object with the following fields:
{
  "clinicalImpression": "Detailed clinical impression focusing on swallowing function, areas of concern, and overall assessment",
  "severityLevel": "normal|mild|moderate|severe",
  "confidenceScore": 0.95,
  "keyFindings": ["finding1", "finding2", "finding3"],
  "areasOfConcern": ["concern1", "concern2"],
  "strengths": ["strength1", "strength2"]
}`;

    if (includeRecommendations) {
      prompt += `\n\nAlso include evidence-based treatment recommendations and management strategies.`;
    }

    if (includeRiskFactors) {
      prompt += `\n\nIdentify potential risk factors for aspiration, malnutrition, or other complications.`;
    }

    prompt += `\n\nTONE REQUIREMENTS: Use ${tone} language appropriate for healthcare professionals. Be specific, evidence-based, and clinically relevant. Focus on functional implications and patient safety.`;

    return prompt;
  }

  async generateReport(request: GeminiReportRequest): Promise<GeminiReportResponse> {
    try {
      const prompt = this.generatePrompt(request);
      const response = await this.makeRequest(prompt);
      
      // Parse the JSON response
      let parsedResponse;
      try {
        // Extract JSON from the response (Gemini might wrap it in markdown)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        parsedResponse = {
          clinicalImpression: response,
          severityLevel: 'moderate',
          confidenceScore: 0.7,
          keyFindings: [],
          areasOfConcern: [],
          strengths: []
        };
      }

      return {
        clinicalImpression: parsedResponse.clinicalImpression || response,
        severityLevel: parsedResponse.severityLevel || 'moderate',
        confidenceScore: parsedResponse.confidenceScore || 0.7,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating Gemini report:', error);
      throw new Error(`Failed to generate clinical report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateSimpleReport(assessmentData: AssessmentData): Promise<string> {
    try {
      const formattedData = this.formatAssessmentData(assessmentData);
      
      const prompt = `You are a speech-language pathologist. Based on this MASA assessment, provide a brief clinical impression (2-3 paragraphs) focusing on the patient's swallowing function and any concerns:

${formattedData}

Provide a clear, concise clinical impression suitable for medical documentation.`;

      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      console.error('Error generating simple report:', error);
      throw new Error(`Failed to generate simple report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Test the API connection
  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Please respond with "API connection successful" if you can read this message.';
      const response = await this.makeRequest(testPrompt);
      return response.includes('successful') || response.length > 0;
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;
