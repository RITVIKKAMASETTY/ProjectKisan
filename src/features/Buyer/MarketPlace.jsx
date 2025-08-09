import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { browseCrops } from '../../api/buyer';
import { useUser } from '../auth/useUser';
import { useDarkMode } from '../../contexts/DarkModeContext';
import supabase from '../../api/supabase';

export default function Marketplace() {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const farmerId = searchParams.get('farmer_id');
  const [filters, setFilters] = useState({ district: '', crop_name: '' });

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['marketplace', filters, farmerId],
    queryFn: () => browseCrops({ ...filters, farmer_id: farmerId }),
  });

  const { data: farmerProfile, isLoading: farmerLoading } = useQuery({
    queryKey: ['farmer', farmerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('name, location, profile_data')
        .eq('id', farmerId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!farmerId,
  });

  const { mutate: saveListingMutation, isLoading: saveLoading } = useMutation({
    mutationFn: ({ listing_id }) =>
      supabase.from('activity_logs').insert({
        user_id: user.id,
        action: `Saved listing ${listing_id}`,
        timestamp: new Date().toISOString(),
      }),
    onSuccess: () => {
      toast.success('Listing saved!');
      queryClient.invalidateQueries(['savedListings']);
    },
    onError: (error) => toast.error(`Failed to save listing: ${error.message}`),
  });

  const { data: savedListings, isLoading: savedLoading } = useQuery({
    queryKey: ['savedListings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .ilike('action', 'Saved listing%');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSaveListing = (listing_id) => {
    saveListingMutation({ listing_id });
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <p className="text-center text-red-500 pt-8">This page is only for buyers</p>
      </div>
    );
  }

  if (isLoading || farmerLoading || savedLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <p className="text-center pt-8">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <p className="text-center text-red-500 pt-8">{error.message}</p>
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
          <button
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
          </button>
        </div>

        {farmerId && farmerProfile ? (
          <div className="mb-6">
            <div className={`p-6 rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="text-xl font-semibold mb-4">Farmer Profile</h3>
              <div className="space-y-2 mb-4">
                <p><span className="font-medium">Name:</span> {farmerProfile.name}</p>
                <p><span className="font-medium">Location:</span> {farmerProfile.location?.district}, {farmerProfile.location?.state}</p>
              </div>
              <h4 className="text-lg font-medium mb-3">Current Listings</h4>
              {listings.length ? (
                <ul className="space-y-2 mb-4">
                  {listings.map(listing => (
                    <li key={listing.id} className={`p-3 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      {listing.crop_name} - {listing.quantity} units at ₹{listing.price_per_unit}/unit
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No listings by this farmer.
                </p>
              )}
              <button
                onClick={() => navigate('/buyer/marketplace')}
                className={`px-4 py-2 rounded transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filters Section */}
            <div className="mb-6">
              <div className={`p-6 rounded-lg shadow-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className="text-xl font-semibold mb-4">Filter Crops</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`} htmlFor="district">
                      District
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={filters.district}
                      onChange={handleFilterChange}
                      className={`w-full p-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter district (optional)"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`} htmlFor="crop_name">
                      Crop Name
                    </label>
                    <input
                      type="text"
                      id="crop_name"
                      name="crop_name"
                      value={filters.crop_name}
                      onChange={handleFilterChange}
                      className={`w-full p-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter crop name (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Section */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Available Listings</h3>
              {listings.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className={`p-4 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="space-y-2 mb-4">
                        <p className="font-semibold text-lg">{listing.crop_name}</p>
                        <p><span className="font-medium">Quantity:</span> {listing.quantity} units</p>
                        <p><span className="font-medium">Price:</span> ₹{listing.price_per_unit}/unit</p>
                        <p><span className="font-medium">Location:</span> {listing.location.district}, {listing.location.state}</p>
                        <p><span className="font-medium">Farmer:</span> {listing.users.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/buyer/marketplace?farmer_id=${listing.user_id}`)}
                          className={`px-3 py-1 rounded transition-colors duration-200 ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' 
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                          }`}
                        >
                          View Farmer
                        </button>
                        <button
                          onClick={() => handleSaveListing(listing.id)}
                          disabled={saveLoading}
                          className={`px-3 py-1 rounded transition-colors duration-200 disabled:opacity-50 ${
                            isDarkMode 
                              ? 'text-green-400 hover:text-green-300 hover:bg-gray-700 disabled:text-gray-500' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50 disabled:text-gray-400'
                          }`}
                        >
                          {saveLoading ? 'Saving...' : 'Save Listing'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center rounded-lg ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-600'
                }`}>
                  <p>No listings available.</p>
                </div>
              )}
            </div>

            {/* Saved Listings Section */}
            <div>
              <div className={`p-6 rounded-lg shadow-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <h3 className="text-xl font-semibold mb-4">Saved Listings</h3>
                {savedListings?.length ? (
                  <ul className="space-y-2">
                    {savedListings.map((log, index) => (
                      <li key={index} className={`p-2 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        {log.action}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No saved listings.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}