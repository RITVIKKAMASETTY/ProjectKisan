// components/planning/LandForm.jsx
import React, { useState } from 'react';
import { MapPin, Droplets, Mountain, CloudRain, Ruler } from 'lucide-react';

const SOIL_TYPES = [
  { value: 'Loamy', label: 'Loamy Soil', description: 'Best for most crops' },
  { value: 'Clay', label: 'Clay Soil', description: 'Good for rice, wheat' },
  { value: 'Sandy', label: 'Sandy Soil', description: 'Good drainage, needs more water' },
  { value: 'Silt', label: 'Silt Soil', description: 'Fertile, retains moisture' },
  { value: 'Red', label: 'Red Soil', description: 'Good for cotton, sugarcane' },
  { value: 'Black', label: 'Black Soil', description: 'Excellent for cotton' },
  { value: 'Alluvial', label: 'Alluvial Soil', description: 'Very fertile, good for cereals' }
];

const WATER_SOURCES = [
  { value: 'Well', label: 'Bore Well', icon: '🕳️' },
  { value: 'Canal', label: 'Canal Water', icon: '🌊' },
  { value: 'River', label: 'River Water', icon: '🏞️' },
  { value: 'Rainwater', label: 'Rainwater Only', icon: '🌧️' },
  { value: 'Tank', label: 'Water Tank', icon: '💧' },
  { value: 'Mixed', label: 'Multiple Sources', icon: '🔄' }
];

const INDIAN_REGIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function LandForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    land_name: '',
    soil_type: '',
    land_area: '',
    region: '',
    water_source: '',
    rainfall: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.land_name.trim()) {
      newErrors.land_name = 'Land name is required';
    }

    if (!formData.soil_type) {
      newErrors.soil_type = 'Please select soil type';
    }

    if (!formData.land_area || formData.land_area <= 0) {
      newErrors.land_area = 'Please enter valid land area';
    } else if (formData.land_area > 1000) {
      newErrors.land_area = 'Land area seems too large. Please verify.';
    }

    if (!formData.region) {
      newErrors.region = 'Please select your region';
    }

    if (!formData.water_source) {
      newErrors.water_source = 'Please select water source';
    }

    if (formData.rainfall && (formData.rainfall < 0 || formData.rainfall > 5000)) {
      newErrors.rainfall = 'Please enter valid rainfall (0-5000mm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        land_area: parseFloat(formData.land_area),
        rainfall: formData.rainfall ? parseFloat(formData.rainfall) : null
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tell us about your farmland
          </h2>
          <p className="text-gray-600">
            We'll help you find the perfect crops for your land
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Land Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mountain className="w-4 h-4 inline mr-2" />
              Land Name *
            </label>
            <input
              type="text"
              value={formData.land_name}
              onChange={(e) => handleInputChange('land_name', e.target.value)}
              placeholder="e.g., North Field, Main Farm"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.land_name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.land_name && (
              <p className="mt-1 text-sm text-red-600">{errors.land_name}</p>
            )}
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soil Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SOIL_TYPES.map((soil) => (
                <button
                  key={soil.value}
                  type="button"
                  onClick={() => handleInputChange('soil_type', soil.value)}
                  className={`p-4 text-left border rounded-lg transition-all hover:shadow-sm ${
                    formData.soil_type === soil.value
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{soil.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{soil.description}</div>
                </button>
              ))}
            </div>
            {errors.soil_type && (
              <p className="mt-1 text-sm text-red-600">{errors.soil_type}</p>
            )}
          </div>

          {/* Land Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="w-4 h-4 inline mr-2" />
              Land Area (in acres) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="1000"
              value={formData.land_area}
              onChange={(e) => handleInputChange('land_area', e.target.value)}
              placeholder="e.g., 2.5"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.land_area ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.land_area && (
              <p className="mt-1 text-sm text-red-600">{errors.land_area}</p>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Region/State *
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.region ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select your state</option>
              {INDIAN_REGIONS.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-red-600">{errors.region}</p>
            )}
          </div>

          {/* Water Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Droplets className="w-4 h-4 inline mr-2" />
              Primary Water Source *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {WATER_SOURCES.map((source) => (
                <button
                  key={source.value}
                  type="button"
                  onClick={() => handleInputChange('water_source', source.value)}
                  className={`p-3 text-center border rounded-lg transition-all hover:shadow-sm ${
                    formData.water_source === source.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{source.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{source.label}</div>
                </button>
              ))}
            </div>
            {errors.water_source && (
              <p className="mt-1 text-sm text-red-600">{errors.water_source}</p>
            )}
          </div>

          {/* Rainfall (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CloudRain className="w-4 h-4 inline mr-2" />
              Average Annual Rainfall (mm) - Optional
            </label>
            <input
              type="number"
              min="0"
              max="5000"
              value={formData.rainfall}
              onChange={(e) => handleInputChange('rainfall', e.target.value)}
              placeholder="e.g., 800 (leave empty if unknown)"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.rainfall ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.rainfall && (
              <p className="mt-1 text-sm text-red-600">{errors.rainfall}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Our AI will use local weather data if you leave this empty
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Getting AI Suggestions...
                </>
              ) : (
                <>
                  <Droplets className="w-5 h-5" />
                  Get Crop Suggestions
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}