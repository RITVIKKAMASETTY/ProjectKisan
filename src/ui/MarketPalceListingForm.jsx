import { useState } from 'react';
import { useMarketplace } from "../features/farmers/useMarketPlace";
import { useParams, useNavigate } from 'react-router-dom';

export default function MarketplaceListingForm({ farmerId }) {
  const { plantingId } = useParams();
  const { createListing } = useMarketplace(farmerId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    qualityRating: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.title || !formData.quantity || !formData.unit || !formData.pricePerUnit) {
        throw new Error('Required fields missing');
      }
      await createListing({ ...formData, plantingId, farmerId });
      navigate('/marketplace');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Create Marketplace Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Listing Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Unit (e.g., kg, tons)"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price per Unit"
          value={formData.pricePerUnit}
          onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Quality Rating (0-5, optional)"
          value={formData.qualityRating}
          onChange={(e) => setFormData({ ...formData, qualityRating: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Create Listing
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}