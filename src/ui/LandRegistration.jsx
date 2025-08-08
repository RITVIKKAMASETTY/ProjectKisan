import { useState } from 'react';
import { useLands } from '../features/farmers/useLands';
import {getAddress} from "../api/external";
export default function LandRegistration({ farmerId }) {
  const { addLand, isLandsLoading } = useLands(farmerId);
  const [formData, setFormData] = useState({ location: '', area: '', soilType: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.location || !formData.area || formData.area <= 0) {
        throw new Error('Location and valid area are required');
      }
      // Simulate GPS coordinates for demo (in real app, use geolocation API)
      const coords = { latitude: 12.9716, longitude: 77.5946 };
      const address = await getAddress(coords);
      const fullLocation = `${formData.location}, ${address.locality}, ${address.principalSubdivision}`;
      
      await addLand({
        farmerId,
        location: fullLocation,
        area: formData.area,
        soilType: formData.soilType
      });
      setFormData({ location: '', area: '', soilType: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Register New Land</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Location (e.g., Farm Name)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Area (hectares)"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Soil Type (optional)"
          value={formData.soilType}
          onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isLandsLoading}
          className="w-full p-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          Add Land
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}