import React, { useState, useEffect } from 'react';
import { Calendar, Sprout, ChevronLeft, Save, Info } from 'lucide-react';

const SEASONS = [
  { value: 'Kharif', label: 'Kharif (Monsoon)', months: 'June - October', description: 'Monsoon crops' },
  { value: 'Rabi', label: 'Rabi (Winter)', months: 'November - April', description: 'Winter crops' },
  { value: 'Zaid', label: 'Zaid (Summer)', months: 'April - June', description: 'Summer crops' },
  { value: 'Perennial', label: 'Perennial', months: 'Year-round', description: 'Long-term crops' }
];

export default function CropSelectionForm({ 
  selectedCrop, 
  landData, 
  onSubmit, 
  onBack, 
  isLoading 
}) {
  const [formData, setFormData] = useState({
    season: '',
    start_date: '',
    end_date: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Auto-populate season based on crop sowing months
  useEffect(() => {
    if (selectedCrop?.sow_from) {
      const suitableSeason = getSuitableSeason(selectedCrop.sow_from);
      setFormData(prev => ({ ...prev, season: suitableSeason }));
    }
  }, [selectedCrop]);

  const getSuitableSeason = (sowMonth) => {
    const month = sowMonth.toLowerCase();
    if (['june', 'july', 'august', 'september'].includes(month)) return 'Kharif';
    if (['november', 'december', 'january', 'february'].includes(month)) return 'Rabi';
    if (['march', 'april', 'may'].includes(month)) return 'Zaid';
    return 'Perennial';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.season) {
      newErrors.season = 'Please select a season';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Please select a start date';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Please select an end date';
    } else if (formData.start_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Plan Your {selectedCrop?.crop} Crop
          </h2>
          <p className="text-gray-600">
            Set the timeline for your crop on {landData?.land_name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              Selected Crop: {selectedCrop?.crop}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Sowing Window:</span>
                <span className="font-medium ml-1">{selectedCrop?.sow_from} - {selectedCrop?.sow_to}</span>
              </div>
              {selectedCrop?.harvest_time && (
                <div>
                  <span className="text-gray-600">Harvest Time:</span>
                  <span className="font-medium ml-1">{selectedCrop?.harvest_time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map((season) => (
                <button
                  key={season.value}
                  type="button"
                  onClick={() => handleInputChange('season', season.value)}
                  className={`p-4 text-left border rounded-lg transition-all hover:shadow-sm ${
                    formData.season === season.value
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{season.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{season.description} ({season.months})</div>
                </button>
              ))}
            </div>
            {errors.season && (
              <p className="mt-1 text-sm text-red-600">{errors.season}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date *
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.start_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              End Date *
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.end_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Info className="w-4 h-4 inline mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about your crop plan..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors border-gray-300"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Plan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}