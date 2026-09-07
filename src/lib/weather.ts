import { createServerFn } from "@tanstack/react-start";

export type WeatherOk = {
  ok: true;
  code: number;
  tMin: number;
  tMax: number;
  source: "forecast" | "archive";
};
export type WeatherFail = { ok: false };
export type WeatherResult = WeatherOk | WeatherFail;

const cache = new Map<string, WeatherResult>();

function minusOneYear(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y - 1}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

async function readDaily(
  url: string,
): Promise<{ code: number; tMin: number; tMax: number } | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as {
    daily?: {
      weathercode?: Array<number | null>;
      weather_code?: Array<number | null>;
      temperature_2m_max?: Array<number | null>;
      temperature_2m_min?: Array<number | null>;
    };
  };
  const daily = json.daily;
  if (!daily) return null;
  const code = daily.weathercode?.[0] ?? daily.weather_code?.[0];
  const tMax = daily.temperature_2m_max?.[0];
  const tMin = daily.temperature_2m_min?.[0];
  if (code == null || tMax == null || tMin == null) return null;
  return { code, tMin, tMax };
}

export const fetchWeather = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lon: number; date: string }) => input)
  .handler(async ({ data }) => {
    const key = `${data.lat},${data.lon},${data.date}`;
    const hit = cache.get(key);
    if (hit) return hit;

    const qs =
      `latitude=${data.lat}&longitude=${data.lon}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&start_date=${data.date}&end_date=${data.date}`;

    try {
      const forecast = await readDaily(`https://api.open-meteo.com/v1/forecast?${qs}`);
      if (forecast) {
        const result: WeatherOk = { ok: true, ...forecast, source: "forecast" };
        cache.set(key, result);
        return result;
      }
      const past = minusOneYear(data.date);
      const archiveQs =
        `latitude=${data.lat}&longitude=${data.lon}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&start_date=${past}&end_date=${past}`;
      const archive = await readDaily(
        `https://archive-api.open-meteo.com/v1/archive?${archiveQs}`,
      );
      if (archive) {
        const result: WeatherOk = { ok: true, ...archive, source: "archive" };
        cache.set(key, result);
        return result;
      }
    } catch {
      /* fall through */
    }
    const fail: WeatherFail = { ok: false };
    cache.set(key, fail);
    return fail;
  });
