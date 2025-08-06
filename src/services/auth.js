// import supabase from "./supabase";
// import { supabaseUrl } from "./supabase";
// export async function login({ email, password }) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     console.error(error);
//     throw new Error(error.message);
//   }

//   return data;
// }
// export async function getCurrentUser() {
//   const { data: session } = await supabase.auth.getSession();
//   if(!session.session){
//     return null;}
// const {data,error}=await supabase.auth.getUser();
// if(error) throw new Error(error.message);return data?.user;}
// export async function logout() {
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     console.error(error);
//     throw new Error(error.message);
//   }
// }
// // export async function signup({ fullName, email, password }) {
// //   const { data, error } = await supabase.auth.signUp({
// //     email,
// //     password,
// //     options: {
// //       data: {
// //         fullName,
// //         avatar: "",
// //       },
// //     },
// //   });

//   // if (error) {
//   //   throw new Error(error.message);
//   // }

// //   return data;
// // }
// export async function signup({ fullName, email, password }) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         fullName,
//         avatar: "",
//       },
//     },
//   });

//   if (error) throw new Error(error.message);

//   // Force update to ensure fullname is saved
//   const updateRes = await supabase.auth.updateUser({
//     data: {
//       fullName,
//       avatar: "",
//     },
//   });

//   if (updateRes.error) throw new Error(updateRes.error.message);

//   return data;
// }
// services/auth.js
import supabase from "./supabase";

// -----------------------------
// 🔐 Get Current Authenticated User
// -----------------------------
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) throw new Error("Failed to get current user");
  return user;
}



// -----------------------------
// 📧 Optional: Signup with Email + Password
// -----------------------------
export async function signUpWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw new Error("Failed to sign up");
  return data.user;
}

// -----------------------------
// 📧 Optional: Login with Email + Password
// -----------------------------
export async function loginWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error("Invalid login credentials");
  return data.user;
}

// -----------------------------
// 🚪 Logout
// -----------------------------
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Failed to logout");
  return true;
}

// -----------------------------
// 🧪 Auth Change Listener (Optional for UI)
// -----------------------------
export function listenToAuthChanges(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}
