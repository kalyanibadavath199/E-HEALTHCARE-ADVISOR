import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  Search, 
  Filter,
  Navigation,
  Shield,
  Users,
  Stethoscope
} from 'lucide-react';
import { clinics } from '../data/clinics';
import { Clinic } from '../types';

export const ClinicsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const cities = [...new Set(clinics.map(clinic => clinic.city))];
  const specialties = [...new Set(clinics.flatMap(clinic => clinic.specialties))];

  const filteredClinics = useMemo(() => {
    let filtered = clinics.filter(clinic => {
      const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           clinic.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = !selectedCity || clinic.city === selectedCity;
      const matchesSpecialty = !selectedSpecialty || clinic.specialties.includes(selectedSpecialty);
      
      return matchesSearch && matchesCity && matchesSpecialty;
    });

    // Sort clinics
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCity, selectedSpecialty, sortBy]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isClinicOpen = (clinic: Clinic) => {
    const now = getCurrentTime();
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!clinic.availableHours.days.includes(currentDay)) {
      return false;
    }
    
    return now >= clinic.availableHours.open && now <= clinic.availableHours.close;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Healthcare Facilities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Locate government-approved clinics and hospitals near you with real-time availability and ratings.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clinics, hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
              <option value="city">Sort by City</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredClinics.length}</span> healthcare facilities
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Clinic Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{clinic.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{clinic.address}, {clinic.city}</span>
                    </div>
                  </div>
                  {clinic.isGovernmentApproved && (
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Rating and Status */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{clinic.rating}</span>
                    <span className="ml-1 text-gray-500 text-sm">(128 reviews)</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isClinicOpen(clinic)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isClinicOpen(clinic) ? 'Open Now' : 'Closed'}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                    {clinic.specialties.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{clinic.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Clinic Details */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3" />
                    <span className="text-sm">{clinic.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3" />
                    <span className="text-sm">{clinic.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-3" />
                    <span className="text-sm">
                      {clinic.availableHours.open} - {clinic.availableHours.close}
                    </span>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Facilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {clinic.facilities.slice(0, 3).map((facility, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedClinic(clinic)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                  >
                    View Details
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center">
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clinics found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Clinic Detail Modal */}
        {selectedClinic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedClinic.name}</h2>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state} - {selectedClinic.pincode}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClinic(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-600 mr-3" />
                        <span>{selectedClinic.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-3" />
                        <span>{selectedClinic.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-600 mr-3" />
                        <span>{selectedClinic.availableHours.open} - {selectedClinic.availableHours.close}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedClinic.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClinic.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <Stethoscope className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Working Days</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <span
                        key={day}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedClinic.availableHours.days.includes(day)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                    Book Appointment
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Navigation className="h-5 w-5 mr-2" />
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};