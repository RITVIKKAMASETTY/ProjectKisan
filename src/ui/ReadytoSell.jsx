import {usePlantings} from "../features/farmers/usePlantings";
import { useMarketplace } from "../features/farmers/useMarketPlace";
import { useNavigate } from 'react-router-dom';

export default function ReadyToSell({ farmerId }) {
  const { harvestedCrops, isHarvestedLoading } = usePlantings(farmerId);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl mb-4">Ready to Sell Crops</h2>
      {isHarvestedLoading ? (
        <p>Loading...</p>
      ) : harvestedCrops?.length === 0 ? (
        <p>No harvested crops</p>
      ) : (
        <div className="space-y-4">
          {harvestedCrops.map((crop) => (
            <div key={crop.id} className="border p-4 rounded">
              <p><strong>Crop:</strong> {crop.crop_types.name}</p>
              <p><strong>Location:</strong> {crop.lands.location}</p>
              <p><strong>Yield Estimate:</strong> {crop.yield_estimate || 'N/A'} tons</p>
              <p><strong>Status:</strong> {crop.marketplace_listings?.id ? `Listed (${crop.marketplace_listings.status})` : 'Not Listed'}</p>
              {!crop.marketplace_listings?.id && (
                <button
                  onClick={() => navigate(`/marketplace/create/${crop.id}`)}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Create Listing
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}