// import { useState } from 'react';
// import { useLands } from "../features/farmers/useLands";
// import { useCrops } from "../features/farmers/useCrops";
// import { getWeatherData, getCropRecommendation } from "../api/external";

// export default function CropRecommendation({ farmerId }) {
//   const { lands, fetchLandDetails } = useLands(farmerId);
//   const { cropTypes } = useCrops();
//   const [selectedLand, setSelectedLand] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [error, setError] = useState('');

//   const handleRecommend = async () => {
//     setError('');
//     try {
//       const land = await fetchLandDetails(farmerId, selectedLand);
//       const coords = { latitude: 12.9716, longitude: 77.5946 }; // Replace with real geolocation
//       const weather = await getWeatherData(coords.latitude, coords.longitude);
//       const recommendation = await getCropRecommendation(land, weather);
//       setRecommendations(recommendation.recommendations || []);
//     } catch (err) {
//       setError('Failed to get recommendations');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h2 className="text-xl mb-4">Crop Recommendation</h2>
//       <select
//         value={selectedLand}
//         onChange={(e) => setSelectedLand(e.target.value)}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">Select Land</option>
//         {lands?.map((land) => (
//           <option key={land.id} value={land.id}>
//             {land.location} ({land.area_hectares} ha)
//           </option>
//         ))}
//       </select>
//       <button
//         onClick={handleRecommend}
//         disabled={!selectedLand}
//         className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
//       >
//         Get Recommendations
//       </button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {recommendations.length > 0 && (
//         <div className="mt-4">
//           <h3 className="text-lg">Recommended Crops:</h3>
//           <ul className="list-disc pl-5">
//             {recommendations.map((rec, index) => (
//               <li key={index}>{rec.name} - {rec.reason}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import { useLands } from "../features/farmers/useLands";
import { useCrops } from "../features/farmers/useCrops";
import { getWeatherData, getCropRecommendation } from "../api/external";

export default function CropRecommendation({ farmerId }) {
  const { lands, fetchLandDetails } = useLands(farmerId);
  const { cropTypes } = useCrops();
  const [selectedLand, setSelectedLand] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const handleRecommend = async () => {
    setError('');
    try {
      const land = await fetchLandDetails(farmerId, selectedLand);

      // TODO: Replace with actual geolocation from land data
      const coords = { latitude: 12.9716, longitude: 77.5946 };
      const weather = await getWeatherData(coords.latitude, coords.longitude);

      const crops = await getCropRecommendation(land, weather);

      // ✅ crops is already an array
      setRecommendations(crops);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError('Failed to get recommendations');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl mb-4">Crop Recommendation</h2>
      <select
        value={selectedLand}
        onChange={(e) => setSelectedLand(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select Land</option>
        {lands?.map((land) => (
          <option key={land.id} value={land.id}>
            {land.location} ({land.area_hectares} ha)
          </option>
        ))}
      </select>

      <button
        onClick={handleRecommend}
        disabled={!selectedLand}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        Get Recommendations
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recommended Crops:</h3>
          <ul className="list-disc pl-5">
            {recommendations.map((rec, index) => (
              <li key={index}>
                <span className="font-bold">{rec.name}</span> — {rec.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
