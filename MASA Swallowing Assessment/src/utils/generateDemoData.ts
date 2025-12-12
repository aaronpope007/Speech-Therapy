import { PatientService } from '../services/PatientService';
import { Patient, AssessmentData } from '../types/Patient';

/**
 * Generate demo patient data for testing/demo purposes
 * This is useful when Firebase isn't set up and you want to showcase the app
 */
export class DemoDataGenerator {
  private static readonly DEMO_PATIENTS = [
    { name: 'John Smith', dateOfBirth: '1985-03-15', mrn: 'MRN-001' },
    { name: 'Sarah Johnson', dateOfBirth: '1978-07-22', mrn: 'MRN-002' },
    { name: 'Michael Brown', dateOfBirth: '1992-11-08', mrn: 'MRN-003' },
    { name: 'Emily Davis', dateOfBirth: '1989-05-30', mrn: 'MRN-004' },
    { name: 'Robert Wilson', dateOfBirth: '1975-12-14', mrn: 'MRN-005' },
  ];

  /**
   * Generate demo patients with sample assessments
   */
  static generateDemoData(): { patients: Patient[]; assessments: AssessmentData[] } {
    const patients: Patient[] = [];
    const assessments: AssessmentData[] = [];

    // Generate patients
    this.DEMO_PATIENTS.forEach((patientData, index) => {
      const patient = PatientService.createPatient(patientData);
      patients.push(patient);

      // Generate 1-3 assessments per patient with varying scores
      const numAssessments = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numAssessments; i++) {
        const assessmentDate = new Date();
        assessmentDate.setDate(assessmentDate.getDate() - (index * 30 + i * 10));
        
        // Generate realistic scores (150-200 range for demo)
        const baseScore = 150 + Math.floor(Math.random() * 50);
        const selectedGrades: { [key: number]: number | null } = {};
        
        // Generate grades for all 24 MASA areas
        let currentScore = 0;
        for (let area = 1; area <= 24; area++) {
          const remainingAreas = 24 - area;
          const remainingPoints = baseScore - currentScore;
          const maxForThisArea = Math.min(10, remainingPoints - remainingAreas);
          const minForThisArea = Math.max(0, remainingPoints - (remainingAreas * 10));
          
          const grade = Math.floor(Math.random() * (maxForThisArea - minForThisArea + 1)) + minForThisArea;
          selectedGrades[area] = grade;
          currentScore += grade;
        }

        const assessment: Omit<AssessmentData, 'id'> = {
          patientId: patient.id,
          patientInfo: {
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            mrn: patient.mrn,
            assessmentDate: assessmentDate.toISOString().split('T')[0],
            clinician: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
          },
          selectedGrades,
          notes: `Assessment ${i + 1} for ${patient.name}. Patient demonstrates ${baseScore >= 178 ? 'normal' : baseScore >= 168 ? 'mild' : baseScore >= 139 ? 'moderate' : 'severe'} swallowing function.`,
          savedDate: assessmentDate.toISOString(),
        };

        const createdAssessment = PatientService.createAssessment(assessment);
        assessments.push(createdAssessment);
      }
    });

    return { patients, assessments };
  }

  /**
   * Clear all demo data (useful for resetting)
   */
  static clearAllData(): void {
    // Get all patients and assessments
    const patients = PatientService.getAllPatients();
    const assessments = PatientService.getAllAssessments();

    // Delete all assessments
    assessments.forEach(assessment => {
      PatientService.deleteAssessment(assessment.id);
    });

    // Delete all patients
    patients.forEach(patient => {
      PatientService.deletePatient(patient.id);
    });
  }

  /**
   * Check if localStorage has any data
   */
  static hasData(): boolean {
    const patients = PatientService.getAllPatients();
    return patients.length > 0;
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    patientCount: number;
    assessmentCount: number;
    totalStorageSize: number;
  } {
    const patients = PatientService.getAllPatients();
    const assessments = PatientService.getAllAssessments();
    
    // Estimate storage size (rough calculation)
    let totalSize = 0;
    patients.forEach(p => {
      totalSize += JSON.stringify(p).length;
    });
    assessments.forEach(a => {
      totalSize += JSON.stringify(a).length;
    });

    return {
      patientCount: patients.length,
      assessmentCount: assessments.length,
      totalStorageSize: totalSize, // in bytes
    };
  }
}

