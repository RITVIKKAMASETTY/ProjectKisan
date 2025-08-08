import  supabase  from "./supabase";
export const addLand = async (farmerData) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerData.farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('lands')
    .insert({
      farmer_id: farmer.id,
      location: farmerData.location,
      area_hectares: parseFloat(farmerData.area),
      soil_type: farmerData.soilType || null
    })
    .select('id, location, area_hectares')
    .single();
  if (error) throw error;
  return data;
};

export const fetchLands = async (farmerId) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('lands')
    .select('id, location, area_hectares, soil_type, created_at')
    .eq('farmer_id', farmer.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchLandDetails = async (farmerId, landId) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('lands')
    .select(`
      id,
      area_hectares,
      soil_type,
      location,
      plantings:plantings(id)
    `)
    .eq('farmer_id', farmer.id)
    .eq('id', landId)
    .single();
  if (error) throw error;
  return data;
};