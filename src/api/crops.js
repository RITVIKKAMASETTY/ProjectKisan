import supabase from "./supabase";

export const fetchCropTypes = async () => {
  const { data, error } = await supabase
    .from('crop_types')
    .select('id, name, scientific_name, typical_season')
    .order('name');
  if (error) throw error;
  return data;
};