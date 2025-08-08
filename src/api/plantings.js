// import supabase from "./supabase.js";
// export const addPlanting = async (plantingData) => {
//   const { data: farmer } = await supabase
//     .from('farmers')
//     .select('id')
//     .eq('auth_id', plantingData.farmerId)
//     .single();
  
//   if (!farmer) throw new Error('Farmer not found');

//   const { data: land } = await supabase
//     .from('lands')
//     .select('id')
//     .eq('id', plantingData.landId)
//     .eq('farmer_id', farmer.id)
//     .single();
  
//   if (!land) throw new Error('Land not found or access denied');

//   const { data, error } = await supabase
//     .from('plantings')
//     .insert({
//       land_id: plantingData.landId,
//       crop_type_id: plantingData.cropTypeId,
//       area_used: parseFloat(plantingData.areaUsed),
//       planted_on: plantingData.plantedOn,
//       expected_harvest: plantingData.expectedHarvest,
//       yield_estimate: plantingData.yieldEstimate ? parseFloat(plantingData.yieldEstimate) : null
//     })
//     .select('id, area_used, planted_on')
//     .single();
//   if (error) throw error;
//   return data;
// };

// export const fetchPlantings = async (farmerId) => {
//   const { data: farmer } = await supabase
//     .from('farmers')
//     .select('id')
//     .eq('auth_id', farmerId)
//     .single();
  
//   if (!farmer) throw new Error('Farmer not found');

//   const { data, error } = await supabase
//     .from('plantings')
//     .select(`
//       id,
//       area_used,
//       planted_on,
//       expected_harvest,
//       stage,
//       yield_estimate,
//       crop_types(name, scientific_name),
//       lands(location, farmer_id)
//     `)
//     .eq('lands.farmer_id', farmer.id)
//     .neq('stage', 'harvested')
//     .order('planted_on', { ascending: false });
//   if (error) throw error;
//   return data;
// };

// export const fetchHarvestedCrops = async (farmerId) => {
//   const { data: farmer } = await supabase
//     .from('farmers')
//     .select('id')
//     .eq('auth_id', farmerId)
//     .single();
  
//   if (!farmer) throw new Error('Farmer not found');

//   const { data, error } = await supabase
//     .from('plantings')
//     .select(`
//       id,
//       area_used,
//       yield_estimate,
//       planted_on,
//       crop_types(name),
//       lands(location, farmer_id),
//       marketplace_listings(id, status)
//     `)
//     .eq('lands.farmer_id', farmer.id)
//     .eq('stage', 'harvested')
//     .order('created_at', { ascending: false });
//   if (error) throw error;
//   return data;
// };

// export const updateCropStage = async ({ plantingId, newStage, farmerId }) => {
//   const { data: farmer } = await supabase
//     .from('farmers')
//     .select('id')
//     .eq('auth_id', farmerId)
//     .single();
  
//   if (!farmer) throw new Error('Farmer not found');

//   const { error } = await supabase
//     .from('plantings')
//     .update({ stage: newStage })
//     .eq('id', plantingId)
//     .eq('land_id', supabase
//       .from('lands')
//       .select('id')
//       .eq('farmer_id', farmer.id)
//     );
//   if (error) throw error;
//   return true;
// };
import supabase from "./supabase";
export const addPlanting = async (plantingData) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', plantingData.farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data: land } = await supabase
    .from('lands')
    .select('id')
    .eq('id', plantingData.landId)
    .eq('farmer_id', farmer.id)
    .single();
  
  if (!land) throw new Error('Land not found or access denied');

  const { data, error } = await supabase
    .from('plantings')
    .insert({
      land_id: plantingData.landId,
      crop_type_id: plantingData.cropTypeId,
      area_used: parseFloat(plantingData.areaUsed),
      planted_on: plantingData.plantedOn,
      expected_harvest: plantingData.expectedHarvest,
      yield_estimate: plantingData.yieldEstimate ? parseFloat(plantingData.yieldEstimate) : null
    })
    .select('id, area_used, planted_on')
    .single();
  if (error) throw error;
  return data;
};

export const fetchPlantings = async (farmerId) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('plantings')
    .select(`
      id,
      area_used,
      planted_on,
      expected_harvest,
      stage,
      yield_estimate,
      crop_types(name, scientific_name),
      lands(location, farmer_id)
    `)
    .eq('lands.farmer_id', farmer.id)
    .neq('stage', 'harvested')
    .order('planted_on', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchHarvestedCrops = async (farmerId) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('plantings')
    .select(`
      id,
      area_used,
      yield_estimate,
      planted_on,
      crop_types(name),
      lands(location, farmer_id),
      marketplace_listings(id, status)
    `)
    .eq('lands.farmer_id', farmer.id)
    .eq('stage', 'harvested')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateCropStage = async ({ plantingId, newStage, farmerId }) => {
  const validStages = ['planted', 'growing', 'flowering', 'harvested'];
  if (!validStages.includes(newStage)) {
    throw new Error(`Invalid stage: ${newStage}. Must be one of ${validStages.join(', ')}`);
  }

  if (!plantingId || !farmerId) {
    throw new Error('Missing plantingId or farmerId');
  }

  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  // Fetch valid land_ids for the farmer
  const { data: lands } = await supabase
    .from('lands')
    .select('id')
    .eq('farmer_id', farmer.id);
  
  if (!lands || lands.length === 0) throw new Error('No lands found for farmer');

  const landIds = lands.map(land => land.id);

  // Verify the planting belongs to the farmer's land
  const { data: planting } = await supabase
    .from('plantings')
    .select('id, land_id')
    .eq('id', plantingId)
    .in('land_id', landIds)
    .single();
  
  if (!planting) throw new Error('Planting not found or access denied');

  const { data, error } = await supabase
    .from('plantings')
    .update({ stage: newStage })
    .eq('id', plantingId)
    .select('id, stage')
    .single();
  
  if (error) {
    console.error('Supabase update error:', error);
    throw new Error(`Failed to update stage: ${error.message}`);
  }
  
  return data;
};