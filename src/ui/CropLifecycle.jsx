// import { usePlantings } from "../features/farmers/usePlantings";
// export default function CropLifecycle({ farmerId }) {
//   const { plantings, isPlantingsLoading, updateCropStage } = usePlantings(farmerId);

//   const handleStageChange = async (plantingId, newStage) => {
//     try {
//       await updateCropStage({ plantingId, newStage, farmerId });
//     } catch (err) {
//       console.error('Stage update failed:', err.message);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-xl mb-4">Crop Lifecycle Dashboard</h2>
//       {isPlantingsLoading ? (
//         <p>Loading...</p>
//       ) : plantings?.length === 0 ? (
//         <p>No active plantings</p>
//       ) : (
//         <div className="space-y-4">
//           {plantings.map((planting) => (
//             <div key={planting.id} className="border p-4 rounded">
//               <p><strong>Crop:</strong> {planting.crop_types.name}</p>
//               <p><strong>Location:</strong> {planting.lands.location}</p>
//               <p><strong>Area:</strong> {planting.area_used} ha</p>
//               <p><strong>Planted:</strong> {planting.planted_on}</p>
//               <p><strong>Stage:</strong> {planting.stage}</p>
//               <select
//                 value={planting.stage}
//                 onChange={(e) => handleStageChange(planting.id, e.target.value)}
//                 className="p-2 border rounded"
//               >
//                 <option value="planted">Planted</option>
//                 <option value="growing">Growing</option>
//                 <option value="flowering">Flowering</option>
//                 <option value="harvested">Harvested</option>
//               </select>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { usePlantings } from '../features/farmers/usePlantings';

export default function CropLifecycle({ farmerId }) {
  const { plantings, isPlantingsLoading, updateCropStage, updateStageStatus, updateStageError } = usePlantings(farmerId);

  const handleStageChange = async (plantingId, newStage) => {
    try {
      await updateCropStage({ plantingId, newStage, farmerId });
    } catch (err) {
      console.error('Stage update failed:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl mb-4">Crop Lifecycle Dashboard</h2>
      {updateStageError && <p className="text-red-500 mb-4">Error: {updateStageError.message}</p>}
      {isPlantingsLoading ? (
        <p>Loading...</p>
      ) : plantings?.length === 0 ? (
        <p>No active plantings</p>
      ) : (
        <div className="space-y-4">
          {plantings.map((planting) => (
            <div key={planting.id} className="border p-4 rounded">
              <p><strong>Crop:</strong> {planting.crop_types.name}</p>
              <p><strong>Location:</strong> {planting.lands.location}</p>
              <p><strong>Area:</strong> {planting.area_used} ha</p>
              <p><strong>Planted:</strong> {planting.planted_on}</p>
              <p><strong>Stage:</strong> {planting.stage}</p>
              <select
                value={planting.stage}
                onChange={(e) => handleStageChange(planting.id, e.target.value)}
                disabled={updateStageStatus === 'pending'}
                className="p-2 border rounded disabled:bg-gray-200"
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="flowering">Flowering</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}