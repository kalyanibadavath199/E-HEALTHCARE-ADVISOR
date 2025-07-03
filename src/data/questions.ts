import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'What is your primary symptom?',
    type: 'single',
    options: ['Fever', 'Headache', 'Cough', 'Stomach pain', 'Runny nose', 'Body aches', 'Nausea'],
    required: true,
    category: 'primary'
  },
  {
    id: 'q2',
    text: 'How long have you been experiencing these symptoms?',
    type: 'single',
    options: ['Less than 1 day', '1-3 days', '4-7 days', 'More than 1 week'],
    required: true,
    category: 'duration'
  },
  {
    id: 'q3',
    text: 'Rate the severity of your symptoms (1-10)',
    type: 'scale',
    required: true,
    category: 'severity'
  },
  {
    id: 'q4',
    text: 'Do you have any of these additional symptoms?',
    type: 'multiple',
    options: ['Chills', 'Sweating', 'Difficulty breathing', 'Sore throat', 'Fatigue', 'Loss of appetite', 'Dizziness'],
    required: false,
    category: 'additional'
  },
  {
    id: 'q5',
    text: 'Have you taken any medication for these symptoms?',
    type: 'boolean',
    required: false,
    category: 'medication'
  },
  {
    id: 'q6',
    text: 'Do you have any chronic medical conditions?',
    type: 'multiple',
    options: ['Diabetes', 'High blood pressure', 'Heart disease', 'Asthma', 'Kidney disease', 'None'],
    required: false,
    category: 'medical_history'
  },
  {
    id: 'q7',
    text: 'Are you currently taking any regular medications?',
    type: 'boolean',
    required: false,
    category: 'current_medication'
  }
];