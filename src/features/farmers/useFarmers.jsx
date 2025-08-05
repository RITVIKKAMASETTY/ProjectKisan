// hooks/useFarmers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLandPlan,
  getUserLandPlans,
  updateLandPlan,
  deleteLandPlan,
  createCropPlan,
  getUserCropPlans,
  updateCropPlan,
  deleteCropPlan,
  getCropSuggestions,
  getWeatherAlerts
} from "../../services/farmers";

// -----------------------------
// 🌾 LAND PLANS HOOKS
// -----------------------------

export function useCreateLandPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createLandPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landPlans"] });
    },
    onError: (error) => {
      console.error("Create land plan error:", error);
    }
  });
}

export function useLandPlans() {
  return useQuery({
    queryKey: ["landPlans"],
    queryFn: getUserLandPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateLandPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ landId, updates }) => updateLandPlan(landId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landPlans"] });
    },
    onError: (error) => {
      console.error("Update land plan error:", error);
    }
  });
}

export function useDeleteLandPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteLandPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landPlans"] });
      queryClient.invalidateQueries({ queryKey: ["cropPlans"] });
    },
    onError: (error) => {
      console.error("Delete land plan error:", error);
    }
  });
}

// -----------------------------
// 🌱 CROP PLANS HOOKS
// -----------------------------

export function useCreateCropPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCropPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropPlans"] });
    },
    onError: (error) => {
      console.error("Create crop plan error:", error);
    }
  });
}

export function useCropPlans() {
  return useQuery({
    queryKey: ["cropPlans"],
    queryFn: getUserCropPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateCropPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cropId, updates }) => updateCropPlan(cropId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropPlans"] });
    },
    onError: (error) => {
      console.error("Update crop plan error:", error);
    }
  });
}

export function useDeleteCropPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCropPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropPlans"] });
    },
    onError: (error) => {
      console.error("Delete crop plan error:", error);
    }
  });
}

// -----------------------------
// 🤖 AI SUGGESTIONS HOOKS
// -----------------------------

export function useCropSuggestions() {
  return useMutation({
    mutationFn: getCropSuggestions,
    onError: (error) => {
      console.error("Crop suggestions error:", error);
    }
  });
}

export function useWeatherAlerts(cropPlan) {
  return useQuery({
    queryKey: ["weatherAlerts", cropPlan?.id],
    queryFn: () => getWeatherAlerts(cropPlan),
    enabled: !!cropPlan, // Only run when cropPlan exists
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });
}

// -----------------------------
// 🌾 DASHBOARD DATA HOOKS
// -----------------------------

export function useFarmDashboard() {
  const { data: landPlans, isLoading: landLoading } = useLandPlans();
  const { data: cropPlans, isLoading: cropLoading } = useCropPlans();
  
  const dashboardStats = {
    totalLands: landPlans?.length || 0,
    totalCrops: cropPlans?.length || 0,
    activeCrops: cropPlans?.filter(crop => {
      const endDate = new Date(crop.end_date);
      return endDate > new Date();
    }).length || 0,
    totalArea: landPlans?.reduce((sum, land) => sum + (land.land_area || 0), 0) || 0
  };
  
  return {
    landPlans,
    cropPlans,
    dashboardStats,
    isLoading: landLoading || cropLoading
  };
}

// -----------------------------
// 🎯 SPECIFIC QUERIES FOR FORMS
// -----------------------------

export function useLandOptions() {
  const { data: landPlans } = useLandPlans();
  
  return landPlans?.map(land => ({
    value: land.id,
    label: `${land.land_name} (${land.land_area} acres)`,
    soil_type: land.soil_type,
    region: land.region,
    water_source: land.water_source
  })) || [];
}