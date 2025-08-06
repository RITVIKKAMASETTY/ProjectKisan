import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import AppLayout from "./ui/AppLayout";
import LoginForm from "./features/auth/Loginform";
import SignUpForm from "./features/auth/Signupform";
import ProtectedRoute from "./ui/ProtectedRoute";
import LandingPage from "./ui/LandingPage";
// import DashBoard from "./components/DashBoard";
// import CropLandPlanner from "./components/CropLandPlanner";
// import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route path="farmer/dashboard" element={<DashBoard role="farmer" />} />
            <Route path="buyer/dashboard" element={<DashBoard role="buyer" />} />
            <Route path="farmer/cropland" element={<CropLandPlanner />} /> */}
            {/* Placeholder for buyer-specific routes */}
            {/* <Route path="buyer/marketplace" element={<Marketplace />} /> */}
          </Route>

          {/* Catch-all redirect to login for unauthenticated users */}
          <Route path="*" element={<Navigate to="/login" replace />} />
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
            color: "#374151", // Tailwind gray-700
            border: "1px solid #e5e7eb", // Tailwind gray-200
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;