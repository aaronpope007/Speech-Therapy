import { PatientService } from './PatientService';
import { FirebaseService } from './FirebaseService';
import { Patient, AssessmentData, PatientWithAssessments } from '../types/Patient';

export class EnhancedPatientService {
  private static useFirebase = false;
  private static migrationCompleted = false;

  /**
   * Initialize the service and determine which storage to use
   */
  static async initialize(): Promise<void> {
    try {
      if (FirebaseService.isAvailable()) {
        this.useFirebase = true;
        
        // Check if we need to migrate from localStorage
        if (!this.migrationCompleted) {
          const hasLocalData = localStorage.getItem('masa-patients') || localStorage.getItem('masa-assessments');
          if (hasLocalData) {
            await this.migrateToFirebase();
          }
          this.migrationCompleted = true;
        }
      } else {
        this.useFirebase = false;
      }
    } catch (error) {
      console.error('Error initializing EnhancedPatientService:', error);
      this.useFirebase = false;
    }
  }

  /**
   * Get the current storage method being used
   */
  static getStorageMethod(): 'firebase' | 'localStorage' {
    return this.useFirebase ? 'firebase' : 'localStorage';
  }

  /**
   * Migrate data from localStorage to Firebase
   */
  private static async migrateToFirebase(): Promise<void> {
    try {
      await FirebaseService.migrateFromLocalStorage();
      
      // Clear localStorage after successful migration
      localStorage.removeItem('masa-patients');
      localStorage.removeItem('masa-assessments');
    } catch (error) {
      console.error('Migration failed, keeping localStorage data:', error);
    }
  }

  /**
   * Get all patients
   */
  static async getAllPatients(): Promise<Patient[]> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.getAllPatients();
    } else {
      return PatientService.getAllPatients();
    }
  }

  /**
   * Get a single patient by ID
   */
  static async getPatientById(id: string): Promise<Patient | null> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.getPatientById(id);
    } else {
      return PatientService.getPatientById(id);
    }
  }

  /**
   * Create a new patient
   */
  static async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.createPatient(patientData);
    } else {
      return PatientService.createPatient(patientData);
    }
  }

  /**
   * Update an existing patient
   */
  static async updatePatient(id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt'>>): Promise<Patient | null> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.updatePatient(id, updates);
    } else {
      return PatientService.updatePatient(id, updates);
    }
  }

  /**
   * Delete a patient
   */
  static async deletePatient(id: string): Promise<boolean> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.deletePatient(id);
    } else {
      return PatientService.deletePatient(id);
    }
  }

  /**
   * Get all assessments
   */
  static async getAllAssessments(): Promise<AssessmentData[]> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.getAllAssessments();
    } else {
      return PatientService.getAllAssessments();
    }
  }

  /**
   * Get assessments for a specific patient
   */
  static async getAssessmentsByPatientId(patientId: string): Promise<AssessmentData[]> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.getAssessmentsByPatientId(patientId);
    } else {
      return PatientService.getAssessmentsByPatientId(patientId);
    }
  }

  /**
   * Create a new assessment
   */
  static async createAssessment(assessmentData: Omit<AssessmentData, 'id'>): Promise<AssessmentData> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.createAssessment(assessmentData);
    } else {
      return PatientService.createAssessment(assessmentData);
    }
  }

  /**
   * Update an existing assessment
   */
  static async updateAssessment(id: string, updates: Partial<Omit<AssessmentData, 'id'>>): Promise<AssessmentData | null> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.updateAssessment(id, updates);
    } else {
      return PatientService.updateAssessment(id, updates);
    }
  }

  /**
   * Delete an assessment
   */
  static async deleteAssessment(id: string): Promise<boolean> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.deleteAssessment(id);
    } else {
      return PatientService.deleteAssessment(id);
    }
  }

  /**
   * Get patients with their assessments (for dashboard)
   */
  static async getPatientsWithAssessments(): Promise<PatientWithAssessments[]> {
    await this.initialize();
    
    if (this.useFirebase) {
      return FirebaseService.getPatientsWithAssessments();
    } else {
      return PatientService.getPatientsWithAssessments();
    }
  }

  /**
   * Force migration from localStorage to Firebase
   */
  static async forceMigrationToFirebase(): Promise<void> {
    if (!FirebaseService.isAvailable()) {
      throw new Error('Firebase is not available for migration');
    }
    
    await this.migrateToFirebase();
    this.useFirebase = true;
    this.migrationCompleted = true;
  }

  /**
   * Switch back to localStorage (for testing or fallback)
   */
  static switchToLocalStorage(): void {
    this.useFirebase = false;
  }

  /**
   * Switch to Firebase (if available)
   */
  static async switchToFirebase(): Promise<boolean> {
    if (!FirebaseService.isAvailable()) {
      console.error('Firebase is not available');
      return false;
    }
    
    this.useFirebase = true;
    return true;
  }

  /**
   * Get storage status information
   */
  static getStorageStatus(): {
    currentMethod: 'firebase' | 'localStorage';
    firebaseAvailable: boolean;
    migrationCompleted: boolean;
  } {
    return {
      currentMethod: this.useFirebase ? 'firebase' : 'localStorage',
      firebaseAvailable: FirebaseService.isAvailable(),
      migrationCompleted: this.migrationCompleted
    };
  }
} 