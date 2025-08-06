import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import AppLayout from "./ui/AppLayout";
import Loginform from "./features/auth/Loginform";
import Signupform from "./features/auth/Signupform";
import ProtectedRoute from "./ui/ProtectedRoute";
import SmartKrishiLanding from "./ui/SmartKrishiLanding";
import DashBoard from "./ui/DashBoard";
import "./App.css";
import CropLandPlanner from "./features/farmers/CropLandPlanner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

// Debug component to log current route
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log("🔍 Current route:", location.pathname);
    console.log("🔍 Current search:", location.search);
    console.log("🔍 Current hash:", location.hash);
  }, [location]);

  return null;
}

function App() {
  console.log("🚀 App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <RouteDebugger />
        <Routes>
          {/* Public Routes - These should render without any authentication checks */}
          <Route 
            path="/" 
            element={
              <div>
                <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '5px', fontSize: '12px' }}>
                  Landing Page Route Matched ✅
                </div>
                <SmartKrishiLanding />
              </div>
            } 
          />
          <Route path="/landing" element={<SmartKrishiLanding />} />
          <Route path="/login" element={<Loginform />} />
          <Route path="/signup" element={<Signupform />} />

          {/* Protected Routes - Only these should use ProtectedRoute */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="crop-planner" element={<CropLandPlanner />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Legacy redirect for old dashboard route */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

          {/* Catch-all redirect - this should be last */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;