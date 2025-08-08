import { useMutation, useQuery } from '@tanstack/react-query';
import { createListing, fetchMarketplaceListings, fetchFarmerListings, updateListingStatus } from '../../api/marketplace';

export const useMarketplace = (farmerId) => {
  const { data: listings, isLoading: isListingsLoading } = useQuery({
    queryKey: ['marketplaceListings'],
    queryFn: fetchMarketplaceListings
  });

  const { data: farmerListings, isLoading: isFarmerListingsLoading, refetch: refetchFarmerListings } = useQuery({
    queryKey: ['farmerListings', farmerId],
    queryFn: () => fetchFarmerListings(farmerId),
    enabled: !!farmerId
  });

  const createListingMutation = useMutation({
    mutationFn: createListing,
    onSuccess: () => refetchFarmerListings(),
    onError: (error) => console.error('Create listing failed:', error.message)
  });

  const updateListingStatusMutation = useMutation({
    mutationFn: updateListingStatus,
    onSuccess: () => refetchFarmerListings(),
    onError: (error) => console.error('Update listing status failed:', error.message)
  });

  return {
    listings,
    isListingsLoading,
    farmerListings,
    isFarmerListingsLoading,
    createListing: createListingMutation.mutate,
    updateListingStatus: updateListingStatusMutation.mutate,
    refetchFarmerListings
  };
};