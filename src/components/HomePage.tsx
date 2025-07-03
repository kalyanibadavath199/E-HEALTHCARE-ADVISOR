import React from 'react';
import { 
  Stethoscope, 
  Brain, 
  Shield, 
  Users, 
  MapPin, 
  Clock,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Diagnosis',
      description: 'Advanced machine learning algorithms analyze your symptoms to provide accurate preliminary diagnoses.',
      color: 'bg-blue-500'
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: 'Medicine Recommendations',
      description: 'Get personalized over-the-counter medicine suggestions based on your symptoms and medical history.',
      color: 'bg-teal-500'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Find Nearby Clinics',
      description: 'Locate government-approved healthcare facilities near you with real-time availability.',
      color: 'bg-green-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Your medical information is encrypted and stored securely with full HIPAA compliance.',
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Patients Helped' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Available' },
    { number: '500+', label: 'Clinics Network' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-medium mb-4">
                <Star className="h-5 w-5 fill-current" />
                <span>Trusted by Healthcare Professionals</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Personal 
                <span className="text-blue-600"> AI Health</span> 
                <br />Assistant
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get instant medical guidance, symptom analysis, and treatment recommendations 
                powered by advanced artificial intelligence. Available 24/7 for your health needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onViewChange('diagnosis')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
                >
                  Start Diagnosis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onViewChange('clinics')}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  Find Clinics
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-12 text-white shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold mb-2">{stat.number}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-semibold text-gray-900">Verified Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Healthcare Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with medical expertise 
              to provide you with comprehensive healthcare guidance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`${feature.color} text-white p-4 rounded-xl inline-block mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your health guidance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Describe Symptoms',
                description: 'Answer a few questions about your symptoms and medical history.',
                icon: <Users className="h-12 w-12" />
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes your symptoms against our medical database.',
                icon: <Brain className="h-12 w-12" />
              },
              {
                step: '03',
                title: 'Get Recommendations',
                description: 'Receive personalized medicine suggestions and clinic recommendations.',
                icon: <Stethoscope className="h-12 w-12" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust our AI-powered healthcare advisor for reliable medical guidance.
          </p>
          <button
            onClick={() => onViewChange('diagnosis')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center"
          >
            <Clock className="mr-2 h-5 w-5" />
            Start Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
};