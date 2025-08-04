import React, { useState } from 'react';
import {
  FiHome,
  FiCloud,
  FiTrendingUp,
  FiPackage,
  FiUsers,
  FiSettings,
  FiHelpCircle,
} from 'react-icons/fi';
import { MdAgriculture, MdOutlineDashboard } from 'react-icons/md';
import { TbPlant } from 'react-icons/tb';
import { GiFarmTractor, GiFruitBowl } from 'react-icons/gi';
import { IoLeafOutline } from 'react-icons/io5';

const Sidebar = ({ isOpen }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdOutlineDashboard },
    { id: 'crops', label: 'Crop Planner', icon: TbPlant },
    { id: 'recommendation', label: 'Crop Recommendation', icon: MdAgriculture },
    { id: 'weather', label: 'Weather Alerts', icon: FiCloud },
    { id: 'market', label: 'Market Prices', icon: FiTrendingUp },
    { id: 'inventory', label: 'Inventory', icon: FiPackage },
    { id: 'community', label: 'Farmer Network', icon: FiUsers },
    { id: 'scheme', label: 'Govt. Schemes', icon: GiFarmTractor },
    { id: 'organic', label: 'Organic Tips', icon: GiFruitBowl },
    { id: 'settings', label: 'Settings', icon: FiSettings },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle },
  ];

  return (
    <>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64
        bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <IoLeafOutline className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Project Kisan</h1>
              <p className="text-sm text-gray-500">Empowering Farmers</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 text-left text-sm font-medium
                  ${isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Upgrade Box */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <FiTrendingUp className="text-green-600" size={18} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">
              Upgrade to Pro
            </h3>
            <p className="text-xs text-gray-500 text-center mb-3">
              Unlock advanced AI planning & market tools
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
