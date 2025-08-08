import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getFarmerDashboard, createSellListing } from '../api/farmers';
import { getBuyerDashboard } from '../api/buyer';
import { useUser } from '../features/auth/useUser';
import supabase from '../api/supabase';

export default function DashBoard({ role }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sellData, setSellData] = useState({
    crop_id: '',
    crop_name: '',
    quantity: '',
    price_per_unit: '',
    location: { district: '', state: '' },
  });
  const [notes, setNotes] = useState({});

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard', role],
    queryFn: role === 'farmer' ? getFarmerDashboard : getBuyerDashboard,
  });

  const { data: issues, isLoading: issuesLoading } = useQuery({
    queryKey: ['issues', user?.id],
    queryFn: () => supabase.from('crop_support').select('*').eq('user_id', user.id),
    enabled: role === 'farmer' && !!user,
  });

  const { mutate: createSellListingMutation, isLoading: sellLoading } = useMutation({
    mutationFn: createSellListing,
    onSuccess: () => {
      toast.success('Sell listing created successfully!');
      queryClient.invalidateQueries(['dashboard', 'farmer']);
      setSellData({ crop_id: '', crop_name: '', quantity: '', price_per_unit: '', location: { district: '', state: '' } });
    },
    onError: (error) => toast.error(`Failed to create listing: ${error.message}`),
  });

  const { mutate: addNoteMutation, isLoading: noteLoading } = useMutation({
    mutationFn: ({ crop_id, note }) =>
      supabase.from('crops').update({ notes: [...(dashboardData.activeCrops.find(c => c.crop_id === crop_id).notes || []), note] }).eq('id', crop_id),
    onSuccess: () => {
      toast.success('Note added successfully!');
      queryClient.invalidateQueries(['dashboard', 'farmer']);
    },
    onError: (error) => toast.error(`Failed to add note: ${error.message}`),
  });

  const handleSellChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const key = name.split('.')[1];
      setSellData({
        ...sellData,
        location: { ...sellData.location, [key]: value },
      });
    } else {
      setSellData({ ...sellData, [name]: value });
    }
  };

  const handleSellSubmit = (e, crop_id, crop_name) => {
    e.preventDefault();
    if (!sellData.quantity || !sellData.price_per_unit) {
      toast.error('Please fill in all sell listing details');
      return;
    }
    createSellListingMutation({ ...sellData, crop_id, crop_name });
  };

  const handleNoteChange = (crop_id, value) => {
    setNotes({ ...notes, [crop_id]: value });
  };

  const handleNoteSubmit = (e, crop_id) => {
    e.preventDefault();
    if (!notes[crop_id]) {
      toast.error('Please enter a note');
      return;
    }
    addNoteMutation({ crop_id, note: { text: notes[crop_id], date: new Date().toISOString() } });
    setNotes({ ...notes, [crop_id]: '' });
  };

  if (!user || user.role !== role) {
    return <p className="text-center text-red-500">Unauthorized access</p>;
  }

  if (dashboardLoading || issuesLoading) return <p className="text-center">Loading...</p>;
  if (dashboardError) return <p className="text-center text-red-500">{dashboardError.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{role === 'farmer' ? 'Farmer Dashboard' : 'Buyer Dashboard'}</h2>
      {role === 'farmer' ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Active Crops</h3>
            {dashboardData.activeCrops.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.activeCrops.map((crop) => {
                  const cropIssues = issues?.filter(issue => issue.crop_id === crop.crop_id) || [];
                  return (
                    <div key={crop.crop_id} className="p-4 border rounded shadow">
                      <h4 className="text-lg font-medium">{crop.crop_name}</h4>
                      <p>Planted: {new Date(crop.planted_date).toLocaleDateString()}</p>
                      <p>Stage: {crop.stage}</p>
                      <p>Days Since Planting: {Math.floor((new Date() - new Date(crop.planted_date)) / (1000 * 60 * 60 * 24))}</p>
                      <p>Weather: {crop.weather.current.description} ({crop.weather.current.temperature}°C)</p>
                      <div className="mt-2">
                        <h5 className="font-medium">Alerts:</h5>
                        {crop.alerts.length ? (
                          <ul className="list-disc pl-5">
                            {crop.alerts.map((alert, index) => (
                              <li key={index}>{alert.message}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No alerts</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <h5 className="font-medium">Disease Reports:</h5>
                        {cropIssues.length ? (
                          <ul className="list-disc pl-5">
                            {cropIssues.map((issue, index) => (
                              <li key={index}>
                                {issue.description}
                                <ul className="list-circle pl-5">
                                  {issue.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No issues reported</p>
                        )}
                      </div>
                      <div className="mt-2">
                        <h5 className="font-medium">Notes:</h5>
                        {crop.notes.length ? (
                          <ul className="list-disc pl-5">
                            {crop.notes.map((note, index) => (
                              <li key={index}>{note.text} ({new Date(note.date).toLocaleDateString()})</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No notes</p>
                        )}
                        <form onSubmit={(e) => handleNoteSubmit(e, crop.crop_id)} className="mt-2">
                          <input
                            type="text"
                            value={notes[crop.crop_id] || ''}
                            onChange={(e) => handleNoteChange(crop.crop_id, e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a note"
                          />
                          <button
                            type="submit"
                            disabled={noteLoading}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Add Note
                          </button>
                        </form>
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={() => navigate(`/farmer/monitor?crop_id=${crop.crop_id}`)}
                          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Diagnose
                        </button>
                        <button
                          onClick={() => setSellData({ ...sellData, crop_id: crop.crop_id, crop_name: crop.crop_name })}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No active crops.</p>
            )}
            <button
              onClick={() => {
                if (!user.profile_data?.land_area) {
                  toast.error('Please update your land area in your profile.');
                  navigate('/farmer/profile');
                } else {
                  navigate('/farmer/cropland');
                }
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Crops
            </button>
          </div>
          {sellData.crop_id && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Create Sell Listing</h3>
              <form onSubmit={(e) => handleSellSubmit(e, sellData.crop_id, sellData.crop_name)}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Crop Name</label>
                  <p>{sellData.crop_name}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="quantity">Quantity (units)</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={sellData.quantity}
                    onChange={handleSellChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="price_per_unit">Price per Unit (₹)</label>
                  <input
                    type="number"
                    id="price_per_unit"
                    name="price_per_unit"
                    value={sellData.price_per_unit}
                    onChange={handleSellChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price per unit"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="location.district">District</label>
                  <input
                    type="text"
                    id="location.district"
                    name="location.district"
                    value={sellData.location.district}
                    onChange={handleSellChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter district"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="location.state">State</label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    value={sellData.location.state}
                    onChange={handleSellChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sellLoading}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {sellLoading ? 'Creating Listing...' : 'Create Sell Listing'}
                </button>
              </form>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Government Schemes</h3>
            {dashboardData.schemes?.length ? (
              <ul className="list-disc pl-5">
                {dashboardData.schemes.map((scheme, index) => (
                  <li key={index}>
                    {scheme.name}: {scheme.eligibility} - {scheme.details}
                    <a href={scheme.apply_url} target="_blank" className="ml-2 text-blue-500 hover:underline">Apply</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schemes available. Update your profile details.</p>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Sell Listings</h3>
            {dashboardData.priceTrends.length ? (
              <ul className="list-disc pl-5">
                {dashboardData.priceTrends.map((listing, index) => (
                  <li key={index}>
                    {listing.crop_name} - ₹{listing.price}/unit (Posted: {new Date(listing.date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sell listings.</p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p>Crops Grown This Year: {dashboardData.activeCrops.length}</p>
            <p>Income from Sales: ₹{dashboardData.income}</p>
            <p>Disease Occurrences: {dashboardData.diseaseOccurrences}</p>
          </div>
        </>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Available Crops</h3>
          {dashboardData.availableCrops.length ? (
            <ul className="list-disc pl-5">
              {dashboardData.availableCrops.map((crop, index) => (
                <li key={index}>
                  {crop.crop_name} - {crop.quantity} units at ₹{crop.price_per_unit}/unit ({crop.location.district})
                  <button
                    onClick={() => navigate(`/buyer/marketplace?farmer_id=${crop.user_id}`)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    View Farmer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No crops available.</p>
          )}
          <button
            onClick={() => navigate('/buyer/marketplace')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Browse Marketplace
          </button>
        </div>
      )}
    </div>
  );
}