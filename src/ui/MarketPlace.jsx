import {useMarketplace} from "../features/farmers/useMarketPlace.js";
export default function Marketplace({ farmerId }) {
  const { listings, isListingsLoading, farmerListings, isFarmerListingsLoading, updateListingStatus } = useMarketplace(farmerId);
console.log(listings);
  const handleStatusChange = async (listingId, status) => {
    try {
      await updateListingStatus({ listingId, status, farmerId });
    } catch (err) {
      console.error('Update listing status failed:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl mb-4">Marketplace</h2>
      <h3 className="text-lg mb-2">Your Listings</h3>
      {isFarmerListingsLoading ? (
        <p>Loading...</p>
      ) : farmerListings?.length === 0 ? (
        <p>No listings</p>
      ) : (
        <div className="space-y-4 mb-8">
          {farmerListings.map((listing) => (
            <div key={listing.id} className="border p-4 rounded">
              <p><strong>Title:</strong> {listing.title}</p>
              <p><strong>Crop:</strong> {listing.plantings.crop_types.name}</p>
              <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
              <p><strong>Price:</strong> ${listing.price_per_unit}/unit</p>
              <p><strong>Status:</strong> {listing.status}</p>
              <select
                value={listing.status}
                onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                className="p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="removed">Removed</option>
              </select>
            </div>
          ))}
        </div>
      )}
      <h3 className="text-lg mb-2">All Listings</h3>
      {isListingsLoading ? (
        <p>Loading...</p>
      ) : listings?.length === 0 ? (
        <p>No active listings</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="border p-4 rounded">
              <p><strong>Title:</strong> {listing.title}</p>
              <p><strong>Crop:</strong> {listing.plantings.crop_types.name}</p>
              <p><strong>Farmer:</strong> {listing.farmers.name}</p>
              <p><strong>phone number:</strong> {listing.farmers.phone}</p>
              <p><strong>Location:</strong> {listing.plantings.lands.location}</p>
              <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
              <p><strong>Price:</strong> ${listing.price_per_unit}/unit</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}