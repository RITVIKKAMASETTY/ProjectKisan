// components/planning/CropLandPlanner.jsx
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Droplets, Sprout, Brain, Calendar } from 'lucide-react';
import LandForm from './LandForm';
import CropSuggestions from './CropSuggestions';
import CropSelectionForm from './CropSelectionForm';
import { useCropSuggestions, useCreateLandPlan, useCreateCropPlan } from './useFarmers';

const PLANNING_STEPS = {
  LAND_DETAILS: 'land_details',
  AI_SUGGESTIONS: 'ai_suggestions',
  CROP_SELECTION: 'crop_selection',
  CONFIRMATION: 'confirmation'
};

export default function CropLandPlanner({ onBack, onComplete }) {
  const [currentStep, setCurrentStep] = useState(PLANNING_STEPS.LAND_DETAILS);
  const [landData, setLandData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const cropSuggestionsMutation = useCropSuggestions();
  const createLandMutation = useCreateLandPlan();
  const createCropMutation = useCreateCropPlan();

  const handleLandSubmit = async (formData) => {
    setLandData(formData);
    setCurrentStep(PLANNING_STEPS.AI_SUGGESTIONS);
    
    // Get AI suggestions
    try {
      const suggestions = await cropSuggestionsMutation.mutateAsync(formData);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get crop suggestions:', error);
    }
  };

  const handleCropSelection = (crop) => {
    setSelectedCrop(crop);
    setCurrentStep(PLANNING_STEPS.CROP_SELECTION);
  };

  const handleFinalSubmit = async (cropDetails) => {
    try {
      // Create land plan first
      const landPlan = await createLandMutation.mutateAsync(landData);
      
      // Create crop plan
      const cropPlan = await createCropMutation.mutateAsync({
        land_id: landPlan.id,
        crop_name: selectedCrop.crop,
        season: cropDetails.season,
        start_date: cropDetails.start_date,
        end_date: cropDetails.end_date,
        recommendation_notes: JSON.stringify({
          ai_suggestions: selectedCrop,
          general_recommendations: aiSuggestions?.general_recommendations,
          weather_considerations: aiSuggestions?.weather_considerations
        })
      });

      setCurrentStep(PLANNING_STEPS.CONFIRMATION);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        onComplete?.();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save planning data:', error);
      alert('Failed to save your plan. Please try again.');
    }
  };

  const stepConfig = {
    [PLANNING_STEPS.LAND_DETAILS]: {
      title: 'Land Details',
      subtitle: 'Tell us about your farmland',
      icon: MapPin,
      progress: 25
    },
    [PLANNING_STEPS.AI_SUGGESTIONS]: {
      title: 'AI Crop Suggestions',
      subtitle: 'Our AI recommends these crops for your land',
      icon: Brain,
      progress: 50
    },
    [PLANNING_STEPS.CROP_SELECTION]: {
      title: 'Crop Planning',
      subtitle: 'Plan your selected crop timeline',
      icon: Calendar,
      progress: 75
    },
    [PLANNING_STEPS.CONFIRMATION]: {
      title: 'Plan Created!',
      subtitle: 'Your crop and land plan has been saved',
      icon: Sprout,
      progress: 100
    }
  };

  const currentConfig = stepConfig[currentStep];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconComponent className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentConfig.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentConfig.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{currentConfig.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentConfig.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === PLANNING_STEPS.LAND_DETAILS && (
          <LandForm 
            onSubmit={handleLandSubmit}
            isLoading={cropSuggestionsMutation.isPending}
          />
        )}

        {currentStep === PLANNING_STEPS.AI_SUGGESTIONS && (
          <CropSuggestions
            suggestions={aiSuggestions}
            landData={landData}
            onSelectCrop={handleCropSelection}
            isLoading={cropSuggestionsMutation.isPending}
            onBack={() => setCurrentStep(PLANNING_STEPS.LAND_DETAILS)}
          />
        )}

        {currentStep === PLANNING_STEPS.CROP_SELECTION && (
          <CropSelectionForm
            selectedCrop={selectedCrop}
            landData={landData}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(PLANNING_STEPS.AI_SUGGESTIONS)}
            isLoading={createLandMutation.isPending || createCropMutation.isPending}
          />
        )}

        {currentStep === PLANNING_STEPS.CONFIRMATION && (
          <ConfirmationScreen
            landData={landData}
            cropData={selectedCrop}
            onDashboard={onComplete}
          />
        )}
      </div>
    </div>
  );
}

// Confirmation Screen Component
function ConfirmationScreen({ landData, cropData, onDashboard }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sprout className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🎉 Plan Created Successfully!
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm border max-w-md mx-auto p-6 mb-8">
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Land:</span>
            <span className="font-medium">{landData?.land_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Area:</span>
            <span className="font-medium">{landData?.land_area} acres</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Crop:</span>
            <span className="font-medium">{cropData?.crop}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Season:</span>
            <span className="font-medium">{cropData?.sow_from} - {cropData?.sow_to}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Your crop and land plan has been saved. You can now monitor weather alerts and track your crop progress from the dashboard.
      </p>

      <button
        onClick={onDashboard}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
      >
        Go to Dashboard
      </button>
    </div>
  );
}