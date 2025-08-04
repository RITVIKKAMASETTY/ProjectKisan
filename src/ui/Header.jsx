import React from 'react';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';
const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-4 py-2.5 min-w-80 border border-gray-200">
            <FiSearch className="text-gray-400 mr-3" size={18} />
            <input
              type="text"
              placeholder="Search crops, weather, market prices..."
              className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center space-x-3">
          <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
            <FiBell className="text-gray-600" size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <FiUser className="text-gray-600" size={16} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">John Farmer</p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
          </div>
          
          <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <FiLogOut className="text-gray-600" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;