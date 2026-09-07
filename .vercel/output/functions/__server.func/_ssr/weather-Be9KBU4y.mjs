import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/weather-Be9KBU4y.js
var cache = /* @__PURE__ */ new Map();
function minusOneYear(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return `${y - 1}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
async function readDaily(url) {
	const res = await fetch(url);
	if (!res.ok) return null;
	const daily = (await res.json()).daily;
	if (!daily) return null;
	const code = daily.weathercode?.[0] ?? daily.weather_code?.[0];
	const tMax = daily.temperature_2m_max?.[0];
	const tMin = daily.temperature_2m_min?.[0];
	if (code == null || tMax == null || tMin == null) return null;
	return {
		code,
		tMin,
		tMax
	};
}
var fetchWeather_createServerFn_handler = createServerRpc({
	id: "3c4e6c3d8a01a2e0f09e8581902b5abde0ee191d059db60c58091628562189c2",
	name: "fetchWeather",
	filename: "src/lib/weather.ts"
}, (opts) => fetchWeather.__executeServer(opts));
var fetchWeather = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchWeather_createServerFn_handler, async ({ data }) => {
	const key = `${data.lat},${data.lon},${data.date}`;
	const hit = cache.get(key);
	if (hit) return hit;
	const qs = `latitude=${data.lat}&longitude=${data.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${data.date}&end_date=${data.date}`;
	try {
		const forecast = await readDaily(`https://api.open-meteo.com/v1/forecast?${qs}`);
		if (forecast) {
			const result = {
				ok: true,
				...forecast,
				source: "forecast"
			};
			cache.set(key, result);
			return result;
		}
		const past = minusOneYear(data.date);
		const archive = await readDaily(`https://archive-api.open-meteo.com/v1/archive?${`latitude=${data.lat}&longitude=${data.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&start_date=${past}&end_date=${past}`}`);
		if (archive) {
			const result = {
				ok: true,
				...archive,
				source: "archive"
			};
			cache.set(key, result);
			return result;
		}
	} catch {}
	const fail = { ok: false };
	cache.set(key, fail);
	return fail;
});
//#endregion
export { fetchWeather_createServerFn_handler };
