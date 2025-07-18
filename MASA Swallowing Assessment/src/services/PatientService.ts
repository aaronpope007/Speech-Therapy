import { Patient, AssessmentData, PatientWithAssessments } from '../types/Patient';

export class PatientService {
  private static PATIENT_PREFIX = 'masa-patient-';
  private static ASSESSMENT_PREFIX = 'masa-assessment-';

  // Patient CRUD operations
  static getAllPatients(): Patient[] {
    const patients: Patient[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PATIENT_PREFIX)) {
        try {
          const patient = JSON.parse(localStorage.getItem(key)!);
          patients.push(patient);
        } catch (error) {
          console.error('Error loading patient:', error);
        }
      }
    }
    return patients.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  static getPatientById(id: string): Patient | null {
    try {
      const patient = localStorage.getItem(this.PATIENT_PREFIX + id);
      return patient ? JSON.parse(patient) : null;
    } catch (error) {
      console.error('Error loading patient:', error);
      return null;
    }
  }

  static createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const id = `patient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const patient: Patient = {
      ...patientData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    
    localStorage.setItem(this.PATIENT_PREFIX + id, JSON.stringify(patient));
    return patient;
  }

  static updatePatient(id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt'>>): Patient | null {
    const existing = this.getPatientById(id);
    if (!existing) return null;

    const updatedPatient: Patient = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.PATIENT_PREFIX + id, JSON.stringify(updatedPatient));
    return updatedPatient;
  }

  static deletePatient(id: string): boolean {
    try {
      localStorage.removeItem(this.PATIENT_PREFIX + id);
      // Also delete all assessments for this patient
      this.getAssessmentsByPatientId(id).forEach(assessment => {
        localStorage.removeItem(this.ASSESSMENT_PREFIX + assessment.id);
      });
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      return false;
    }
  }

  // Assessment operations
  static getAllAssessments(): AssessmentData[] {
    const assessments: AssessmentData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.ASSESSMENT_PREFIX)) {
        try {
          const assessment = JSON.parse(localStorage.getItem(key)!);
          assessments.push(assessment);
        } catch (error) {
          console.error('Error loading assessment:', error);
        }
      }
    }
    return assessments.sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime());
  }

  static getAssessmentsByPatientId(patientId: string): AssessmentData[] {
    return this.getAllAssessments().filter(assessment => assessment.patientId === patientId);
  }

  static createAssessment(assessmentData: Omit<AssessmentData, 'id'>): AssessmentData {
    const id = `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const assessment: AssessmentData = {
      ...assessmentData,
      id,
    };
    
    localStorage.setItem(this.ASSESSMENT_PREFIX + id, JSON.stringify(assessment));
    return assessment;
  }

  static updateAssessment(id: string, updates: Partial<Omit<AssessmentData, 'id'>>): AssessmentData | null {
    try {
      const existingData = localStorage.getItem(this.ASSESSMENT_PREFIX + id);
      if (!existingData) {
        return null;
      }

      const existingAssessment = JSON.parse(existingData) as AssessmentData;
      const updatedAssessment: AssessmentData = {
        ...existingAssessment,
        ...updates,
        savedDate: new Date().toISOString()
      };

      localStorage.setItem(this.ASSESSMENT_PREFIX + id, JSON.stringify(updatedAssessment));
      return updatedAssessment;
    } catch (error) {
      console.error('Error updating assessment:', error);
      return null;
    }
  }

  static deleteAssessment(id: string): boolean {
    try {
      localStorage.removeItem(this.ASSESSMENT_PREFIX + id);
      return true;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      return false;
    }
  }

  // Combined data operations
  static getPatientsWithAssessments(): PatientWithAssessments[] {
    const patients = this.getAllPatients();
    const allAssessments = this.getAllAssessments();

    return patients.map(patient => {
      const patientAssessments = allAssessments.filter(assessment => assessment.patientId === patient.id);
      const latestAssessment = patientAssessments.length > 0 ? patientAssessments[0] : undefined;
      
      // Calculate average score
      let averageScore: number | undefined;
      if (patientAssessments.length > 0) {
        const totalScore = patientAssessments.reduce((sum, assessment) => {
          const score = Object.values(assessment.selectedGrades).reduce((acc: number, val) => 
            acc + (typeof val === 'number' ? val : 0), 0);
          return sum + score;
        }, 0);
        averageScore = Math.round(totalScore / patientAssessments.length);
      }

      return {
        ...patient,
        assessments: patientAssessments,
        totalAssessments: patientAssessments.length,
        latestAssessment,
        averageScore,
      };
    });
  }

  // Migration helper for existing data
  static migrateExistingAssessments(): void {
    const oldAssessments: Array<{ patientInfo: { name: string; dateOfBirth: string; mrn?: string; assessmentDate?: string; clinician?: string }; selectedGrades: { [key: number]: number | null }; notes?: string; savedDate: string; oldId: string }> = [];
    
    // Find old assessment format
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('masa-assessment-') && !key.includes('patient-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          if (data.patientInfo && !data.patientId) {
            oldAssessments.push({ ...data, oldId: key });
          }
        } catch (error) {
          console.error('Error loading old assessment:', error);
        }
      }
    }

    // Migrate each old assessment
    oldAssessments.forEach(oldAssessment => {
      // Create a patient if name exists
      let patientId = '';
      if (oldAssessment.patientInfo.name) {
        const existingPatient = this.getAllPatients().find(p => 
          p.name === oldAssessment.patientInfo.name && 
          p.dateOfBirth === oldAssessment.patientInfo.dateOfBirth
        );
        
        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          const newPatient = this.createPatient({
            name: oldAssessment.patientInfo.name,
            dateOfBirth: oldAssessment.patientInfo.dateOfBirth,
            mrn: oldAssessment.patientInfo.mrn || '',
          });
          patientId = newPatient.id;
        }
      }

             // Create new assessment format
       const newAssessment: Omit<AssessmentData, 'id'> = {
         patientId,
         patientInfo: {
           ...oldAssessment.patientInfo,
           mrn: oldAssessment.patientInfo.mrn || '',
           assessmentDate: oldAssessment.patientInfo.assessmentDate || new Date().toISOString().split('T')[0],
           clinician: oldAssessment.patientInfo.clinician || '',
         },
         selectedGrades: oldAssessment.selectedGrades,
         notes: oldAssessment.notes || '',
         savedDate: oldAssessment.savedDate,
       };

      this.createAssessment(newAssessment);
      
      // Remove old assessment
      localStorage.removeItem(oldAssessment.oldId);
    });
  }
} 