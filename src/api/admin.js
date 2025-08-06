import supabase from "./supabase";
import {supabaseUrl} from "./supabase";
export async function getPlatformStats() {
  const { data: users, error: usersError } = await supabase.from('users').select('role');
  if (usersError) throw new Error(usersError.message);
  const { data: crops, error: cropsError } = await supabase.from('crops').select('status');
  if (cropsError) throw new Error(cropsError.message);
  const { data: marketplace, error: marketError } = await supabase.from('marketplace').select('type');
  if (marketError) throw new Error(marketError.message);

  return {
    totalUsers: users.length,
    farmers: users.filter(u => u.role === 'farmer').length,
    buyers: users.filter(u => u.role === 'buyer').length,
    activeCrops: crops.filter(c => c.status === 'active').length,
    listings: marketplace.filter(m => m.type === 'sell_listing').length,
    requests: marketplace.filter(m => m.type === 'buy_request').length,
  };
}

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(error.message);
  return data;
}

export async function getCropsOverview() {
  const { data, error } = await supabase
    .from('crops')
    .select('crop_name, status, yield_data, created_at');
  if (error) throw new Error(error.message);
  return data;
}

export async function getMarketplaceTrends() {
  const { data, error } = await supabase
    .from('marketplace')
    .select('crop_name, price_per_unit, quantity, type, created_at');
  if (error) throw new Error(error.message);
  return data;
}

export async function addScheme({ name, eligibility, apply_link }) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert({
      activity_type: 'scheme_added',
      data: { name, eligibility, apply_link },
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCropCalendar({ crop_name, calendar }) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert({
      activity_type: 'crop_calendar_updated',
      data: { crop_name, calendar },
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getSupportTickets() {
  const { data, error } = await supabase
    .from('crop_support')
    .select('*, crops(crop_name, user_id), users(name)')
    .eq('type', 'disease')
    .eq('status', 'open');
  if (error) throw new Error(error.message);
  return data;
}