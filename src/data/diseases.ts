import { Disease } from '../types';

export const diseases: Disease[] = [
  {
    id: 'common-cold',
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract',
    symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'mild fever', 'fatigue'],
    commonSymptoms: ['runny nose', 'sneezing', 'cough'],
    rareSymptoms: ['high fever', 'body aches'],
    severity: 'low',
    category: 'Respiratory',
    prevalence: 85,
    ageGroups: ['all'],
    prevention: ['Wash hands frequently', 'Avoid close contact with sick people', 'Don\'t touch face'],
    whenToSeeDoctor: ['Fever above 101.5°F', 'Symptoms last more than 10 days', 'Difficulty breathing']
  },
  {
    id: 'flu',
    name: 'Influenza (Flu)',
    description: 'A viral infection that attacks the respiratory system',
    symptoms: ['high fever', 'body aches', 'chills', 'cough', 'sore throat', 'runny nose', 'fatigue', 'headache'],
    commonSymptoms: ['high fever', 'body aches', 'chills', 'fatigue'],
    rareSymptoms: ['vomiting', 'diarrhea'],
    severity: 'medium',
    category: 'Respiratory',
    prevalence: 20,
    ageGroups: ['all'],
    prevention: ['Get annual flu vaccine', 'Wash hands frequently', 'Avoid crowded places during flu season'],
    whenToSeeDoctor: ['Fever above 103°F', 'Difficulty breathing', 'Chest pain', 'Severe headache']
  },
  {
    id: 'headache',
    name: 'Tension Headache',
    description: 'The most common type of headache caused by muscle tension',
    symptoms: ['head pain', 'neck tension', 'scalp tenderness', 'fatigue'],
    commonSymptoms: ['head pain', 'neck tension'],
    rareSymptoms: ['nausea', 'sensitivity to light'],
    severity: 'low',
    category: 'Neurological',
    prevalence: 70,
    ageGroups: ['adults', 'teenagers'],
    prevention: ['Manage stress', 'Get adequate sleep', 'Stay hydrated', 'Regular exercise'],
    whenToSeeDoctor: ['Sudden severe headache', 'Headache with fever', 'Changes in vision']
  },
  {
    id: 'gastritis',
    name: 'Gastritis',
    description: 'Inflammation of the stomach lining',
    symptoms: ['stomach pain', 'nausea', 'bloating', 'loss of appetite', 'heartburn'],
    commonSymptoms: ['stomach pain', 'nausea', 'bloating'],
    rareSymptoms: ['vomiting blood', 'black stools'],
    severity: 'medium',
    category: 'Gastrointestinal',
    prevalence: 30,
    ageGroups: ['adults'],
    prevention: ['Avoid spicy foods', 'Limit alcohol', 'Don\'t smoke', 'Manage stress'],
    whenToSeeDoctor: ['Severe abdominal pain', 'Vomiting blood', 'Black or tarry stools']
  },
  {
    id: 'allergic-rhinitis',
    name: 'Allergic Rhinitis',
    description: 'Allergic reaction causing inflammation in the nose',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'nasal congestion', 'postnasal drip'],
    commonSymptoms: ['sneezing', 'runny nose', 'itchy eyes'],
    rareSymptoms: ['ear fullness', 'fatigue'],
    severity: 'low',
    category: 'Allergic',
    prevalence: 40,
    ageGroups: ['all'],
    prevention: ['Avoid allergens', 'Keep windows closed during high pollen days', 'Use air purifiers'],
    whenToSeeDoctor: ['Symptoms interfere with daily life', 'Frequent sinus infections', 'Asthma symptoms']
  }
];