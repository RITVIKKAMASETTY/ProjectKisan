import  supabase  from './supabase';

export const createListing = async (listingData) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', listingData.farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert({
      planting_id: listingData.plantingId,
      farmer_id: farmer.id,
      title: listingData.title,
      description: listingData.description || null,
      quantity: parseFloat(listingData.quantity),
      unit: listingData.unit,
      price_per_unit: parseFloat(listingData.pricePerUnit),
      quality_rating: listingData.qualityRating ? parseFloat(listingData.qualityRating) : null
    })
    .select('id, title, price_per_unit')
    .single();
  if (error) throw error;
  return data;
};

export const fetchMarketplaceListings = async () => {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select(`
      id,
      title,
      description,
      quantity,
      unit,
      price_per_unit,
      quality_rating,
      created_at,
      farmers(name, phone),
      plantings(crop_types(name), lands(location))
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchFarmerListings = async (farmerId) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { data, error } = await supabase
    .from('marketplace_listings')
    .select(`
      id,
      title,
      quantity,
      unit,
      price_per_unit,
      quality_rating,
      status,
      created_at,
      plantings(crop_types(name))
    `)
    .eq('farmer_id', farmer.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const updateListingStatus = async ({ listingId, status, farmerId }) => {
  const { data: farmer } = await supabase
    .from('farmers')
    .select('id')
    .eq('auth_id', farmerId)
    .single();
  
  if (!farmer) throw new Error('Farmer not found');

  const { error } = await supabase
    .from('marketplace_listings')
    .update({ status })
    .eq('id', listingId)
    .eq('farmer_id', farmer.id);
  if (error) throw error;
  return true;
};