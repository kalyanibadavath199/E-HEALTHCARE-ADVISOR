import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Activity, 
  TrendingUp,
  Calendar,
  Database,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { diseases } from '../data/diseases';
import { medicines } from '../data/medicines';
import { clinics } from '../data/clinics';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [medicalRecords] = useLocalStorage('medical_history', []);
  const [patients] = useLocalStorage('patients', []);

  // Mock analytics data
  const analyticsData = {
    totalPatients: patients.length || 156,
    totalConsultations: medicalRecords.length || 324,
    totalClinics: clinics.length,
    avgRating: 4.6,
    dailyConsultations: [12, 19, 3, 17, 28, 22, 34],
    topSymptoms: [
      { symptom: 'Fever', count: 45 },
      { symptom: 'Headache', count: 38 },
      { symptom: 'Cough', count: 32 },
      { symptom: 'Stomach pain', count: 28 },
      { symptom: 'Runny nose', count: 24 }
    ],
    monthlyTrends: {
      consultations: [65, 78, 89, 95, 87, 92],
      satisfaction: [4.2, 4.4, 4.5, 4.6, 4.7, 4.6]
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{analyticsData.totalPatients}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <Users className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Consultations</h3>
              <p className="text-3xl font-bold text-green-600">{analyticsData.totalConsultations}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <Activity className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Clinics</h3>
              <p className="text-3xl font-bold text-purple-600">{analyticsData.totalClinics}</p>
              <p className="text-sm text-green-600">+2 new this month</p>
            </div>
            <Stethoscope className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">{analyticsData.avgRating}</p>
              <p className="text-sm text-green-600">+0.2 from last month</p>
            </div>
            <Heart className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Consultations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Consultations</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.dailyConsultations.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-blue-600 rounded-t w-full transition-all duration-300 hover:bg-blue-700"
                  style={{ height: `${(value / Math.max(...analyticsData.dailyConsultations)) * 200}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Symptoms */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Symptoms</h3>
          <div className="space-y-4">
            {analyticsData.topSymptoms.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.symptom}</span>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / 45) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New patient registration', user: 'John Doe', time: '2 minutes ago', status: 'success' },
            { action: 'Diagnosis completed', user: 'Jane Smith', time: '5 minutes ago', status: 'success' },
            { action: 'Clinic added', user: 'Metro Hospital', time: '1 hour ago', status: 'info' },
            { action: 'System maintenance', user: 'Admin', time: '2 hours ago', status: 'warning' },
            { action: 'Database backup', user: 'System', time: '6 hours ago', status: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Age</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Gender</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Visit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', email: 'john@example.com', age: 35, gender: 'Male', lastVisit: '2024-01-15', status: 'Active' },
                { name: 'Jane Smith', email: 'jane@example.com', age: 28, gender: 'Female', lastVisit: '2024-01-14', status: 'Active' },
                { name: 'Mike Johnson', email: 'mike@example.com', age: 42, gender: 'Male', lastVisit: '2024-01-10', status: 'Inactive' }
              ].map((patient, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{patient.age}</td>
                  <td className="py-3 px-4 text-gray-700">{patient.gender}</td>
                  <td className="py-3 px-4 text-gray-700">{patient.lastVisit}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Cards */}
        {[
          { title: 'Monthly Patient Report', description: 'Patient registration and consultation trends', icon: Users, color: 'blue' },
          { title: 'Disease Analytics', description: 'Most common diseases and symptom patterns', icon: Activity, color: 'green' },
          { title: 'System Performance', description: 'AI accuracy and system usage statistics', icon: BarChart3, color: 'purple' }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className={`bg-${report.color}-100 p-4 rounded-xl inline-block mb-4`}>
              <report.icon className={`h-8 w-8 text-${report.color}-600`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-600 mb-4">{report.description}</p>
            <button className={`bg-${report.color}-600 hover:bg-${report.color}-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors`}>
              View Report
            </button>
          </div>
        ))}
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Trends</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Consultations</h4>
            <div className="space-y-2">
              {analyticsData.monthlyTrends.consultations.map((value, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-12">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(value / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Satisfaction Score</h4>
            <div className="space-y-2">
              {analyticsData.monthlyTrends.satisfaction.map((value, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-12">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage patients, monitor system performance, and generate reports</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600">System configuration and settings will be available here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};