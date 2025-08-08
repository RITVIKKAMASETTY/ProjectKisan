import supabase from "./supabase";

// Reverse geocoding
export const getAddress = async ({ latitude, longitude }) => {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  );
  if (!res.ok) throw new Error("Failed getting address");
  return await res.json();
};

// Weather from WeatherAPI
export const getWeatherData = async (latitude, longitude) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const baseUrl = "http://api.weatherapi.com/v1";

  // Current weather
  const currentWeather = await fetch(
    `${baseUrl}/current.json?key=${API_KEY}&q=${latitude},${longitude}`
  );
  if (!currentWeather.ok) throw new Error("Failed to fetch current weather");

  // 5-day forecast
  const forecast = await fetch(
    `${baseUrl}/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=5`
  );
  if (!forecast.ok) throw new Error("Failed to fetch weather forecast");

  return {
    current: await currentWeather.json(),
    forecast: await forecast.json(),
  };
};

// Crop recommendation from Groq AI
export const getCropRecommendation = async (landData, weatherData) => {
  const API_KEY = import.meta.env.VITE_GROQAPI;
  if (!API_KEY) throw new Error("Missing Groq API key");

  const prompt = `
    You are an expert agricultural advisor.
    Based on the given data, respond ONLY with a valid JSON array of exactly 3 objects.
    Each object must have:
      - "name": the crop name
      - "reason": the reason for recommendation
    Do not include any text before or after the JSON.

    Data:
    Location: ${landData.location}
    Area: ${landData.area_hectares} hectares
    Soil: ${landData.soil_type || "unknown"}
    Weather: ${JSON.stringify({
      temp_c: weatherData.current.current.temp_c,
      condition: weatherData.current.current.condition.text,
      humidity: weatherData.current.current.humidity,
      precip_mm: weatherData.current.current.precip_mm
    })}
    Forecast: ${JSON.stringify(
      weatherData.forecast.forecast.forecastday.map(day => ({
        date: day.date,
        max_temp_c: day.day.maxtemp_c,
        min_temp_c: day.day.mintemp_c,
        condition: day.day.condition.text,
        precip_mm: day.day.totalprecip_mm
      }))
    )}
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content || "";

  console.log("Groq raw text:", rawContent);

  let crops;
  try {
    crops = JSON.parse(rawContent);
  } catch (e) {
    console.error("Failed to parse AI output:", rawContent);
    throw new Error("Model did not return valid JSON");
  }

  return crops;
};
