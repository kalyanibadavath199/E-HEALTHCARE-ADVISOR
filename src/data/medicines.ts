import { Medicine } from '../types';

export const medicines: Medicine[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Pain Relief',
    dosage: '500mg every 6 hours (max 4g/day)',
    sideEffects: ['Nausea', 'Rash (rare)', 'Liver damage (overdose)'],
    contraindications: ['Severe liver disease', 'Alcohol dependence'],
    price: 15,
    availability: 'available',
    overTheCounter: true,
    description: 'Effective pain reliever and fever reducer. Safe for most people when used as directed.'
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Pain Relief',
    dosage: '200-400mg every 6-8 hours (max 1.2g/day)',
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
    contraindications: ['Stomach ulcers', 'Heart disease', 'Kidney problems'],
    price: 25,
    availability: 'available',
    overTheCounter: true,
    description: 'Anti-inflammatory drug that reduces pain, fever, and inflammation.'
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine',
    dosage: '10mg once daily',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    contraindications: ['Severe kidney disease'],
    price: 30,
    availability: 'available',
    overTheCounter: true,
    description: 'Long-acting antihistamine for allergies and hay fever.'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Antacid',
    dosage: '20mg once daily before breakfast',
    sideEffects: ['Headache', 'Nausea', 'Abdominal pain'],
    contraindications: ['Hypersensitivity to proton pump inhibitors'],
    price: 45,
    availability: 'available',
    overTheCounter: true,
    description: 'Proton pump inhibitor that reduces stomach acid production.'
  },
  {
    id: 'dextromethorphan',
    name: 'Dextromethorphan',
    genericName: 'Dextromethorphan HBr',
    category: 'Cough Suppressant',
    dosage: '15mg every 4 hours (max 120mg/day)',
    sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
    contraindications: ['MAO inhibitors', 'Severe liver disease'],
    price: 20,
    availability: 'available',
    overTheCounter: true,
    description: 'Effective cough suppressant for dry, non-productive coughs.'
  }
];