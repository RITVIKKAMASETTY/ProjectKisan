import { useState } from 'react';
import { useLands } from "../features/farmers/useLands.js";
import { useCrops } from "../features/farmers/useCrops.js";
import {usePlantings} from "../features/farmers/usePlantings.js";

export default function PlantingForm({ farmerId }) {
  const { lands } = useLands(farmerId);
  const { cropTypes } = useCrops();
  const { addPlanting } = usePlantings(farmerId);
  const [formData, setFormData] = useState({
    landId: '',
    cropTypeId: '',
    areaUsed: '',
    plantedOn: '',
    expectedHarvest: '',
    yieldEstimate: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.landId || !formData.cropTypeId || !formData.areaUsed || !formData.plantedOn) {
        throw new Error('Required fields missing');
      }
      await addPlanting({ ...formData, farmerId });
      setFormData({
        landId: '',
        cropTypeId: '',
        areaUsed: '',
        plantedOn: '',
        expectedHarvest: '',
        yieldEstimate: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Add Planting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.landId}
          onChange={(e) => setFormData({ ...formData, landId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Land</option>
          {lands?.map((land) => (
            <option key={land.id} value={land.id}>
              {land.location} ({land.area_hectares} ha)
            </option>
          ))}
        </select>
        <select
          value={formData.cropTypeId}
          onChange={(e) => setFormData({ ...formData, cropTypeId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Crop</option>
          {cropTypes?.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Area Used (hectares)"
          value={formData.areaUsed}
          onChange={(e) => setFormData({ ...formData, areaUsed: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Planted On"
          value={formData.plantedOn}
          onChange={(e) => setFormData({ ...formData, plantedOn: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Expected Harvest"
          value={formData.expectedHarvest}
          onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Yield Estimate (optional)"
          value={formData.yieldEstimate}
          onChange={(e) => setFormData({ ...formData, yieldEstimate: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Add Planting
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}