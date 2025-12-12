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
  private model = 'models/gemini-2.5-flash'; // Latest stable model with generateContent support
  private baseUrl = `https://generativelanguage.googleapis.com/v1/${this.model}:generateContent`;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    if (!this.apiKey.trim()) {
      throw new Error('Gemini API key is empty. Please check your .env file and ensure VITE_GEMINI_API_KEY has a valid value.');
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
          maxOutputTokens: 16384, // Increased significantly to allow for thinking tokens + response
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
      let errorMessage = `Gemini API error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = `Gemini API error: ${errorData.error?.message || response.statusText}`;
        if (errorData.error?.status === 'INVALID_ARGUMENT') {
          errorMessage += ' (Check your API key and request format)';
        } else if (errorData.error?.status === 'PERMISSION_DENIED') {
          errorMessage += ' (API key may be invalid or expired)';
        } else if (errorData.error?.status === 'RESOURCE_EXHAUSTED') {
          errorMessage += ' (API quota exceeded)';
        }
      } catch (parseError) {
        // If we can't parse the error, use the status text
        const errorText = await response.text();
        errorMessage = `Gemini API error (${response.status}): ${errorText || response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    console.log('Full API response structure:', JSON.stringify(data, null, 2));
    
    // Check for blocked content
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.error('Content blocked by safety filters. Finish reason:', data.candidates[0].finishReason);
      throw new Error('Content was blocked by safety filters. Please adjust your request.');
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No response generated from Gemini API. Check your prompt and API configuration.');
    }
    
    const candidate = data.candidates[0];
    console.log('First candidate:', JSON.stringify(candidate, null, 2));
    
    // Check if response was truncated
    if (candidate?.finishReason === 'MAX_TOKENS') {
      console.warn('Response hit MAX_TOKENS limit. Attempting to extract partial response...');
    }
    
    // Try multiple paths to extract text (different API versions might have different structures)
    let text = '';
    
    // Standard path: candidate.content.parts[0].text
    if (candidate?.content?.parts && candidate.content.parts.length > 0) {
      for (const part of candidate.content.parts) {
        if (part.text) {
          text += part.text;
        }
      }
    }
    // Alternative path: candidate.text
    else if (candidate?.text) {
      text = candidate.text;
    }
    // Alternative path: candidate.output
    else if (candidate?.output) {
      text = candidate.output;
    }
    
    console.log('Extracted text length:', text.length);
    console.log('Extracted text (first 200 chars):', text.substring(0, 200));
    
    if (!text || text.trim().length === 0) {
      console.error('Empty text extracted. Full candidate structure:', candidate);
      console.error('Full response data:', JSON.stringify(data, null, 2));
      
      // If MAX_TOKENS was hit but no text, the response might be in a different format
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new Error('Response was truncated due to token limit, but no text content was found. The prompt may be too long or the response format is unexpected. Try reducing the assessment data or check the API response structure in the console.');
      }
      
      throw new Error('Empty response from Gemini API. The API returned a response but no text content was found. Check console for full response details.');
    }
    
    // Warn if response was truncated
    if (candidate?.finishReason === 'MAX_TOKENS') {
      console.warn('Note: Response was truncated due to MAX_TOKENS limit. Consider increasing maxOutputTokens or shortening the prompt.');
      text += '\n\n[Note: Response was truncated due to token limit]';
    }
    
    return text;
  }

  private formatAssessmentData(assessmentData: AssessmentData): string {
    const { patientInfo, selectedGrades, notes } = assessmentData;
    
    let formattedData = `MASA (Mann Assessment of Swallowing Ability) - Clinical Swallowing Assessment

PATIENT INFORMATION:
- Name: ${patientInfo.name}
- Date of Birth: ${patientInfo.dateOfBirth}
- Medical Record Number (MRN): ${patientInfo.mrn}
- Assessment Date: ${patientInfo.assessmentDate}
- Assessing Clinician: ${patientInfo.clinician}

ASSESSMENT FINDINGS BY AREA:
`;

    // Calculate total score
    const totalScore = Object.values(selectedGrades).reduce((acc, val) => (acc || 0) + (val || 0), 0);
    
    // Format each assessment area with full descriptive text
    assessmentAreas.forEach((area, index) => {
      const score = selectedGrades[index];
      if (score !== null && score !== undefined) {
        const gradeInfo = area.grades[score as keyof typeof area.grades];
        formattedData += `\n${index + 1}. ${area.title}\n`;
        formattedData += `   Area Description: ${area.description}\n`;
        if (area.task) {
          formattedData += `   Assessment Task: ${area.task}\n`;
        }
        formattedData += `   Score: ${score} points\n`;
        formattedData += `   Clinical Finding: ${gradeInfo?.text || 'Not specified'}\n`;
      }
    });

    formattedData += `\n\nTOTAL MASA SCORE: ${totalScore}/200\n`;

    // Make clinical notes very prominent
    if (notes && notes.trim()) {
      formattedData += `\n\n=== CLINICAL OBSERVATIONS AND NOTES ===\n`;
      formattedData += `${notes}\n`;
      formattedData += `=== END CLINICAL NOTES ===\n`;
    }

    return formattedData;
  }

  private generatePrompt(request: GeminiReportRequest): string {
    const { assessmentData, includeRecommendations = true, includeRiskFactors = true, tone = 'clinical' } = request;
    
    const formattedData = this.formatAssessmentData(assessmentData);
    
    let prompt = `You are a licensed, professional medical speech-language pathologist (SLP) with specialized expertise in dysphagia (swallowing disorders) assessment and treatment. You are writing a comprehensive clinical swallowing assessment report based on a MASA (Mann Assessment of Swallowing Ability) evaluation.

Your role is to:
1. Analyze all assessment findings and clinical observations
2. Synthesize the information into a professional clinical report
3. Provide evidence-based clinical impressions
4. Identify swallowing function, deficits, and safety concerns
5. Consider all clinical notes and observations provided

${formattedData}

MASA SCORING INTERPRETATION:
- 178-200: Normal swallowing function
- 168-177: Mild dysphagia
- 139-167: Moderate dysphagia
- 0-138: Severe dysphagia

IMPORTANT INSTRUCTIONS:
- Review ALL assessment area findings above, paying special attention to the "Clinical Finding" text for each area
- Carefully incorporate ALL clinical observations and notes provided in the "CLINICAL OBSERVATIONS AND NOTES" section
- Consider the functional implications of each finding (e.g., coughing during swallow indicates potential aspiration risk)
- Base your assessment on the descriptive findings, not just the numeric scores
- Write as a professional SLP documenting for medical records and clinical decision-making

REQUIRED OUTPUT FORMAT:
Please structure your response as a JSON object with the following fields:
{
  "clinicalImpression": "Comprehensive clinical impression that synthesizes all assessment findings, clinical observations, and notes. Address swallowing function across all phases (oral, pharyngeal, esophageal), identify specific deficits, discuss functional implications, and provide overall assessment of swallowing safety and efficiency. Incorporate specific findings from the clinical notes (e.g., trial results, observed behaviors).",
  "severityLevel": "normal|mild|moderate|severe",
  "confidenceScore": 0.95,
  "keyFindings": ["specific finding 1", "specific finding 2", "specific finding 3"],
  "areasOfConcern": ["concern 1 with context", "concern 2 with context"],
  "strengths": ["strength 1", "strength 2"]
}`;

    if (includeRecommendations) {
      prompt += `\n\nInclude evidence-based treatment recommendations and management strategies specific to the findings in this assessment. Consider diet modifications, compensatory strategies, therapeutic interventions, and follow-up recommendations.`;
    }

    if (includeRiskFactors) {
      prompt += `\n\nIdentify and discuss potential risk factors for aspiration, malnutrition, dehydration, or other complications based on the specific findings in this assessment.`;
    }

    prompt += `\n\nWRITING STYLE: Use professional ${tone} language appropriate for medical documentation. Be specific, evidence-based, and clinically relevant. Reference specific assessment findings and clinical observations. Focus on functional implications, patient safety, and clinical decision-making. Write as you would for a formal clinical report that will be part of the patient's medical record.`;

    return prompt;
  }

  async generateReport(request: GeminiReportRequest): Promise<GeminiReportResponse> {
    try {
      // Check API key first
      if (!this.apiKey || !this.apiKey.trim()) {
        throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables and restart the development server.');
      }

      console.log('Generating prompt...');
      const prompt = this.generatePrompt(request);
      console.log('Prompt length:', prompt.length);
      console.log('Calling makeRequest...');
      
      const response = await this.makeRequest(prompt);
      
      console.log('Raw Gemini API response length:', response?.length || 0);
      console.log('Raw Gemini API response (first 500 chars):', response?.substring(0, 500));
      
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from Gemini API. Please check your API key and try again.');
      }
      
      // Parse the JSON response
      let parsedResponse;
      try {
        // Remove markdown code blocks if present (```json ... ```)
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
        }
        
        // Extract JSON from the response (handle both raw JSON and markdown-wrapped)
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed JSON response:', parsedResponse);
        } else {
          console.warn('No JSON found in response, using raw text');
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.warn('JSON parsing failed, using raw response. Error:', parseError);
        console.warn('Response that failed to parse:', response.substring(0, 200));
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

      const clinicalImpression = parsedResponse.clinicalImpression || response || 'No clinical impression generated.';
      
      if (!clinicalImpression || clinicalImpression.trim().length === 0) {
        console.error('Clinical impression is empty after parsing');
        throw new Error('Generated report is empty. Please try again or check the console for details.');
      }

      const result = {
        clinicalImpression: clinicalImpression,
        severityLevel: (parsedResponse.severityLevel || 'moderate') as 'normal' | 'mild' | 'moderate' | 'severe',
        confidenceScore: parsedResponse.confidenceScore || 0.7,
        generatedAt: new Date().toISOString()
      };
      
      console.log('Final report result:', {
        ...result,
        clinicalImpressionLength: result.clinicalImpression.length
      });
      return result;
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

  // Public method for testing custom prompts (used by test component)
  async testCustomPrompt(prompt: string): Promise<string> {
    return await this.makeRequest(prompt);
  }

  // List available models and their supported methods
  async listModels(): Promise<void> {
    if (!this.apiKey) {
      console.error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${this.apiKey}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to list models:', errorData);
        return;
      }

      const data = await response.json();
      
      console.log('=== Available Gemini Models ===');
      console.log('Total models:', data.models?.length || 0);
      console.log('');
      
      if (data.models && data.models.length > 0) {
        interface GeminiModel {
          name?: string;
          displayName?: string;
          description?: string;
          supportedGenerationMethods?: string[];
          inputTokenLimit?: number;
          outputTokenLimit?: number;
          version?: string;
        }
        
        data.models.forEach((model: GeminiModel, index: number) => {
          console.log(`Model ${index + 1}:`);
          console.log('  Name:', model.name);
          console.log('  Display Name:', model.displayName || 'N/A');
          console.log('  Description:', model.description || 'N/A');
          console.log('  Supported Generation Methods:', model.supportedGenerationMethods || []);
          console.log('  Input Token Limit:', model.inputTokenLimit || 'N/A');
          console.log('  Output Token Limit:', model.outputTokenLimit || 'N/A');
          console.log('  Version:', model.version || 'N/A');
          console.log('');
        });
      } else {
        console.log('No models found in response');
      }
      
      console.log('=== Full API Response ===');
      console.log(JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('Error listing models:', error);
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;
