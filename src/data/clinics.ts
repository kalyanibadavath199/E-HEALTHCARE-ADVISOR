import { Clinic } from '../types';

export const clinics: Clinic[] = [
  {
    id: 'city-general',
    name: 'City General Hospital',
    address: '123 Medical Center Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91-22-1234-5678',
    email: 'info@citygeneral.in',
    specialties: ['General Medicine', 'Emergency Care', 'Cardiology', 'Orthopedics'],
    rating: 4.5,
    isGovernmentApproved: true,
    availableHours: {
      open: '08:00',
      close: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    facilities: ['24/7 Emergency', 'ICU', 'Laboratory', 'Radiology', 'Pharmacy']
  },
  {
    id: 'care-clinic',
    name: 'Primary Care Clinic',
    address: '456 Health Street',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: '+91-11-9876-5432',
    email: 'contact@primarycare.in',
    specialties: ['Family Medicine', 'Pediatrics', 'Internal Medicine'],
    rating: 4.2,
    isGovernmentApproved: true,
    availableHours: {
      open: '09:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    facilities: ['Laboratory', 'Minor Surgery', 'Vaccination', 'Health Checkups']
  },
  {
    id: 'metro-medical',
    name: 'Metro Medical Center',
    address: '789 Wellness Boulevard',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91-80-1111-2222',
    email: 'info@metromedical.in',
    specialties: ['General Medicine', 'Dermatology', 'Gynecology', 'ENT'],
    rating: 4.7,
    isGovernmentApproved: true,
    availableHours: {
      open: '07:00',
      close: '21:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    facilities: ['24/7 Emergency', 'Diagnostic Center', 'Pharmacy', 'Ambulance Service']
  }
];