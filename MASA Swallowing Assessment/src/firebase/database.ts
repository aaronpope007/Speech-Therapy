import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import CryptoJS from 'crypto-js';

export interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  medicalRecordNumber?: string;
  organization: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  encryptedData: string; // Encrypted PHI data
}

export interface AssessmentData {
  id: string;
  patientId: string;
  patientInfo: {
    name: string;
    dateOfBirth: string;
    assessmentDate: string;
    clinician: string;
  };
  selectedGrades: { [key: number]: number | null };
  notes: string;
  totalScore: number;
  severity: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  encryptedData: string; // Encrypted assessment data
}

export interface UserData {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  role: 'admin' | 'clinician';
  organization: string;
  isActive: boolean;
  lastLogin: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  encryptedPassword: string; // Encrypted password hash
}

// Encryption key (in production, this should be stored securely)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-encryption-key-here';

// Encryption/Decryption utilities
const encryptData = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Patient Management
export const createPatient = async (
  patientData: Omit<PatientData, 'id' | 'createdAt' | 'updatedAt' | 'encryptedData'>,
  phiData: any
): Promise<string> => {
  if (!db) throw new Error('Firebase not initialized');

  const patientId = doc(collection(db, 'patients')).id;
  const encryptedPhiData = encryptData(phiData);

  const patient: PatientData = {
    ...patientData,
    id: patientId,
    encryptedData: encryptedPhiData,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(doc(db, 'patients', patientId), patient);
  return patientId;
};

export const getPatient = async (patientId: string): Promise<PatientData | null> => {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'patients', patientId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PatientData;
  }
  return null;
};

export const getPatientsByOrganization = async (organization: string): Promise<PatientData[]> => {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'patients'),
    where('organization', '==', organization),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as PatientData);
};

export const updatePatient = async (
  patientId: string, 
  updates: Partial<PatientData>,
  phiData?: any
): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  const updateData: any = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (phiData) {
    updateData.encryptedData = encryptData(phiData);
  }

  await updateDoc(doc(db, 'patients', patientId), updateData);
};

export const deletePatient = async (patientId: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  await deleteDoc(doc(db, 'patients', patientId));
};

// Assessment Management
export const saveAssessment = async (
  assessmentData: Omit<AssessmentData, 'id' | 'createdAt' | 'updatedAt' | 'encryptedData'>,
  assessmentDetails: any
): Promise<string> => {
  if (!db) throw new Error('Firebase not initialized');

  const assessmentId = doc(collection(db, 'assessments')).id;
  const encryptedAssessmentData = encryptData(assessmentDetails);

  const assessment: AssessmentData = {
    ...assessmentData,
    id: assessmentId,
    encryptedData: encryptedAssessmentData,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(doc(db, 'assessments', assessmentId), assessment);
  return assessmentId;
};

export const getAssessment = async (assessmentId: string): Promise<AssessmentData | null> => {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'assessments', assessmentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AssessmentData;
  }
  return null;
};

export const getAssessmentsByPatient = async (patientId: string): Promise<AssessmentData[]> => {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'assessments'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as AssessmentData);
};

export const getAssessmentsByOrganization = async (organization: string): Promise<AssessmentData[]> => {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'assessments'),
    where('organization', '==', organization),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as AssessmentData);
};

export const updateAssessment = async (
  assessmentId: string,
  updates: Partial<AssessmentData>,
  assessmentDetails?: any
): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  const updateData: any = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (assessmentDetails) {
    updateData.encryptedData = encryptData(assessmentDetails);
  }

  await updateDoc(doc(db, 'assessments', assessmentId), updateData);
};

export const deleteAssessment = async (assessmentId: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  await deleteDoc(doc(db, 'assessments', assessmentId));
};

// Data access utilities
export const getDecryptedPatientData = (patient: PatientData): any => {
  return decryptData(patient.encryptedData);
};

export const getDecryptedAssessmentData = (assessment: AssessmentData): any => {
  return decryptData(assessment.encryptedData);
};

// User Management
export const createUser = async (
  userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'encryptedPassword' | 'isActive'>,
  password: string
): Promise<string> => {
  if (!db) throw new Error('Firebase not initialized');

  const userId = doc(collection(db, 'users')).id;
  const encryptedPassword = encryptData(password);

  const user: UserData = {
    ...userData,
    id: userId,
    encryptedPassword,
    isActive: true,
    lastLogin: serverTimestamp() as Timestamp,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(doc(db, 'users', userId), user);
  return userId;
};

export const getUserByUsername = async (username: string): Promise<UserData | null> => {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'users'),
    where('username', '==', username),
    where('isActive', '==', true)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as UserData;
  }
  return null;
};

export const getUserById = async (userId: string): Promise<UserData | null> => {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
};

export const getUsersByOrganization = async (organization: string): Promise<UserData[]> => {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'users'),
    where('organization', '==', organization),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as UserData);
};

export const updateUser = async (
  userId: string,
  updates: Partial<UserData>
): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  const updateData = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, 'users', userId), updateData);
};

export const updateUserPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  const encryptedPassword = encryptData(newPassword);
  
  await updateDoc(doc(db, 'users', userId), {
    encryptedPassword,
    updatedAt: serverTimestamp(),
  });
};

export const updateUserLastLogin = async (userId: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  await updateDoc(doc(db, 'users', userId), {
    lastLogin: serverTimestamp(),
  });
};

export const deactivateUser = async (userId: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  await updateDoc(doc(db, 'users', userId), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  if (!db) throw new Error('Firebase not initialized');

  await deleteDoc(doc(db, 'users', userId));
};

// Password verification
export const verifyUserPassword = (user: UserData, password: string): boolean => {
  try {
    const decryptedPassword = decryptData(user.encryptedPassword);
    return decryptedPassword === password;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}; 