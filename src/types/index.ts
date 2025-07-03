export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory: MedicalRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  symptoms: string[];
  diagnosis: string;
  medicines: Medicine[];
  date: Date;
  severity: 'low' | 'medium' | 'high';
  followUpRequired: boolean;
  feedback?: {
    helpful: boolean;
    comments: string;
    rating: number;
  };
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  commonSymptoms: string[];
  rareSymptoms: string[];
  severity: 'low' | 'medium' | 'high';
  category: string;
  prevalence: number;
  ageGroups: string[];
  prevention: string[];
  whenToSeeDoctor: string[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  price: number;
  availability: 'available' | 'limited' | 'unavailable';
  overTheCounter: boolean;
  description: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
  distance?: number;
  isGovernmentApproved: boolean;
  availableHours: {
    open: string;
    close: string;
    days: string[];
  };
  facilities: string[];
}

export interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'scale' | 'boolean';
  options?: string[];
  required: boolean;
  category: string;
}

export interface DiagnosisResult {
  possibleDiseases: Array<{
    disease: Disease;
    probability: number;
    matchingSymptoms: string[];
  }>;
  recommendedMedicines: Medicine[];
  severity: 'low' | 'medium' | 'high';
  urgency: 'not-urgent' | 'moderate' | 'urgent';
  recommendations: string[];
  nearestClinics: Clinic[];
}