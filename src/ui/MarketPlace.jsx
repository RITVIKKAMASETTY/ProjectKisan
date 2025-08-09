// import {useMarketplace} from "../features/farmers/useMarketPlace.js";
// export default function Marketplace({ farmerId }) {
//   const { listings, isListingsLoading, farmerListings, isFarmerListingsLoading, updateListingStatus } = useMarketplace(farmerId);
// console.log(listings);
//   const handleStatusChange = async (listingId, status) => {
//     try {
//       await updateListingStatus({ listingId, status, farmerId });
//     } catch (err) {
//       console.error('Update listing status failed:', err.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-xl mb-4">Marketplace</h2>
//       <h3 className="text-lg mb-2">Your Listings</h3>
//       {isFarmerListingsLoading ? (
//         <p>Loading...</p>
//       ) : farmerListings?.length === 0 ? (
//         <p>No listings</p>
//       ) : (
//         <div className="space-y-4 mb-8">
//           {farmerListings.map((listing) => (
//             <div key={listing.id} className="border p-4 rounded">
//               <p><strong>Title:</strong> {listing.title}</p>
//               <p><strong>Crop:</strong> {listing.plantings.crop_types.name}</p>
//               <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
//               <p><strong>Price:</strong> ${listing.price_per_unit}/unit</p>
//               <p><strong>Status:</strong> {listing.status}</p>
//               <select
//                 value={listing.status}
//                 onChange={(e) => handleStatusChange(listing.id, e.target.value)}
//                 className="p-2 border rounded"
//               >
//                 <option value="active">Active</option>
//                 <option value="sold">Sold</option>
//                 <option value="removed">Removed</option>
//               </select>
//             </div>
//           ))}
//         </div>
//       )}
//       <h3 className="text-lg mb-2">All Listings</h3>
//       {isListingsLoading ? (
//         <p>Loading...</p>
//       ) : listings?.length === 0 ? (
//         <p>No active listings</p>
//       ) : (
//         <div className="space-y-4">
//           {listings.map((listing) => (
//             <div key={listing.id} className="border p-4 rounded">
//               <p><strong>Title:</strong> {listing.title}</p>
//               <p><strong>Crop:</strong> {listing.plantings.crop_types.name}</p>
//               <p><strong>Farmer:</strong> {listing.farmers.name}</p>
//               <p><strong>phone number:</strong> {listing.farmers.phone}</p>
//               <p><strong>Location:</strong> {listing.plantings.lands.location}</p>
//               <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
//               <p><strong>Price:</strong> ${listing.price_per_unit}/unit</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { use, useEffect } from 'react';
import { useDarkMode } from '../../src/DarkModeContextProvider.jsx';
import { useMarketplace } from "../features/farmers/useMarketPlace.js";

export default function Marketplace({ farmerId }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    listings, 
    isListingsLoading, 
    farmerListings, 
    isFarmerListingsLoading, 
    updateListingStatus 
  } = useMarketplace(farmerId);
  
  console.log(listings);
  const handleStatusChange = async (listingId, status) => {
    try {
      await updateListingStatus({ listingId, status, farmerId });
    } catch (err) {
      console.error('Update listing status failed:', err.message);
    }
  };

  if (isFarmerListingsLoading || isListingsLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Marketplace</h2>
          {/* <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button> */}
        </div>

        {/* Your Listings Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Listings</h3>
          {farmerListings?.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-600'
            }`}>
              <p>No listings found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farmerListings?.map((listing) => (
                <div key={listing.id} className={`p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold">{listing.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : listing.status === 'sold'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <p><span className="font-medium">Crop:</span> {listing.plantings.crop_types.name}</p>
                      <p><span className="font-medium">Quantity:</span> {listing.quantity} {listing.unit}</p>
                      <p><span className="font-medium">Price:</span> ${listing.price_per_unit}/unit</p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <label className={`block mb-2 text-sm font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Update Status
                      </label>
                      <select
                        value={listing.status}
                        onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                        className={`w-full p-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700 border border-gray-600 text-white' 
                            : 'bg-white border border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="removed">Removed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Listings Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">All Listings</h3>
          {listings?.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-600'
            }`}>
              <p>No active listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings?.map((listing) => (
                <div key={listing.id} className={`p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">{listing.title}</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <p><span className="font-medium">Crop:</span> {listing.plantings.crop_types.name}</p>
                      <p><span className="font-medium">Farmer:</span> {listing.farmers.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Phone:</span>
                        <a 
                          href={`tel:${listing.farmers.phone}`}
                          className={`text-blue-500 hover:text-blue-600 transition-colors duration-200 ${
                            isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-700'
                          }`}
                        >
                          {listing.farmers.phone}
                        </a>
                      </div>
                      <p><span className="font-medium">Location:</span> {listing.plantings.lands.location}</p>
                      <p><span className="font-medium">Quantity:</span> {listing.quantity} {listing.unit}</p>
                      <p className="text-lg"><span className="font-medium">Price:</span> <span className="text-green-600 dark:text-green-400 font-semibold">${listing.price_per_unit}/unit</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}