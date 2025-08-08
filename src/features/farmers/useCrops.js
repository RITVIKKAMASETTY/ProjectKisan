import { useQuery } from '@tanstack/react-query';
import { fetchCropTypes } from '../../api/crops';

export const useCrops = () => {
  const { data: cropTypes, isLoading: isCropTypesLoading } = useQuery({
    queryKey: ['cropTypes'],
    queryFn: fetchCropTypes
  });

  return { cropTypes, isCropTypesLoading };
};