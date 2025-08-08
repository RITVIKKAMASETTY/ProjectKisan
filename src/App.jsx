// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { Toaster } from "react-hot-toast";

// import AppLayout from "./ui/AppLayout";
// import LoginForm from "./features/auth/Loginform";
// import SignUpForm from "./features/auth/Signupform";
// // import ProfileUpdateForm from "./features/auth/ProfileUpdateForm";
// import ProtectedRoute from "./ui/ProtectedRoute";
// import LandingPage from "./ui/LandingPage";
// import DashBoard from "./ui/DashBoard";
// import CropLandPlanner from "./features/farmers/CropLandPlanner";
// import CropMonitor from "./features/farmers/CropMonitor";
// import Marketplace from "./features/Buyer/MarketPlace";
// import CropRecommendation from "./features/farmers/CropRecommendation";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 0,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/signup" element={<SignUpForm />} />
          
//           {/* Protected Routes */}
//           <Route
//             element={
//               <ProtectedRoute>
//                 <AppLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* Farmer Routes */}
//             <Route path="farmer/dashboard" element={<DashBoard role="farmer" />} />
//             <Route path="farmer/cropland" element={<CropLandPlanner />} />
//             <Route path="farmer/monitor" element={<CropRecommendation/>} />
//             {/* <Route path="farmer/profile" element={<ProfileUpdateForm />} /> */}
            
//             {/* Buyer Routes */}
//             <Route path="buyer/dashboard" element={<DashBoard role="buyer" />} />
//             <Route path="buyer/marketplace" element={<Marketplace />} />
//           </Route>

//           {/* Catch-all redirect to login for unauthenticated users */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </BrowserRouter>

//       <Toaster
//         position="top-center"
//         gutter={12}
//         containerStyle={{ margin: "8px" }}
//         toastOptions={{
//           success: {
//             duration: 3000,
//           },
//           error: {
//             duration: 5000,
//           },
//           style: {
//             fontSize: "16px",
//             maxWidth: "500px",
//             padding: "16px 24px",
//             backgroundColor: "white",
//             color: "#374151", // Tailwind gray-700
//             border: "1px solid #e5e7eb", // Tailwind gray-200
//           },
//         }}
//       />
//     </QueryClientProvider>
//   );
// }

// export default App;
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from "./features/auth/useAuth";
import AuthForm from "./ui/AuthForm"
import LandRegistration from "./ui/LandRegistration";
import CropRecommendation from "./ui/CropRecommendation";
import PlantingForm from "./ui/PlantingForm";
import CropLifecycle from "./ui/CropLifecycle";
import ReadyToSell from "./ui/ReadytoSell"
import MarketplaceListingForm from  "./ui/MarketPalceListingForm"
import Marketplace from "./ui/MarketPlace.jsx";

const queryClient = new QueryClient();

export default function App() {
  const { user, isUserLoading, logout } = useAuth();

  if (isUserLoading) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-blue-500 p-4 text-white">
            <div className="max-w-4xl mx-auto flex justify-between">
              <div className="space-x-4">
                {user ? (
                  <>
                    <Link to="/lands">Register Land</Link>
                    <Link to="/recommend">Crop Recommendation</Link>
                    <Link to="/plantings">Add Planting</Link>
                    <Link to="/dashboard">Crop Dashboard</Link>
                    <Link to="/sell">Ready to Sell</Link>
                    <Link to="/marketplace">Marketplace</Link>
                    <button onClick={() => logout()}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                  </>
                )}
              </div>
              {user && <span>Welcome, {user.user_metadata.name}</span>}
            </div>
          </nav>
          <Routes>
            <Route path="/login" element={<AuthForm />} />
            <Route path="/signup" element={<AuthForm isSignup />} />
            <Route path="/lands" element={<LandRegistration farmerId={user?.id} />} />
            <Route path="/recommend" element={<CropRecommendation farmerId={user?.id} />} />
            <Route path="/plantings" element={<PlantingForm farmerId={user?.id} />} />
            <Route path="/dashboard" element={<CropLifecycle farmerId={user?.id} />} />
            <Route path="/sell" element={<ReadyToSell farmerId={user?.id} />} />
            <Route path="/marketplace" element={<Marketplace farmerId={user?.id} />} />
            <Route path="/marketplace/create/:plantingId" element={<MarketplaceListingForm farmerId={user?.id} />} />
            <Route path="/" element={<div className="p-4">Welcome to Farm Management System</div>} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}