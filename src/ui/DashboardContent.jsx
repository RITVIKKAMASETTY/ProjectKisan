import React from 'react';
import { FiCloud, FiTrendingUp, FiUsers, FiActivity } from 'react-icons/fi';
import { IoLeafOutline } from 'react-icons/io5';

const DashboardContent = () => {
  const features = [
    {
      icon: FiCloud,
      title: 'Weather Insights',
      description: 'Real-time weather data and forecasts for better crop planning and decision making.',
      color: 'blue'
    },
    {
      icon: FiTrendingUp,
      title: 'Market Analysis',
      description: 'Track crop prices, market trends, and get insights on the best selling opportunities.',
      color: 'green'
    },
    {
      icon: FiUsers,
      title: 'Community Hub',
      description: 'Connect with fellow farmers, share knowledge, and learn from experienced growers.',
      color: 'purple'
    }
  ];

  const stats = [
    { label: 'Active Crops', value: '12', change: '+2 this month' },
    { label: 'Weather Alerts', value: '3', change: 'This week' },
    { label: 'Market Updates', value: '8', change: 'Today' },
    { label: 'Community Posts', value: '24', change: 'This week' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <IoLeafOutline className="text-green-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to FarmWise
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Your intelligent farming companion. Monitor crops, track weather, analyze market trends, 
          and connect with the farming community - all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <FiActivity className="text-gray-400" size={20} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const colorClasses = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            green: 'bg-green-50 border-green-200 text-green-600',
            purple: 'bg-purple-50 border-purple-200 text-purple-600'
          };
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${colorClasses[feature.color]}`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
            Add New Crop
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Check Weather
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            View Market Prices
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
            Join Discussion
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;