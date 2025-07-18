import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Patient, AssessmentData, PatientWithAssessments } from '../types/Patient';

export class FirebaseService {
  private static PATIENTS_COLLECTION = 'patients';
  private static ASSESSMENTS_COLLECTION = 'assessments';

  /**
   * Check if Firebase is available
   */
  static isAvailable(): boolean {
    return db !== null;
  }

  /**
   * Get all patients from Firestore
   */
  static async getAllPatients(): Promise<Patient[]> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const querySnapshot = await getDocs(collection(db!, this.PATIENTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Patient[];
    } catch (error) {
      console.error('Error fetching patients from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get a single patient by ID
   */
  static async getPatientById(id: string): Promise<Patient | null> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const docRef = doc(db!, this.PATIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Patient;
      }
      return null;
    } catch (error) {
      console.error('Error fetching patient from Firebase:', error);
      throw error;
    }
  }

  /**
   * Create a new patient
   */
  static async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const now = new Date().toISOString();
      const patientToCreate = {
        ...patientData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db!, this.PATIENTS_COLLECTION), patientToCreate);
      return {
        id: docRef.id,
        ...patientToCreate
      };
    } catch (error) {
      console.error('Error creating patient in Firebase:', error);
      throw error;
    }
  }

  /**
   * Update an existing patient
   */
  static async updatePatient(id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt'>>): Promise<Patient | null> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const docRef = doc(db!, this.PATIENTS_COLLECTION, id);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
      
      // Fetch and return updated patient
      const updatedDoc = await getDoc(docRef);
      if (updatedDoc.exists()) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as Patient;
      }
      return null;
    } catch (error) {
      console.error('Error updating patient in Firebase:', error);
      throw error;
    }
  }

  /**
   * Delete a patient and all their assessments
   */
  static async deletePatient(id: string): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const batch = writeBatch(db!);
      
      // Delete all assessments for this patient
      const assessmentsQuery = query(
        collection(db!, this.ASSESSMENTS_COLLECTION),
        where('patientId', '==', id)
      );
      const assessmentsSnapshot = await getDocs(assessmentsQuery);
      
      assessmentsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete the patient
      const patientRef = doc(db!, this.PATIENTS_COLLECTION, id);
      batch.delete(patientRef);

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error deleting patient from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get all assessments from Firestore
   */
  static async getAllAssessments(): Promise<AssessmentData[]> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const querySnapshot = await getDocs(collection(db!, this.ASSESSMENTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentData[];
    } catch (error) {
      console.error('Error fetching assessments from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get assessments for a specific patient
   */
  static async getAssessmentsByPatientId(patientId: string): Promise<AssessmentData[]> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const q = query(
        collection(db!, this.ASSESSMENTS_COLLECTION),
        where('patientId', '==', patientId),
        orderBy('savedDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentData[];
    } catch (error) {
      console.error('Error fetching patient assessments from Firebase:', error);
      throw error;
    }
  }

  /**
   * Create a new assessment
   */
  static async createAssessment(assessmentData: Omit<AssessmentData, 'id'>): Promise<AssessmentData> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const docRef = await addDoc(collection(db!, this.ASSESSMENTS_COLLECTION), assessmentData);
      return {
        id: docRef.id,
        ...assessmentData
      };
    } catch (error) {
      console.error('Error creating assessment in Firebase:', error);
      throw error;
    }
  }

  /**
   * Update an existing assessment
   */
  static async updateAssessment(id: string, updates: Partial<Omit<AssessmentData, 'id'>>): Promise<AssessmentData | null> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const docRef = doc(db!, this.ASSESSMENTS_COLLECTION, id);
      const updateData = {
        ...updates,
        savedDate: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
      
      // Fetch and return updated assessment
      const updatedDoc = await getDoc(docRef);
      if (updatedDoc.exists()) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as AssessmentData;
      }
      return null;
    } catch (error) {
      console.error('Error updating assessment in Firebase:', error);
      throw error;
    }
  }

  /**
   * Delete an assessment
   */
  static async deleteAssessment(id: string): Promise<boolean> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      await deleteDoc(doc(db!, this.ASSESSMENTS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting assessment from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get patients with their assessments (for dashboard)
   */
  static async getPatientsWithAssessments(): Promise<PatientWithAssessments[]> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      const patients = await this.getAllPatients();
      const patientsWithAssessments: PatientWithAssessments[] = [];

      for (const patient of patients) {
        const assessments = await this.getAssessmentsByPatientId(patient.id);
        
        const totalAssessments = assessments.length;
        const latestAssessment = assessments[0] || undefined;
        const averageScore = assessments.length > 0 
          ? assessments.reduce((sum, assessment) => {
              const score = Object.values(assessment.selectedGrades)
                .filter(grade => grade !== null)
                .reduce((total, grade) => total + (grade || 0), 0);
              return sum + score;
            }, 0) / assessments.length
          : undefined;

        patientsWithAssessments.push({
          ...patient,
          assessments,
          totalAssessments,
          latestAssessment,
          averageScore
        });
      }

      return patientsWithAssessments;
    } catch (error) {
      console.error('Error fetching patients with assessments from Firebase:', error);
      throw error;
    }
  }

  /**
   * Migrate data from localStorage to Firebase
   */
  static async migrateFromLocalStorage(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Firebase is not available');
    }

    try {
      // Get existing localStorage data
      const existingPatients = JSON.parse(localStorage.getItem('masa-patients') || '[]');
      const existingAssessments = JSON.parse(localStorage.getItem('masa-assessments') || '[]');

      const batch = writeBatch(db!);

      // Migrate patients
      for (const patient of existingPatients) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...patientData } = patient;
        const docRef = doc(collection(db!, this.PATIENTS_COLLECTION));
        batch.set(docRef, {
          ...patientData,
          createdAt: patient.createdAt || new Date().toISOString(),
          updatedAt: patient.updatedAt || new Date().toISOString()
        });
      }

      // Migrate assessments
      for (const assessment of existingAssessments) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...assessmentData } = assessment;
        const docRef = doc(collection(db!, this.ASSESSMENTS_COLLECTION));
        batch.set(docRef, {
          ...assessmentData,
          savedDate: assessment.savedDate || new Date().toISOString()
        });
      }

      await batch.commit();
      console.log('Data migration to Firebase completed successfully');
    } catch (error) {
      console.error('Error migrating data to Firebase:', error);
      throw error;
    }
  }
} 