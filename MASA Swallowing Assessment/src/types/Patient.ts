export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  mrn: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentData {
  id: string;
  patientId: string;
  patientInfo: {
    name: string;
    dateOfBirth: string;
    mrn: string;
    assessmentDate: string;
    clinician: string;
  };
  selectedGrades: { [key: number]: number | null };
  notes: string;
  savedDate: string;
}

export interface PatientWithAssessments extends Patient {
  assessments: AssessmentData[];
  totalAssessments: number;
  latestAssessment?: AssessmentData;
  averageScore?: number;
} 