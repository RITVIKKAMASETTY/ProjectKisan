// components/planning/CropSuggestions.jsx
import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Droplets, 
  DollarSign, 
  Award,
  ChevronLeft,
  Sprout,
  Sun,
  CloudRain,
  Thermometer
} from 'lucide-react';

export default function CropSuggestions({ 
  suggestions, 
  landData, 
  onSelectCrop, 
  isLoading, 
  onBack 
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!suggestions) {
    return <ErrorState onRetry={onBack} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🤖 AI Recommendations for Your Land
        </h2>
        <p className="text-gray-600">
          Based on your {landData?.soil_type} soil in {landData?.region}
        </p>
      </div>

      {/* Land Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Your Land Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Area</div>
            <div className="font-semibold text-gray-900">{landData?.land_area} acres</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Soil</div>
            <div className="font-semibold text-gray-900">{landData?.soil_type}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Region</div>
            <div className="font-semibold text-gray-900">{landData?.region}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Water</div>
            <div className="font-semibold text-gray-900">{landData?.water_source}</div>
          </div>
        </div>
      </div>

      {/* Crop Suggestions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          🌱 Top Crop Recommendations
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suggestions.suggested_crops?.map((crop, index) => (
            <CropCard
              key={index}
              crop={crop}
              rank={index + 1}
              onSelect={() => onSelectCrop(crop)}
            />
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      {suggestions.general_recommendations && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            General Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Best Season</h4>
              <p className="text-gray-600 text-sm">
                {suggestions.general_recommendations.best_season}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Soil Preparation</h4>
              <p className="text-gray-600 text-sm">
                {suggestions.general_recommendations.soil_preparation}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Irrigation Tips</h4>
              <p className="text-gray-600 text-sm">
                {suggestions.general_recommendations.irrigation_tips}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pest Control</h4>
              <p className="text-gray-600 text-sm">
                {suggestions.general_recommendations.pest_control}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weather Considerations */}
      {suggestions.weather_considerations && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            Weather Considerations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Thermometer className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-medium text-gray-900">Temperature</div>
                <div className="text-sm text-gray-600">
                  {suggestions.weather_considerations.ideal_temperature}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <CloudRain className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900">Rainfall</div>
                <div className="text-sm text-gray-600">
                  {suggestions.weather_considerations.rainfall_needed}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Sun className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium text-gray-900">Critical Periods</div>
                <div className="text-sm text-gray-600">
                  {suggestions.weather_considerations.critical_growth_periods?.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Modify Land Details
        </button>
      </div>
    </div>
  );
}

// Individual Crop Card Component
function CropCard({ crop, rank, onSelect }) {
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🌱';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all group">
      <div className="p-6">
        {/* Rank Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRankColor(rank)}`}>
            {getRankEmoji(rank)} Rank #{rank}
          </div>
          {crop.suitability_score && (
            <div className="text-sm text-gray-600">
              {crop.suitability_score}% match
            </div>
          )}
        </div>

        {/* Crop Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-green-600" />
          {crop.crop}
        </h3>

        {/* Key Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Sowing:</span>
            <span className="font-medium">{crop.sow_from} - {crop.sow_to}</span>
          </div>
          
          {crop.harvest_time && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Harvest:</span>
              <span className="font-medium">{crop.harvest_time}</span>
            </div>
          )}

          {crop.expected_yield && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">Yield:</span>
              <span className="font-medium">{crop.expected_yield}</span>
            </div>
          )}

          {crop.market_price && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">{crop.market_price}</span>
            </div>
          )}

          {crop.water_requirement && (
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Water:</span>
              <span className="font-medium">{crop.water_requirement}</span>
            </div>
          )}
        </div>

        {/* Reasons */}
        {crop.reasons && crop.reasons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Why this crop?</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {crop.reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-500 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Select Button */}
        <button
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all group-hover:scale-[1.02]"
        >
          Select {crop.crop}
        </button>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🤖 AI is analyzing your land...
      </h2>
      <div className="max-w-md mx-auto">
        <div className="space-y-3">
          {[
            'Analyzing soil composition...',
            'Checking weather patterns...',
            'Evaluating crop suitability...',
            'Calculating yield predictions...'
          ].map((text, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Unable to get AI suggestions
      </h2>
      <p className="text-gray-600 mb-6">
        There was an issue connecting to our AI service. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
      >
        Try Again
      </button>
    </div>
  );
}