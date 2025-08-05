import React from 'react';
import { useFarmDashboard, useWeatherAlerts } from '../features/farmers/useFarmers';
import { Sprout, MapPin, CloudRain, AlertTriangle,Ruler } from 'lucide-react';

export default function Dashboard() {
  const { landPlans, cropPlans, dashboardStats, isLoading } = useFarmDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your land and crop plans, and stay updated with weather alerts.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Lands" value={dashboardStats.totalLands} icon={MapPin} />
          <StatCard title="Total Crops" value={dashboardStats.totalCrops} icon={Sprout} />
          <StatCard title="Active Crops" value={dashboardStats.activeCrops} icon={Sprout} />
          <StatCard title="Total Area" value={`${dashboardStats.totalArea} acres`} icon={Ruler} />
        </div>

        {/* Crop Plans with Weather Alerts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your Crop Plans</h2>
          {cropPlans?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <p className="text-gray-600">No crop plans yet. Start by creating a new plan!</p>
              <button
                onClick={() => window.location.href = '/planner'}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Create New Plan
              </button>
            </div>
          ) : (
            cropPlans?.map((cropPlan) => (
              <CropPlanCard key={cropPlan.id} cropPlan={cropPlan} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4">
      <div className="p-3 bg-green-100 rounded-lg">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function CropPlanCard({ cropPlan }) {
  const { data: weatherAlerts, isLoading: alertsLoading } = useWeatherAlerts(cropPlan);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sprout className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900">{cropPlan.crop_name}</h3>
        </div>
        <div className="text-sm text-gray-600">
          {cropPlan.season} | {new Date(cropPlan.start_date).toLocaleDateString()} - {new Date(cropPlan.end_date).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Land</div>
          <div className="font-medium">{cropPlan.land_plans.land_name} ({cropPlan.land_plans.land_area} acres)</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Region</div>
          <div className="font-medium">{cropPlan.land_plans.region}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Soil Type</div>
          <div className="font-medium">{cropPlan.land_plans.soil_type}</div>
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-blue-600" />
          Weather Alerts
        </h4>
        {alertsLoading ? (
          <div className="text-center py-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 mt-2">Loading weather alerts...</p>
          </div>
        ) : weatherAlerts?.alerts?.length > 0 ? (
          <div className="space-y-3">
            {weatherAlerts.alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === 'High' ? 'text-red-600' :
                  alert.severity === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                }`} />
                <div>
                  <div className="font-medium text-gray-900">
                    {alert.event} ({alert.severity}) - {new Date(alert.date).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Recommendation:</span> {alert.recommendation}</p>
                </div>
              </div>
            ))}
            {weatherAlerts.general_advice && (
              <p className="text-sm text-gray-600 mt-2">{weatherAlerts.general_advice}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No weather alerts for this crop plan.</p>
        )}
      </div>
    </div>
  );
}