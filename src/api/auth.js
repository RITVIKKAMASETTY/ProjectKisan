import supabase from './supabase';

export async function register({ email, phone, password, name, role, location, profile_data }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        phone: phone || null,
        location: location || { district: null, state: null, coordinates: { lat: null, lng: null } },
        profile_data: profile_data || { land_area: null, caste: null, business_type: null },
      },
    },
  });

  if (authError) throw new Error(authError.message);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      phone: phone || null,
      name,
      role,
      location: location || { district: null, state: null, coordinates: { lat: null, lng: null } },
      profile_data: profile_data || { land_area: null, caste: null, business_type: null },
    })
    .select()
    .single();

  if (userError) throw new Error(userError.message);

  return userData;
}

export async function login({ email, password }) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) throw new Error(userError.message);

  return userData;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return null;
}

export async function getProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (userError) throw new Error(userError.message);

  return userData;
}