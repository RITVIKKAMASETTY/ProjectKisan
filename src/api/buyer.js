import supabase from "./supabase";
import { supabaseUrl } from "./supabase";
export async function getBuyerProfile() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  if (profileError) throw new Error(profileError.message);
  return data;
}

export async function updateBuyerProfile(updates) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: updateError } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return data;
}

export async function createBuyRequest({ crop_name, quantity, price_per_unit, location, description, contact_info, expires_at }) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: requestError } = await supabase
    .from('marketplace')
    .insert({
      user_id: user.id,
      type: 'buy_request',
      crop_name,
      quantity,
      price_per_unit,
      location,
      description,
      contact_info,
      expires_at,
    })
    .select()
    .single();
  if (requestError) throw new Error(requestError.message);
  return data;
}

export async function getBuyRequests() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: requestsError } = await supabase
    .from('marketplace')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'buy_request')
    .eq('status', 'active');
  if (requestsError) throw new Error(requestsError.message);
  return data;
}

export async function updateBuyRequest({ request_id, updates }) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: updateError } = await supabase
    .from('marketplace')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', request_id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return data;
}

export async function cancelBuyRequest(request_id) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: deleteError } = await supabase
    .from('marketplace')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', request_id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (deleteError) throw new Error(deleteError.message);
  return data;
}

export async function browseCrops({ crop_name, location, max_price }) {
  const query = supabase
    .from('marketplace')
    .select('*, users(name, location)')
    .eq('type', 'sell_listing')
    .eq('status', 'active');
  if (crop_name) query.ilike('crop_name', `%${crop_name}%`);
  if (max_price) query.lte('price_per_unit', max_price);
  if (location?.district) query.contains('location', { district: location.district });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function searchCrops({ crop_name, location, min_quantity, max_price }) {
  const query = supabase
    .from('marketplace')
    .select('*, users(name, location)')
    .eq('type', 'sell_listing')
    .eq('status', 'active');
  if (crop_name) query.ilike('crop_name', `%${crop_name}%`);
  if (min_quantity) query.gte('quantity', min_quantity);
  if (max_price) query.lte('price_per_unit', max_price);
  if (location?.district) query.contains('location', { district: location.district });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function getSellerContact(seller_id) {
  const { data, error } = await supabase
    .from('marketplace')
    .select('contact_info')
    .eq('user_id', seller_id)
    .eq('type', 'sell_listing')
    .eq('status', 'active')
    .single();
  if (error) throw new Error(error.message);
  return data.contact_info;
}

export async function getBuyerDashboard() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: requests, error: requestsError } = await supabase
    .from('marketplace')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'buy_request');
  if (requestsError) throw new Error(requestsError.message);
  const { data: sales, error: salesError } = await supabase
    .from('marketplace')
    .select('*')
    .eq('type', 'sell_listing')
    .eq('status', 'active');
  if (salesError) throw new Error(salesError.message);

  return {
    activeRequests: requests.filter(r => r.status === 'active'),
    fulfilledOrders: requests.filter(r => r.status === 'sold'),
    priceHistory: sales.map(s => ({
      crop_name: s.crop_name,
      price: s.price_per_unit,
      date: s.created_at,
    })),
    nearbySellers: sales.map(s => ({
      crop_name: s.crop_name,
      location: s.location,
      quantity: s.quantity,
      price: s.price_per_unit,
    })),
  };
}