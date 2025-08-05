import supabase from "./supabase";
import Groq from "groq-sdk";

// Initialize Groq client
const groq =import.meta.env.VITE_GROQAPI;

// -----------------------------
// 🌾 LAND PLANS APIs
// -----------------------------

export async function createLandPlan(data) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data: landPlan, error } = await supabase
    .from("land_plans")
    .insert([
      {
        user_id: user.data.user.id,
        land_name: data.land_name,
        soil_type: data.soil_type,
        land_area: data.land_area,
        region: data.region,
        water_source: data.water_source,
        rainfall: data.rainfall || null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create land plan: ${error.message}`);
  return landPlan;
}

export async function getUserLandPlans() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("land_plans")
    .select("*")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch land plans: ${error.message}`);
  return data;
}

export async function updateLandPlan(landId, updates) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("land_plans")
    .update(updates)
    .eq("id", landId)
    .eq("user_id", user.data.user.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update land plan: ${error.message}`);
  return data;
}

export async function deleteLandPlan(landId) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("land_plans")
    .delete()
    .eq("id", landId)
    .eq("user_id", user.data.user.id);

  if (error) throw new Error(`Failed to delete land plan: ${error.message}`);
  return true;
}

// -----------------------------
// 🌱 CROP PLANS APIs
// -----------------------------

export async function createCropPlan(data) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data: cropPlan, error } = await supabase
    .from("crop_plans")
    .insert([
      {
        user_id: user.data.user.id,
        land_id: data.land_id,
        crop_name: data.crop_name,
        season: data.season,
        start_date: data.start_date,
        end_date: data.end_date,
        recommendation_notes: data.recommendation_notes,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create crop plan: ${error.message}`);
  return cropPlan;
}

export async function getUserCropPlans() {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("crop_plans")
    .select("*, land_plans(land_name, land_area, region, soil_type)")
    .eq("user_id", user.data.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch crop plans: ${error.message}`);
  return data;
}

export async function updateCropPlan(cropId, updates) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("crop_plans")
    .update(updates)
    .eq("id", cropId)
    .eq("user_id", user.data.user.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update crop plan: ${error.message}`);
  return data;
}

export async function deleteCropPlan(cropId) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("crop_plans")
    .delete()
    .eq("id", cropId)
    .eq("user_id", user.data.user.id);

  if (error) throw new Error(`Failed to delete crop plan: ${error.message}`);
  return true;
}

// -----------------------------
// 🤖 GROK AI APIs
// ----------now-------------------

export async function getCropSuggestions(landData) {
  try {
    const prompt = `
      You are an agricultural expert. Based on the following land details, suggest the top 3 suitable crops for a farmer in India, including sowing windows, expected yield, water requirements, and reasons for suitability. Provide fertilizer recommendations and general farming tips for the region.

      Land Details:
      - Soil Type: ${landData.soil_type}
      - Region: ${landData.region}
      - Land Area: ${landData.land_area} acres
      - Water Source: ${landData.water_source}
      - Rainfall: ${landData.rainfall ? `${landData.rainfall} mm` : 'Unknown'}
      
      Response Format (JSON):
      {
        "suggested_crops": [
          {
            "crop": "string",
            "sow_from": "string",
            "sow_to": "string",
            "expected_yield": "string",
            "water_requirement": "string",
            "suitability_score": number,
            "reasons": ["string"]
          }
        ],
        "recommended_fertilizer": "string",
        "general_recommendations": {
          "best_season": "string",
          "soil_preparation": "string",
          "irrigation_tips": "string",
          "pest_control": "string"
        },
        "weather_considerations": {
          "ideal_temperature": "string",
          "rainfall_needed": "string",
          "critical_growth_periods": ["string"]
        }
      }
    `;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const suggestions = JSON.parse(response.choices[0].message.content);
    return suggestions;
  } catch (error) {
    console.error("Grok API error:", error);
    return getFallbackCropSuggestions(landData);
  }
}

export async function getWeatherAlerts(cropPlan) {
  try {
    const prompt = `
      You are a weather expert for agriculture. Provide weather alerts for the crop timeline from ${cropPlan.start_date} to ${cropPlan.end_date} for the region ${cropPlan.land_plans.region}. Focus on critical weather events (e.g., drought, heavy rain, frost) that could affect ${cropPlan.crop_name} during its growth stages. Include recommendations for mitigation.

      Response Format (JSON):
      {
        "alerts": [
          {
            "date": "string",
            "event": "string",
            "severity": "Low|Moderate|High",
            "description": "string",
            "recommendation": "string"
          }
        ],
        "general_advice": "string"
      }
    `;

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const alerts = JSON.parse(response.choices[0].message.content);
    return alerts;
  } catch (error) {
    console.error("Grok API error for weather alerts:", error);
    return getFallbackWeatherAlerts(cropPlan);
  }
}

// -----------------------------
// 🔄 HELPER FUNCTIONS
// -----------------------------

function getFallbackCropSuggestions(landData) {
  const defaultCrops = {
    Loamy: [
      { crop: "Ragi", sow_from: "July", sow_to: "August", expected_yield: "2-3 tons/acre", water_requirement: "Moderate", suitability_score: 90, reasons: ["Suitable for loamy soil", "High demand in local markets"] },
      { crop: "Groundnut", sow_from: "June", sow_to: "July", expected_yield: "1-2 tons/acre", water_requirement: "Low", suitability_score: 85, reasons: ["Drought-tolerant", "Good for crop rotation"] },
      { crop: "Pulses", sow_from: "August", sow_to: "September", expected_yield: "0.8-1.2 tons/acre", water_requirement: "Low", suitability_score: 80, reasons: ["Improves soil fertility", "Short growth cycle"] },
    ],
    Clay: [
      { crop: "Rice", sow_from: "June", sow_to: "July", expected_yield: "2-4 tons/acre", water_requirement: "High", suitability_score: 90, reasons: ["Thrives in waterlogged clay", "High yield potential"] },
      { crop: "Wheat", sow_from: "November", sow_to: "December", expected_yield: "1.5-2.5 tons/acre", water_requirement: "Moderate", suitability_score: 85, reasons: ["Stable market demand", "Suitable for winter"] },
      { crop: "Sugarcane", sow_from: "February", sow_to: "March", expected_yield: "30-40 tons/acre", water_requirement: "High", suitability_score: 80, reasons: ["High sucrose content", "Long-term crop"] },
    ],
    // Add more soil types as needed
  };

  return {
    suggested_crops: defaultCrops[landData.soil_type] || defaultCrops.Loamy,
    recommended_fertilizer: "Urea, Potash, and Organic Compost",
    general_recommendations: {
      best_season: "Kharif",
      soil_preparation: "Ensure proper plowing and organic matter incorporation",
      irrigation_tips: "Use drip irrigation for water efficiency",
      pest_control: "Monitor for pests regularly and use organic pesticides",
    },
    weather_considerations: {
      ideal_temperature: "20-30°C",
      rainfall_needed: "600-1000 mm",
      critical_growth_periods: ["Vegetative", "Flowering"],
    },
  };
}

function getFallbackWeatherAlerts(cropPlan) {
  return {
    alerts: [
      {
        date: new Date(cropPlan.start_date).toISOString().split('T')[0],
        event: "Moderate Rainfall",
        severity: "Low",
        description: "Expected rainfall may benefit crop growth.",
        recommendation: "Ensure proper drainage to prevent waterlogging.",
      },
    ],
    general_advice: "Monitor weather updates regularly and adjust irrigation accordingly.",
  };
}