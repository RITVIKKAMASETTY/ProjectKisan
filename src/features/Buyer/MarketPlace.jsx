import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { browseCrops } from '../../api/buyer';
import { useUser } from '../auth/useUser';
import supabase from '../../api/supabase';

export default function Marketplace() {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    return <p className="text-center text-red-500">This page is only for buyers</p>;
  }

  if (isLoading || farmerLoading || savedLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
      {farmerId && farmerProfile ? (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Farmer Profile</h3>
          <p>Name: {farmerProfile.name}</p>
          <p>Location: {farmerProfile.location?.district}, {farmerProfile.location?.state}</p>
          <h4 className="text-lg font-medium mt-4">Current Listings</h4>
          {listings.length ? (
            <ul className="list-disc pl-5">
              {listings.map(listing => (
                <li key={listing.id}>
                  {listing.crop_name} - {listing.quantity} units at ₹{listing.price_per_unit}/unit
                </li>
              ))}
            </ul>
          ) : (
            <p>No listings by this farmer.</p>
          )}
          <button
            onClick={() => navigate('/buyer/marketplace')}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Marketplace
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Filter Crops</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="district">District</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter district (optional)"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="crop_name">Crop Name</label>
                <input
                  type="text"
                  id="crop_name"
                  name="crop_name"
                  value={filters.crop_name}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter crop name (optional)"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Available Listings</h3>
            {listings.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-4 border rounded shadow">
                    <p>{listing.crop_name} - {listing.quantity} units at ₹{listing.price_per_unit}/unit</p>
                    <p>Location: {listing.location.district}, {listing.location.state}</p>
                    <p>Farmer: {listing.users.name}</p>
                    <button
                      onClick={() => navigate(`/buyer/marketplace?farmer_id=${listing.user_id}`)}
                      className="mr-2 text-blue-500 hover:underline"
                    >
                      View Farmer
                    </button>
                    <button
                      onClick={() => handleSaveListing(listing.id)}
                      disabled={saveLoading}
                      className="text-blue-500 hover:underline"
                    >
                      Save Listing
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No listings available.</p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Saved Listings</h3>
            {savedListings?.length ? (
              <ul className="list-disc pl-5">
                {savedListings.map((log, index) => (
                  <li key={index}>{log.action}</li>
                ))}
              </ul>
            ) : (
              <p>No saved listings.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}