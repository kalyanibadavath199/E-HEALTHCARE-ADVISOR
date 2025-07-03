import { diseases } from '../data/diseases';
import { medicines } from '../data/medicines';
import { clinics } from '../data/clinics';
import { DiagnosisResult, Disease, Medicine } from '../types';

interface SymptomAnswers {
  primarySymptom: string;
  duration: string;
  severity: number;
  additionalSymptoms: string[];
  medicationTaken: boolean;
  chronicConditions: string[];
  currentMedication: boolean;
}

export class DiagnosisEngine {
  static analyze(answers: SymptomAnswers): DiagnosisResult {
    const allSymptoms = [answers.primarySymptom, ...answers.additionalSymptoms];
    
    // Calculate disease probabilities
    const possibleDiseases = diseases
      .map(disease => {
        const matchingSymptoms = disease.symptoms.filter(symptom => 
          allSymptoms.some(userSymptom => 
            symptom.toLowerCase().includes(userSymptom.toLowerCase()) ||
            userSymptom.toLowerCase().includes(symptom.toLowerCase())
          )
        );
        
        let probability = (matchingSymptoms.length / disease.symptoms.length) * 100;
        
        // Boost probability for common symptoms
        const commonMatches = disease.commonSymptoms.filter(symptom => 
          allSymptoms.some(userSymptom => 
            symptom.toLowerCase().includes(userSymptom.toLowerCase())
          )
        );
        probability += commonMatches.length * 10;
        
        // Duration factor
        if (answers.duration === 'Less than 1 day' && disease.severity === 'low') {
          probability += 10;
        } else if (answers.duration === 'More than 1 week' && disease.severity === 'medium') {
          probability += 15;
        }
        
        return {
          disease,
          probability: Math.min(probability, 95), // Cap at 95%
          matchingSymptoms
        };
      })
      .filter(result => result.probability > 20)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    // Determine severity and urgency
    const maxSeverity = Math.max(...possibleDiseases.map(d => 
      d.disease.severity === 'high' ? 3 : d.disease.severity === 'medium' ? 2 : 1
    ));
    
    const severity = answers.severity >= 8 || maxSeverity === 3 ? 'high' : 
                    answers.severity >= 5 || maxSeverity === 2 ? 'medium' : 'low';
    
    const urgency = severity === 'high' ? 'urgent' : 
                   severity === 'medium' ? 'moderate' : 'not-urgent';

    // Recommend medicines based on symptoms
    const recommendedMedicines = this.recommendMedicines(allSymptoms, answers.chronicConditions);

    // Generate recommendations
    const recommendations = this.generateRecommendations(possibleDiseases, severity, answers);

    return {
      possibleDiseases,
      recommendedMedicines,
      severity,
      urgency,
      recommendations,
      nearestClinics: clinics.slice(0, 3) // Mock nearest clinics
    };
  }

  private static recommendMedicines(symptoms: string[], chronicConditions: string[]): Medicine[] {
    const recommended: Medicine[] = [];
    
    // Pain and fever
    if (symptoms.some(s => ['fever', 'headache', 'body aches'].includes(s.toLowerCase()))) {
      recommended.push(medicines.find(m => m.id === 'paracetamol')!);
      if (!chronicConditions.includes('Heart disease')) {
        recommended.push(medicines.find(m => m.id === 'ibuprofen')!);
      }
    }
    
    // Allergic symptoms
    if (symptoms.some(s => ['runny nose', 'sneezing', 'itchy eyes'].includes(s.toLowerCase()))) {
      recommended.push(medicines.find(m => m.id === 'cetirizine')!);
    }
    
    // Stomach issues
    if (symptoms.some(s => ['stomach pain', 'nausea', 'heartburn'].includes(s.toLowerCase()))) {
      recommended.push(medicines.find(m => m.id === 'omeprazole')!);
    }
    
    // Cough
    if (symptoms.includes('cough')) {
      recommended.push(medicines.find(m => m.id === 'dextromethorphan')!);
    }
    
    return recommended.slice(0, 3); // Limit to 3 medicines
  }

  private static generateRecommendations(
    possibleDiseases: Array<{disease: Disease; probability: number}>, 
    severity: string, 
    answers: SymptomAnswers
  ): string[] {
    const recommendations: string[] = [];
    
    if (severity === 'high' || answers.severity >= 8) {
      recommendations.push('🚨 Seek immediate medical attention');
      recommendations.push('📞 Consider calling emergency services if symptoms worsen');
    } else if (severity === 'medium') {
      recommendations.push('🏥 Schedule an appointment with your doctor within 24-48 hours');
      recommendations.push('📊 Monitor your symptoms closely');
    } else {
      recommendations.push('🏠 Rest and take care of yourself at home');
      recommendations.push('💧 Stay hydrated and get plenty of rest');
    }
    
    if (possibleDiseases.length > 0) {
      const topDisease = possibleDiseases[0].disease;
      recommendations.push(...topDisease.prevention.map(p => `🛡️ ${p}`));
    }
    
    recommendations.push('⚠️ This is not a substitute for professional medical advice');
    
    return recommendations;
  }
}