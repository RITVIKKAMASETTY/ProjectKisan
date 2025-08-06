import { useState } from 'react';
import { useSignUp } from './useSignUp';
import { toast } from 'react-hot-toast';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    role: 'farmer',
    location: { district: '', state: '', coordinates: { lat: '', lng: '' } },
    profile_data: { land_area: '', caste: '', business_type: '' },
  });
  const { mutate: signUp, isLoading, error } = useSignUp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [key]: value },
      });
    } else if (name.includes('profile_data.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        profile_data: { ...formData.profile_data, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, name, role } = formData;
    if (!email || !password || !name || !role) {
      toast.error('Please fill in all required fields');
      return;
    }
    signUp({
      email,
      phone: formData.phone || null,
      password,
      name,
      role,
      location: {
        district: formData.location.district || null,
        state: formData.location.state || null,
        coordinates: {
          lat: formData.location.coordinates.lat || null,
          lng: formData.location.coordinates.lng || null,
        },
      },
      profile_data: {
        land_area: formData.profile_data.land_area || null,
        caste: formData.profile_data.caste || null,
        business_type: formData.profile_data.business_type || null,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up for Flora Flow</h2>
      {error && <p className="text-red-500 mb-4">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number (optional)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text- gray-700 mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location.district">District</label>
          <input
            type="text"
            id="location.district"
            name="location.district"
            value={formData.location.district}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your district (optional)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="location.state">State</label>
          <input
            type="text"
            id="location.state"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your state (optional)"
          />
        </div>
        {formData.role === 'farmer' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="profile_data.land_area">
                Land Area (acres)
              </label>
              <input
                type="number"
                id="profile_data.land_area"
                name="profile_data.land_area"
                value={formData.profile_data.land_area}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter land area (optional)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="profile_data.caste">Caste</label>
              <input
                type="text"
                id="profile_data.caste"
                name="profile_data.caste"
                value={formData.profile_data.caste}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter caste (optional)"
              />
            </div>
          </>
        )}
        {formData.role === 'buyer' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="profile_data.business_type">
              Business Type
            </label>
            <input
              type="text"
              id="profile_data.business_type"
              name="profile_data.business_type"
              value={formData.profile_data.business_type}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter business type (optional)"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}