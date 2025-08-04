// ui/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking on mobile backdrop
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div onClick={closeSidebar}>
          <Sidebar isOpen={isSidebarOpen} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          
          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 min-h-96 p-6 md:p-8">
                {/* This is where different page content will be rendered */}
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};export default AppLayout;