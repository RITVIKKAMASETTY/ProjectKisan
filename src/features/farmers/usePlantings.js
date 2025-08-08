// import { useMutation, useQuery } from '@tanstack/react-query';
// import { addPlanting, fetchPlantings, fetchHarvestedCrops, updateCropStage } from '../../api/plantings';

// export const usePlantings = (farmerId) => {
//   const { data: plantings, isLoading: isPlantingsLoading, refetch: refetchPlantings } = useQuery({
//     queryKey: ['plantings', farmerId],
//     queryFn: () => fetchPlantings(farmerId),
//     enabled: !!farmerId
//   });

//   const { data: harvestedCrops, isLoading: isHarvestedLoading, refetch: refetchHarvested } = useQuery({
//     queryKey: ['harvestedCrops', farmerId],
//     queryFn: () => fetchHarvestedCrops(farmerId),
//     enabled: !!farmerId
//   });

//   const addPlantingMutation = useMutation({
//     mutationFn: addPlanting,
//     onSuccess: () => refetchPlantings(),
//     onError: (error) => console.error('Add planting failed:', error.message)
//   });

//   const updateStageMutation = useMutation({
//     mutationFn: updateCropStage,
//     onSuccess: () => {
//       refetchPlantings();
//       refetchHarvested();
//     },
//     onError: (error) => console.error('Update stage failed:', error.message)
//   });

//   return {
//     plantings,
//     isPlantingsLoading,
//     harvestedCrops,
//     isHarvestedLoading,
//     addPlanting: addPlantingMutation.mutate,
//     updateCropStage: updateStageMutation.mutate,
//     refetchPlantings,
//     refetchHarvested
//   };
// };
// hooks/usePlantings.js
import { useMutation, useQuery } from '@tanstack/react-query';
import {addPlanting,fetchPlantings,fetchHarvestedCrops,updateCropStage} from "../../api/plantings";

export const usePlantings = (farmerId) => {
  const { data: plantings, isLoading: isPlantingsLoading, refetch: refetchPlantings } = useQuery({
    queryKey: ['plantings', farmerId],
    queryFn: () => fetchPlantings(farmerId),
    enabled: !!farmerId
  });

  const { data: harvestedCrops, isLoading: isHarvestedLoading, refetch: refetchHarvested } = useQuery({
    queryKey: ['harvestedCrops', farmerId],
    queryFn: () => fetchHarvestedCrops(farmerId),
    enabled: !!farmerId
  });

  const addPlantingMutation = useMutation({
    mutationFn: addPlanting,
    onSuccess: () => refetchPlantings(),
    onError: (error) => console.error('Add planting failed:', error.message)
  });

  const updateStageMutation = useMutation({
    mutationFn: updateCropStage,
    onSuccess: () => {
      refetchPlantings();
      refetchHarvested();
    },
    onError: (error) => console.error('Update stage failed:', error.message)
  });

  return {
    plantings,
    isPlantingsLoading,
    harvestedCrops,
    isHarvestedLoading,
    addPlanting: addPlantingMutation.mutate,
    updateCropStage: updateStageMutation.mutate,
    updateStageStatus: updateStageMutation.status,
    updateStageError: updateStageMutation.error,
    refetchPlantings,
    refetchHarvested
  };
};