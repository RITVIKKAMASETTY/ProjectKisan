import supabase from './supabase';

export async function createFarm({ name, location, total_area, plots }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: farmData, error: farmError } = await supabase
    .from('farms')
    .insert({ user_id: authData.user.id, name, location, total_area, plots })
    .select()
    .single();
  if (farmError) throw new Error(farmError.message);
  return farmData;
}

export async function getFarm() {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: farmData, error: farmError } = await supabase
    .from('farms')
    .select('*')
    .eq('user_id', authData.user.id)
    .single();
  if (farmError) throw new Error(farmError.message);
  return farmData;
}

export async function updateFarmPlots({ farm_id, plots }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: farmData, error: updateError } = await supabase
    .from('farms')
    .update({ plots, updated_at: new Date().toISOString() })
    .eq('id', farm_id)
    .eq('user_id', authData.user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return farmData;
}

export async function startCrop({ farm_id, plot_name, crop_name, sown_date, expected_harvest }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropData, error: cropError } = await supabase
    .from('crops')
    .insert({
      user_id: authData.user.id,
      farm_id,
      plot_name,
      crop_name,
      sown_date,
      expected_harvest,
    })
    .select()
    .single();
  if (cropError) throw new Error(cropError.message);
  return cropData;
}

export async function getCrops() {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropsData, error: cropsError } = await supabase
    .from('crops')
    .select('*, crop_support(*)')
    .eq('user_id', authData.user.id)
    .eq('status', 'active');
  if (cropsError) throw new Error(cropsError.message);
  return cropsData;
}

export async function getCrop(crop_id) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropData, error: cropError } = await supabase
    .from('crops')
    .select('*, crop_support(*)')
    .eq('id', crop_id)
    .eq('user_id', authData.user.id)
    .single();
  if (cropError) throw new Error(cropError.message);
  return cropData;
}

export async function updateCropStage({ crop_id, crop_stage }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropData, error: updateError } = await supabase
    .from('crops')
    .update({ crop_stage, updated_at: new Date().toISOString() })
    .eq('id', crop_id)
    .eq('user_id', authData.user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return cropData;
}

export async function endCrop({ crop_id, status, actual_harvest, yield_data }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropData, error: updateError } = await supabase
    .from('crops')
    .update({
      status,
      actual_harvest,
      yield_data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', crop_id)
    .eq('user_id', authData.user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return cropData;
}

export async function reportIssue({ crop_id, type, title, description, data }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: issueData, error: issueError } = await supabase
    .from('crop_support')
    .insert({ crop_id, type, title, description, data })
    .select()
    .single();
  if (issueError) throw new Error(issueError.message);
  return issueData;
}

export async function getCropAlerts(crop_id) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: alertsData, error: alertsError } = await supabase
    .from('crop_support')
    .select('*')
    .eq('crop_id', crop_id)
    .in('type', ['weather_alert', 'disease']);
  if (alertsError) throw new Error(alertsError.message);
  return alertsData;
}

export async function markTaskDone({ crop_support_id, status }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: taskData, error: updateError } = await supabase
    .from('crop_support')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', crop_support_id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return taskData;
}

export async function getFarmerDashboard() {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropsData, error: cropsError } = await supabase
    .from('crops')
    .select('*, crop_support(*), marketplace(*, type.eq.sell_listing)')
    .eq('user_id', authData.user.id)
    .eq('status', 'active');
  if (cropsError) throw new Error(cropsError.message);
  const { data: schemesData, error: schemesError } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', authData.user.id)
    .eq('activity_type', 'scheme_applied');
  if (schemesError) throw new Error(schemesError.message);

  return {
    activeCrops: cropsData.map(c => ({
      crop_name: c.crop_name,
      stage: c.crop_stage,
      alerts: c.crop_support.filter(s => ['weather_alert', 'disease'].includes(s.type)),
      tasks: c.crop_support.filter(s => s.type === 'task'),
    })),
    yieldTrends: cropsData.map(c => ({
      crop_name: c.crop_name,
      expected: c.yield_data?.expected_qty || 0,
      actual: c.yield_data?.actual_qty || 0,
    })),
    priceTrends: cropsData.flatMap(c => c.marketplace.map(m => ({
      crop_name: m.crop_name,
      price: m.price_per_unit,
      date: m.created_at,
    }))),
    income: cropsData
      .flatMap(c => c.marketplace)
      .reduce((sum, m) => sum + (m.quantity * m.price_per_unit || 0), 0),
    alertsLog: cropsData.flatMap(c => c.crop_support.filter(s => ['weather_alert', 'disease'].includes(s.type))),
    schemes: schemesData.map(s => s.data),
  };
}

export async function createSellListing({ crop_name, quantity, price_per_unit, location, description, contact_info, expires_at }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: listingData, error: listingError } = await supabase
    .from('marketplace')
    .insert({
      user_id: authData.user.id,
      type: 'sell_listing',
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
  if (listingError) throw new Error(listingError.message);
  return listingData;
}

export async function getSales() {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: salesData, error: salesError } = await supabase
    .from('marketplace')
    .select('*')
    .eq('user_id', authData.user.id)
    .eq('type', 'sell_listing')
    .eq('status', 'active');
  if (salesError) throw new Error(salesError.message);
  return salesData;
}

export async function updateSale({ sale_id, updates }) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: saleData, error: updateError } = await supabase
    .from('marketplace')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sale_id)
    .eq('user_id', authData.user.id)
    .select()
    .single();
  if (updateError) throw new Error(updateError.message);
  return saleData;
}

export async function deleteSale(sale_id) {
  const { data: authData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: saleData, error: deleteError } = await supabase
    .from('marketplace')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', sale_id)
    .eq('user_id', authData.user.id)
    .select()
    .single();
  if (deleteError) throw new Error(deleteError.message);
  return saleData;
}