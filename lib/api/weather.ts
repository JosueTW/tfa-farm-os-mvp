/**
 * OpenWeatherMap API integration
 */

interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  windSpeed: number;
  rainfall?: number;
  icon: string;
}

interface ForecastDay {
  date: string;
  tempHigh: number;
  tempLow: number;
  conditions: string;
  rainfall: number;
  icon: string;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const DEFAULT_LAT = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '-24.7333');
const DEFAULT_LNG = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '29.9167');

/**
 * Get current weather for the farm location
 */
export async function getCurrentWeather(
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG
): Promise<WeatherData | null> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeatherMap API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      conditions: data.weather[0].description,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      rainfall: data.rain?.['1h'] || 0,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

/**
 * Get 7-day weather forecast
 */
export async function getWeatherForecast(
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG
): Promise<ForecastDay[]> {
  if (!OPENWEATHER_API_KEY) {
    console.warn('OpenWeatherMap API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Group by day and get daily highs/lows
    const dailyData: Record<
      string,
      { temps: number[]; conditions: string[]; rainfall: number; icon: string }
    > = {};

    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = { temps: [], conditions: [], rainfall: 0, icon: '' };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].description);
      dailyData[date].rainfall += item.rain?.['3h'] || 0;
      dailyData[date].icon = item.weather[0].icon;
    }

    return Object.entries(dailyData)
      .slice(0, 7)
      .map(([date, data]) => ({
        date,
        tempHigh: Math.round(Math.max(...data.temps)),
        tempLow: Math.round(Math.min(...data.temps)),
        conditions: data.conditions[Math.floor(data.conditions.length / 2)],
        rainfall: Math.round(data.rainfall * 10) / 10,
        icon: data.icon,
      }));
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return [];
  }
}

/**
 * Check if weather conditions are suitable for planting
 */
export function isPlantingWeather(weather: WeatherData): {
  suitable: boolean;
  reason?: string;
} {
  // Too hot
  if (weather.temperature > 38) {
    return { suitable: false, reason: 'Temperature too high (>38°C)' };
  }

  // Too cold
  if (weather.temperature < 5) {
    return { suitable: false, reason: 'Temperature too low (<5°C)' };
  }

  // Too windy
  if (weather.windSpeed > 40) {
    return { suitable: false, reason: 'Wind too strong (>40 km/h)' };
  }

  // Raining
  if (weather.rainfall && weather.rainfall > 5) {
    return { suitable: false, reason: 'Significant rainfall expected' };
  }

  return { suitable: true };
}

/**
 * Get weather icon URL
 */
export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
