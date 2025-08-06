import supabase from './supabase';
import { supabaseUrl } from './supabase';
export async function recommendCrops({ farm_id, plot_name, soil_type, season }) {
  const { data: farm, error } = await supabase
    .from('farms')
    .select('location')
    .eq('id', farm_id)
    .single();
  if (error) throw new Error(error.message);
  // Mock implementation (replace with ML model or rules engine)
  const recommendations = [
    { crop_name: 'Tomato', yield_estimate: 500, avg_price: 20, water_needs: 'moderate', risk_level: 'low' },
    { crop_name: 'Wheat', yield_estimate: 400, avg_price: 15, water_needs: 'high', risk_level: 'medium' },
  ];
  await supabase.from('crop_support').insert({
    farm_id,
    type: 'recommendation',
    title: `Crop recommendations for ${plot_name}`,
    data: { recommendations, soil_type, season },
  });
  return recommendations;
}

export async function getCropCalendar(crop_name) {
  // Mock implementation (replace with predefined crop calendars or external API)
  const calendar = {
    crop_name,
    stages: [
      { stage: 'sowing', duration: '1-5 days', tasks: ['Prepare soil', 'Sow seeds'] },
      { stage: 'growing', duration: '6-30 days', tasks: ['Irrigate', 'Weed'] },
      { stage: 'flowering', duration: '31-60 days', tasks: ['Fertilize', 'Monitor pests'] },
      { stage: 'harvest_ready', duration: '61-90 days', tasks: ['Check ripeness'] },
    ],
  };
  return calendar;
}

export async function getMarketPrices({ crop_name, location }) {
  const query = supabase
    .from('marketplace')
    .select('crop_name, price_per_unit, created_at')
    .eq('type', 'sell_listing')
    .eq('status', 'active');
  if (crop_name) query.ilike('crop_name', `%${crop_name}%`);
  if (location?.district) query.contains('location', { district: location.district });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export async function processVoiceQuery({ query, language }) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  // Mock voice-to-text and intent detection (replace with Google APIs)
  const answer = `Answer to: ${query}`;
  const { data: log, error: logError } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      activity_type: 'voice_query',
      data: { query, language, answer },
    })
    .select()
    .single();
  if (logError) throw new Error(logError.message);
  return { query, answer, log };
}

export async function getVoiceHistory() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: historyError } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('activity_type', 'voice_query');
  if (historyError) throw new Error(historyError.message);
  return data;
}

export async function getSchemes({ crop_name, location, profile_data }) {
  // Mock implementation (replace with government API or static DB)
  const schemes = [
    { name: 'Crop Insurance', eligibility: { crop_name, land_area: profile_data.land_area }, apply_link: 'url' },
    { name: 'Subsidy for Tools', eligibility: { region: location.district }, apply_link: 'url' },
  ];
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    activity_type: 'scheme_applied',
    data: { schemes },
  });
  return schemes;
}

export async function applyScheme({ scheme_name }) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: logError } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      activity_type: 'scheme_applied',
      data: { name: scheme_name, status: 'applied' },
    })
    .select()
    .single();
  if (logError) throw new Error(logError.message);
  return data;
}

export async function getSchemeStatus() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data, error: schemesError } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('activity_type', 'scheme_applied');
  if (schemesError) throw new Error(schemesError.message);
  return data;
}

export async function getWeather(location) {
  // Mock implementation (replace with weather API)
  const weather = { type: 'rain', severity: 'moderate', advice: 'Cover crops' };
  return weather;
}

export async function uploadImage({ file, crop_id }) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const fileName = `${user.id}/${crop_id}/${Date.now()}.jpg`;
  const { error: uploadError } = await supabase.storage
    .from('crop-images')
    .upload(fileName, file);
  if (uploadError) throw new Error(uploadError.message);
  const { data: { publicUrl } } = supabase.storage.from('crop-images').getPublicUrl(fileName);
  return publicUrl;
}

export async function getNotifications() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const { data: cropAlerts, error: alertsError } = await supabase
    .from('crop_support')
    .select('*')
    .eq('status', 'open')
    .in('type', ['weather_alert', 'disease', 'task']);
  if (alertsError) throw new Error(alertsError.message);
  return cropAlerts;
}