import  supabase  from "./supabase";

export const signup = async ({ name, email, phone, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } }
  });
  if (error) throw error;
  
  const { error: insertError } = await supabase
    .from('farmers')
    .insert({
      name,
      email,
      phone,
      auth_id: data.user.id,
      password_hash: 'handled-by-auth'
    })
    .select()
    .single();
  
  if (insertError) throw insertError;
  return data;
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};