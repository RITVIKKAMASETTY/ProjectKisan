import { useMutation, useQuery } from '@tanstack/react-query';
import { addLand, fetchLands, fetchLandDetails } from '../../api/lands';

export const useLands = (farmerId) => {
  const { data: lands, isLoading: isLandsLoading, refetch: refetchLands } = useQuery({
    queryKey: ['lands', farmerId],
    queryFn: () => fetchLands(farmerId),
    enabled: !!farmerId
  });

  const addLandMutation = useMutation({
    mutationFn: addLand,
    onSuccess: () => refetchLands(),
    onError: (error) => console.error('Add land failed:', error.message)
  });

  const { data: landDetails, isLoading: isLandDetailsLoading } = useQuery({
    queryKey: ['landDetails', farmerId],
    queryFn: ({ queryKey }) => fetchLandDetails(farmerId, queryKey[1]),
    enabled: false // Trigger manually
  });

  return {
    lands,
    isLandsLoading,
    addLand: addLandMutation.mutate,
    fetchLandDetails,
    landDetails,
    isLandDetailsLoading,
    refetchLands
  };
};