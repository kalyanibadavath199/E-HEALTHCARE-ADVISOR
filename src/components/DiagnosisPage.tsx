import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle, 
  Brain,
  Clock,
  Activity
} from 'lucide-react';
import { questions } from '../data/questions';
import { DiagnosisEngine } from '../utils/diagnosisEngine';
import { DiagnosisResult } from '../types';

export const DiagnosisPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitDiagnosis = async () => {
    setIsSubmitting(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const symptomAnswers = {
      primarySymptom: answers['q1'] || '',
      duration: answers['q2'] || '',
      severity: answers['q3'] || 5,
      additionalSymptoms: answers['q4'] || [],
      medicationTaken: answers['q5'] || false,
      chronicConditions: answers['q6'] || [],
      currentMedication: answers['q7'] || false
    };
    
    const diagnosisResult = DiagnosisEngine.analyze(symptomAnswers);
    setResult(diagnosisResult);
    setIsSubmitting(false);
    setShowResult(true);
  };

  const resetDiagnosis = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
    setIsSubmitting(false);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.text}</h2>
          {question.required && (
            <p className="text-red-500 text-sm">* Required</p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {question.type === 'single' && question.options && (
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    answer === option
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answer === option ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`} />
                    {option}
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const currentAnswers = answer || [];
                    const newAnswers = currentAnswers.includes(option)
                      ? currentAnswers.filter((a: string) => a !== option)
                      : [...currentAnswers, option];
                    handleAnswer(question.id, newAnswers);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    (answer || []).includes(option)
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded border mr-3 ${
                      (answer || []).includes(option) 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {(answer || []).includes(option) && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'scale' && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Mild</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answer || 5}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-500">Severe</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-blue-600">{answer || 5}/10</span>
              </div>
            </div>
          )}

          {question.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4">
              {['Yes', 'No'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(question.id, option === 'Yes')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    answer === (option === 'Yes')
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center px-6 py-3 rounded-xl text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={submitDiagnosis}
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Activity className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Diagnosis'
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="space-y-8">
        {/* Diagnosis Results */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Brain className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Diagnosis Results</h2>
          </div>
          
          <div className="grid gap-6">
            {result.possibleDiseases.map((disease, index) => (
              <div key={index} className="border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{disease.disease.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    disease.probability > 70 ? 'bg-red-100 text-red-800' :
                    disease.probability > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {disease.probability.toFixed(0)}% match
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{disease.disease.description}</p>
                <div className="flex flex-wrap gap-2">
                  {disease.matchingSymptoms.map((symptom, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medicine Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Medicines</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.recommendedMedicines.map((medicine, index) => (
              <div key={index} className="border rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{medicine.category}</p>
                <p className="text-sm text-blue-600 font-medium mb-3">{medicine.dosage}</p>
                <p className="text-sm text-gray-700 mb-4">{medicine.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {medicine.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>
          <div className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetDiagnosis}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            New Diagnosis
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
            Save to Profile
          </button>
        </div>
      </div>
    );
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderResult()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Diagnosis</h1>
          <p className="text-gray-600">Answer a few questions to get personalized health guidance</p>
        </div>
        
        {renderQuestion()}
      </div>
    </div>
  );
};