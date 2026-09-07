import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { C as CloudDrizzle, E as BedDouble, S as CloudFog, T as CalendarRange, _ as Coffee, b as CloudRain, c as Sun, d as Snowflake, f as RefreshCw, g as ExternalLink, h as LoaderCircle, i as UtensilsCrossed, l as Star, m as MapPin, n as Wallet, o as TrainFront, p as Plane, r as Utensils, s as Ticket, t as X, u as Sparkles, v as Cloud, w as Clock, x as CloudLightning, y as CloudSun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Db_ND0Oc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var recommendFoods = createServerFn({ method: "POST" }).handler(createSsrRpc("7fc89d059fff3b6afa57939d1cebb857d41ab8c9597f71c15a21398d3f1ef117"));
var fetchWeather = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3c4e6c3d8a01a2e0f09e8581902b5abde0ee191d059db60c58091628562189c2"));
var TODAY = "2026-09-07";
function mapsUrl(q) {
	return `https://maps.google.com/maps?q=${encodeURIComponent(q)}`;
}
function item(type, startTime, endTime, title, locationName, extra = {}) {
	return {
		type,
		startTime,
		endTime,
		title,
		locationName,
		mapsUrl: mapsUrl(locationName),
		highlight: false,
		notes: "",
		...extra
	};
}
function transit(startTime, endTime, mode, durationMin, costJPY, from, to, notes = "") {
	return {
		type: "transit",
		startTime,
		endTime,
		title: `${mode} ${from} → ${to}`,
		locationName: `${from} → ${to}`,
		mapsUrl: mapsUrl(to),
		highlight: false,
		notes,
		mode,
		durationMin,
		costJPY,
		from,
		to
	};
}
function isExpired(expiry) {
	if (!expiry || expiry === "無期限") return false;
	const m = expiry.replace(/[./]/g, "-").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
	if (!m) return false;
	return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` < TODAY;
}
function coupon(c) {
	return {
		...c,
		expired: c.expired ?? isExpired(c.expiry)
	};
}
var TRIP = {
	tripTitle: "東京 2026-10-25 ~ 11-04",
	theme: "Fan Fest × 演唱會 × 購物",
	startDate: "2026-10-25",
	endDate: "2026-11-04",
	flights: {
		outbound: {
			flightNo: "UO624",
			from: "澳門（經 HKG）",
			to: "HND T3",
			depart: "2026-10-25 23:55",
			arrive: "2026-10-26 04:45",
			notes: "澳門金巴／機場直達去 HKG，再 UO624 紅眼"
		},
		inbound: {
			flightNo: "CX505",
			from: "NRT T2",
			to: "澳門（經 HKG）",
			depart: "2026-11-04 18:00",
			arrive: "當日晚上",
			notes: "16:00 到成田 T2；國泰；到港後金巴返澳"
		}
	},
	openTasks: [
		"東橫兩間付款",
		"鬼怒川素泊（三餐自理）",
		"東武特急指定席 11/02+11/03"
	],
	days: [
		{
			date: "2026-10-25",
			weekday: "日",
			title: "澳門出發紅眼",
			city: "澳門",
			lat: 22.1987,
			lon: 113.5439,
			arrivalConstraint: "無",
			departureConstraint: "23:55 UO624 香港國際機場；建議 19:00 前到港珠澳澳門口岸",
			planA: [
				item("free", "17:30", "18:45", "出發前晚餐", "澳門市區", { notes: "喺澳門食完再出發，唔好指望機場晚餐。" }),
				transit("19:00", "21:10", "金巴＋B4", 130, 1400, "港珠澳澳門口岸", "香港國際機場", "金巴約 MOP/HK$65–70，轉 B4 約 HK$9.8。過關＋等車預留充足。日圓欄僅作佔位。"),
				item("activity", "21:10", "23:40", "辦理登機與候機", "香港國際機場", { notes: "UO624 紅眼，帶頸枕同耳塞。" }),
				item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
					highlight: true,
					notes: "澳門出發經港珠澳。飛行約 3 小時 50 分，到埗日本時間 26 日 04:45。"
				})
			],
			planB: [
				item("meal", "16:00", "17:10", "提早晚餐", "澳門市區", { notes: "趕封關巴士就要提早食。" }),
				transit("17:40", "19:40", "澳門香港機場直達", 120, 5200, "澳門口岸", "香港國際機場海天", "直達禁區、免入香港關。末班約 20:30，票約 MOP 280。建議搭 18:30–19:30 班。"),
				item("activity", "19:40", "23:40", "機場候機（室內備案）", "香港國際機場", { notes: "直達巴士入海天後過關登機，避開地面交通。" }),
				item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
					highlight: true,
					notes: "航班不變，只係提早過關。"
				})
			]
		},
		{
			date: "2026-10-26",
			weekday: "一",
			title: "入城＋上野藥妝＋秋葉原",
			city: "東京",
			lat: 35.6984,
			lon: 139.7731,
			stay: "東橫INN 神田秋葉原",
			arrivalConstraint: "04:45 羽田空港 T3 出關後才可入城",
			departureConstraint: "無；晚上回酒店",
			planA: [
				item("activity", "04:45", "05:45", "抵達＋出關", "羽田空港 第3航廈", { notes: "紅眼入境通常快。提款／買西瓜卡可在航廈內完成。" }),
				transit("05:45", "06:30", "京急＋JR", 45, 580, "羽田空港 T3", "淺草橋", "京急機場快特→品川，轉 JR 京濱東北／山手至秋葉原，再行一站淺草橋。"),
				item("hotel", "06:30", "07:00", "寄行李", "東橫INN 神田秋葉原", { notes: "CI 通常 16:00；早到可寄大袋。早餐多為免費 06:30–09:00。" }),
				item("meal", "07:00", "08:00", "早餐", "東橫INN 神田秋葉原", { notes: "用酒店早餐最穩陣，唔使再搵舖。" }),
				transit("08:10", "08:25", "JR 京濱東北", 8, 150, "秋葉原／淺草橋", "上野", "一站到上野。出廣小路口行入アメ横。"),
				item("activity", "08:30", "10:00", "上野買藥", "上野アメ横 藥妝街", {
					highlight: true,
					notes: "先 SUNDRUG／マツモトキヨシ／札幌藥妝比價。用藥妝券；液體之後要托運或符合機艙限制。"
				}),
				transit("10:10", "10:20", "JR 山手／京濱東北", 6, 150, "上野", "秋葉原", "回頭一站，袋唔好買太重就行得輕鬆。"),
				item("meal", "10:30", "11:20", "早午餐", "秋葉原", { notes: "站前或中央通。買完藥未食得滯可食輕。" }),
				item("activity", "11:30", "18:30", "ACG／電器", "秋葉原中央通", {
					highlight: true,
					notes: "直接掃秋葉原。先 Yodobashi／Animate，再側街同人誌。Bic Camera 券 10/31 到期。"
				}),
				item("meal", "18:40", "19:50", "晚餐", "秋葉原", { notes: "中央通行完即食。早睡補紅眼。" }),
				item("hotel", "20:00", "22:00", "入住休息", "東橫INN 神田秋葉原", { notes: "10/26–30 連住。" })
			],
			planB: [
				item("activity", "04:45", "05:45", "抵達＋出關", "羽田空港 第3航廈", { notes: "同方案 A。" }),
				transit("05:45", "06:30", "京急＋JR", 45, 580, "羽田空港 T3", "淺草橋", ""),
				item("hotel", "06:30", "10:00", "先瞓補眠（室內）", "東橫INN 神田秋葉原", { notes: "紅眼＋落雨就不要硬行。寄袋後問可否早入房。" }),
				transit("10:15", "10:30", "JR 京濱東北", 8, 150, "秋葉原／淺草橋", "上野", "藥妝舖全室內。"),
				item("activity", "10:30", "12:00", "上野買藥（室內）", "マツモトキヨシ 上野", {
					highlight: true,
					notes: "改行車站構內／アメ横騎樓藥妝，唔使入公園。"
				}),
				item("meal", "12:10", "13:00", "午餐", "上野駅 構內", { notes: "買完藥喺站食，淋唔到雨。" }),
				transit("13:10", "13:20", "JR 山手／京濱東北", 6, 150, "上野", "秋葉原", ""),
				item("activity", "13:25", "18:30", "秋葉原室內掃貨", "ヨドバシカメラ 秋葉原", {
					highlight: true,
					notes: "Yodobashi、Animate、Donki 全部室內。"
				}),
				item("meal", "18:40", "19:50", "晚餐", "秋葉原", { notes: "行完即食，早返酒店。" }),
				item("hotel", "20:00", "22:00", "入住休息", "東橫INN 神田秋葉原", {})
			]
		},
		{
			date: "2026-10-27",
			weekday: "二",
			title: "新宿一日",
			city: "東京",
			lat: 35.6896,
			lon: 139.7006,
			stay: "東橫INN 神田秋葉原",
			arrivalConstraint: "無",
			departureConstraint: "無；晚上回神田",
			planA: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:30", "11:00", "JR 總武線快速", 20, 200, "秋葉原／馬喰町", "新宿", "快速約 16 分，含步行。"),
				item("activity", "11:00", "13:20", "購物", "伊勢丹新宿店", {
					highlight: true,
					notes: "本館＋Isetan Men。鄰近 OIOI。小田急／京王券今日可用。"
				}),
				item("meal", "13:20", "14:20", "午餐", "伊勢丹新宿／ルミネ", { notes: "會食樓層或 Lumine 食街。" }),
				transit("14:20", "14:35", "步行", 10, 0, "伊勢丹新宿", "Alpen Tokyo", "東南口方向。"),
				item("activity", "14:35", "15:35", "睇裝備", "Alpen Tokyo", {
					highlight: true,
					notes: "Alpen 券：免稅再折 5%，2026/12/31 前。"
				}),
				transit("15:35", "15:50", "步行", 8, 0, "Alpen Tokyo", "BicCamera 新宿東口", ""),
				item("activity", "15:50", "19:00", "電器", "BicCamera／Yodobashi 新宿", {
					highlight: true,
					notes: "Bic 券 10/31 到期，今日係最佳使用日。Laox 同日到期。"
				}),
				item("meal", "19:15", "20:30", "晚餐", "新宿 思い出横丁", { notes: "炭火小店。人多就改麺屋武蔵。" }),
				transit("20:40", "21:10", "JR 總武線", 20, 200, "新宿", "秋葉原", "末班好密，唔趕。")
			],
			planB: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:30", "11:00", "JR 總武線快速", 20, 200, "秋葉原", "新宿", ""),
				item("activity", "11:00", "13:30", "室內百貨", "高島屋タイムズスクエア", {
					highlight: true,
					notes: "全室內。可轉京王百貨（滿 3,000 円 95 折）。"
				}),
				item("meal", "13:30", "14:30", "午餐", "京王百貨 新宿", { notes: "京王券：單筆滿 3,000 円 95 折。" }),
				item("activity", "14:45", "17:00", "東急手創／小田急", "東急ハンズ 新宿", {
					highlight: true,
					notes: "小田急券滿 1,000 円 6% off。"
				}),
				item("activity", "17:10", "19:00", "室內電器", "ヨドバシカメラ 新宿西口", {
					highlight: true,
					notes: "唔使行東口室外。"
				}),
				item("meal", "19:10", "20:20", "晚餐", "ルミネエスト 新宿", { notes: "車站構內，出閘即走。" }),
				transit("20:30", "21:00", "JR 總武線", 20, 200, "新宿", "秋葉原", "")
			]
		},
		{
			date: "2026-10-28",
			weekday: "三",
			title: "川崎聖地＋澀谷",
			city: "川崎",
			lat: 35.5308,
			lon: 139.7029,
			stay: "東橫INN 神田秋葉原",
			arrivalConstraint: "無",
			departureConstraint: "無；晚上回神田",
			planA: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:10", "11:00", "JR 京濱東北", 35, 310, "秋葉原", "川崎", "南行經東京、品川。"),
				item("activity", "11:00", "15:00", "GBC 聖地巡禮", "川崎駅前天橋／CLUB CITTA'", {
					highlight: true,
					notes: "Girls Band Cry 取景。天橋、站前、CITTA' 外觀。室外為主，帶遮。"
				}),
				transit("15:10", "16:00", "JR＋東急", 35, 350, "川崎", "渋谷", "品川轉山手，或武藏小杉轉東橫。"),
				item("activity", "16:00", "18:30", "購物", "渋谷 PARCO", {
					highlight: true,
					notes: "樓層全室內。同人、潮流、Cafe。"
				}),
				item("activity", "18:30", "20:20", "唱片＋十字路口", "タワーレコード 渋谷", {
					highlight: true,
					notes: "塔樓唱片行完再落十字路口影夜景。"
				}),
				item("meal", "20:20", "21:20", "晚餐", "渋谷", { notes: "PARCO 或道玄坂。避免太夜先返。" }),
				transit("21:30", "22:05", "JR 山手＋總武", 30, 200, "渋谷", "秋葉原", "山手至秋葉原直達。")
			],
			planB: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:40", "11:15", "JR 山手線", 28, 200, "秋葉原", "渋谷", "落雨就跳過川崎室外天橋。"),
				item("activity", "11:15", "14:00", "渋谷 PARCO 全日", "渋谷 PARCO", {
					highlight: true,
					notes: "室內主場。可加 SHIBUYA109。"
				}),
				item("meal", "14:00", "15:00", "午餐", "渋谷ヒカリエ", { notes: "食街室內。 " }),
				item("activity", "15:10", "17:30", "東急フードショー／東急プラザ", "渋谷スクランブルスクエア", {
					highlight: true,
					notes: "全天候室內。展望台可選。"
				}),
				item("activity", "17:40", "19:30", "Tower Records", "タワーレコード 渋谷", {
					highlight: true,
					notes: "室內。十字路口影相可改在連廊。"
				}),
				item("meal", "19:30", "20:40", "晚餐", "渋谷", {}),
				transit("20:50", "21:25", "JR 山手線", 28, 200, "渋谷", "秋葉原", "")
			]
		},
		{
			date: "2026-10-29",
			weekday: "四",
			title: "teamLab＋千客万来",
			city: "東京",
			lat: 35.655,
			lon: 139.7966,
			stay: "東橫INN 神田秋葉原",
			arrivalConstraint: "teamLab 要預先買時段票",
			departureConstraint: "無；晚上回神田",
			planA: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:20", "11:00", "JR＋百合海鷗", 35, 330, "淺草橋", "新豊洲", "淺草橋→新橋，轉ゆりかもめ至新豊洲。"),
				item("activity", "11:00", "13:00", "teamLab Planets", "チームラボプラネッツ TOKYO DMM", {
					highlight: true,
					notes: "要預先買時段。赤腳涉水，帶短襪同毛巾。室內，落雨都去得。"
				}),
				transit("13:00", "13:20", "步行", 12, 0, "teamLab Planets", "豊洲 千客万来", "有蓋行人通道為主。"),
				item("activity", "13:20", "16:20", "行街／食", "豊洲 千客万来", {
					highlight: true,
					notes: "溫泉＋市場食堂＋拉麵橫丁。入場免費，湯屋另計。"
				}),
				item("meal", "16:20", "17:20", "早期晚餐", "豊洲 千客万来 ラーメン横丁", { notes: "多家名店輪流，比築地易入座。" }),
				transit("17:30", "18:15", "百合海鷗＋JR", 35, 330, "新豊洲", "淺草橋", "原路返回。")
			],
			planB: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:20", "11:05", "JR＋百合海鷗", 40, 330, "淺草橋", "豊洲", "若 teamLab 時段取消／售罄。"),
				item("activity", "11:10", "13:30", "ららぽーと豊洲", "ららぽーと豊洲", {
					highlight: true,
					notes: "全室內商場。可改去豐洲市場室內食堂（需對開放日）。"
				}),
				item("meal", "13:30", "14:30", "午餐", "ららぽーと豊洲", {}),
				item("activity", "14:40", "17:00", "千客万来（有蓋）", "豊洲 千客万来", {
					highlight: true,
					notes: "市場同湯屋都有屋頂，作室內備案主場。"
				}),
				transit("17:15", "18:00", "百合海鷗＋JR", 35, 330, "新豊洲", "淺草橋", "")
			]
		},
		{
			date: "2026-10-30",
			weekday: "五",
			title: "拉麵祭＋池袋夜",
			city: "東京",
			lat: 35.6256,
			lon: 139.6617,
			stay: "東橫INN 神田秋葉原",
			arrivalConstraint: "無",
			departureConstraint: "今晚仍住神田；明早 checkout",
			planA: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:00", "11:00", "JR＋東急田園都市線", 50, 280, "秋葉原", "駒沢大学", "秋葉原→澀谷，轉田園都市線。"),
				item("activity", "11:00", "15:30", "東京拉麵祭", "駒沢オリンピック公園", {
					highlight: true,
					notes: "室外為主。帶現金、濕紙巾、遮。人潮大，先食再影。"
				}),
				transit("15:40", "16:30", "東急＋JR 山手", 40, 280, "駒沢大学", "池袋", "返澀谷轉山手北行。"),
				item("activity", "16:30", "18:30", "行店", "Animate 池袋本店", {
					highlight: true,
					notes: "本店樓層多。可順路 Sunshine City。"
				}),
				item("meal", "18:30", "19:30", "晚餐", "サンシャインシティ", { notes: "南池袋公園或 Sunshine 食街。" }),
				item("activity", "19:30", "22:00", "池ハロ Night", "サンシャインシティ", {
					highlight: true,
					notes: "萬聖節活動。室內商場＋室外廣場，視人流決定去邊層。"
				}),
				transit("22:10", "22:40", "JR 山手線", 22, 200, "池袋", "秋葉原", "末班前好充足。")
			],
			planB: [
				item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
				transit("10:30", "11:10", "JR 山手線", 25, 200, "秋葉原", "池袋", "落雨取消室外拉麵祭。"),
				item("activity", "11:15", "13:00", "Sunshine 水族館", "サンシャイン水族館", {
					highlight: true,
					notes: "全室內。可現場或提早網上票。"
				}),
				item("meal", "13:00", "14:00", "午餐", "サンシャインシティ", {}),
				item("activity", "14:00", "17:30", "Animate＋Namco", "Animate 池袋本店", {
					highlight: true,
					notes: "本店＋Sunshine 室內一日。"
				}),
				item("activity", "17:40", "21:00", "池ハロ（室內場）", "サンシャインシティ", {
					highlight: true,
					notes: "改行商場內活動，少企室外廣場。"
				}),
				transit("21:15", "21:45", "JR 山手線", 22, 200, "池袋", "秋葉原", "")
			]
		},
		{
			date: "2026-10-31",
			weekday: "六",
			title: "Fan Fest Day 1",
			city: "千葉",
			lat: 35.6483,
			lon: 140.0346,
			stay: "Livemax 蘇我駅前",
			arrivalConstraint: "要先寄走神田大袋；蘇我酒店只帶當日袋",
			departureConstraint: "晚上住蘇我，方便 D2 早場",
			planA: [
				item("hotel", "08:30", "09:30", "Check out，大袋寄走／暫存", "東橫INN 神田秋葉原", { notes: "大袋寄去 11/01 東橫INN 秋葉淺草橋，或酒店暫存。只帶當日袋去蘇我。" }),
				transit("09:30", "10:30", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "總武快速至千葉，轉內房一線至蘇我。"),
				item("hotel", "10:30", "10:50", "入酒店（只帶當日袋）", "ホテルリブマックス千葉蘇我駅前", { notes: "駅前 1 分鐘。放袋即走。" }),
				transit("10:50", "11:15", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "直達幕張メッセ最近駅。"),
				item("activity", "11:15", "18:00", "Fan Fest Day 1", "幕張メッセ", {
					highlight: true,
					notes: "FF14 Fan Festival。室內展覽廳。帶證、水、行動電源。"
				}),
				transit("18:10", "18:30", "JR 京葉線", 12, 200, "海浜幕張", "蘇我", ""),
				item("meal", "18:40", "20:00", "晚餐", "蘇我駅前", { notes: "駅前食肆。早瞓備戰 D2 THE PRIMALS。" }),
				item("hotel", "20:00", "22:00", "入住", "ホテルリブマックス千葉蘇我駅前", {})
			],
			planB: [
				item("hotel", "08:30", "09:30", "Check out，寄大袋", "東橫INN 神田秋葉原", { notes: "同方案 A。活動本身係室內，備案只加緩衝。" }),
				transit("09:40", "10:40", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "落雨多 10 分鐘出酒店。"),
				item("hotel", "10:40", "11:00", "入酒店放袋", "ホテルリブマックス千葉蘇我駅前", {}),
				transit("11:00", "11:20", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
				item("activity", "11:20", "17:30", "Fan Fest Day 1", "幕張メッセ", {
					highlight: true,
					notes: "若排隊過長，先去イオンモール幕張新都心避雨再入。"
				}),
				item("free", "17:30", "18:30", "AEON Mall 避雨／補給", "イオンモール幕張新都心", { notes: "會場步行可達，全室內。" }),
				transit("18:40", "19:00", "JR 京葉線", 12, 200, "海浜幕張", "蘇我", ""),
				item("meal", "19:10", "20:20", "晚餐", "蘇我駅前", {})
			]
		},
		{
			date: "2026-11-01",
			weekday: "日",
			title: "Fan Fest Day 2",
			city: "千葉",
			lat: 35.6483,
			lon: 140.0346,
			stay: "東橫INN 秋葉淺草橋",
			arrivalConstraint: "D2 早場；蘇我 09:10 出發",
			departureConstraint: "散場後轉住淺草橋，取回大袋",
			planA: [
				transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "住駅前，出門即上車。"),
				item("activity", "09:30", "18:00", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
					highlight: true,
					notes: "THE PRIMALS 演出日。提早入座／排隊。室內。"
				}),
				transit("18:15", "19:30", "京葉線＋JR", 65, 820, "海浜幕張", "淺草橋", "京葉至東京，轉總武至淺草橋。"),
				item("hotel", "19:30", "20:00", "入酒店（取回大袋）", "東橫INN 秋葉淺草橋", { notes: "11/01 同 11/03 住呢間。確認大袋已到。" }),
				item("meal", "20:00", "21:10", "晚餐", "淺草橋／秋葉原", { notes: "散場後簡單食。明日早出發日光。" })
			],
			planB: [
				transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
				item("activity", "09:30", "17:30", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
					highlight: true,
					notes: "演出仍係主軸。若戶外排隊遇雨，用會場連廊。"
				}),
				item("free", "17:30", "18:20", "會場連廊／AEON 等候", "イオンモール幕張新都心", { notes: "等人齊先返市區。" }),
				transit("18:25", "19:40", "京葉線＋JR", 65, 820, "海浜幕張", "淺草橋", ""),
				item("hotel", "19:40", "20:10", "入酒店取袋", "東橫INN 秋葉淺草橋", {}),
				item("meal", "20:10", "21:10", "晚餐", "淺草橋", {})
			]
		},
		{
			date: "2026-11-02",
			weekday: "一",
			title: "日光社寺＋鬼怒川",
			city: "日光",
			lat: 36.7581,
			lon: 139.5995,
			stay: "Tabist 鬼怒川パークコテージ",
			arrivalConstraint: "東武特急指定席；淺草 08:00 出發",
			departureConstraint: "旅館遲 CI，要預先講；今晚住鬼怒川",
			planA: [
				transit("08:00", "10:10", "東武特急（指定席）", 125, 2940, "淺草", "東武日光", "Spacia X／Revaty。指定席要提早買。"),
				transit("10:10", "10:30", "東武巴士", 15, 350, "東武日光", "神橋", "世界遺產巴士，下車即見神橋。"),
				item("activity", "10:30", "12:30", "神橋＋東照宮", "日光東照宮", {
					highlight: true,
					notes: "陽明門、三猿、眠貓。陽明門維修要查當日告示。"
				}),
				item("meal", "12:30", "13:30", "午餐", "東照宮表參道", { notes: "湯葉定食或烤鱒魚。表參道有蓋店鋪。" }),
				item("activity", "13:30", "16:10", "輪王寺＋二荒山", "輪王寺", {
					highlight: true,
					notes: "三社寺套票划算。二荒山石階視體力。"
				}),
				transit("16:15", "16:45", "東武巴士", 20, 350, "東照宮", "東武日光駅", ""),
				item("meal", "17:30", "19:00", "晚飯", "東武日光駅前", { notes: "駅前鄉土料理。轉車前食飽，旅館素泊無晚餐。" }),
				transit("19:10", "19:50", "東武線", 35, 760, "東武日光", "鬼怒川温泉", "特急或普通。"),
				item("hotel", "19:50", "20:20", "入旅館（遲 CI）", "Tabist 鬼怒川パークコテージ", {
					highlight: true,
					notes: "素泊、三餐自理。遲 CI 必須預先講。自助／超商解決宵夜。"
				})
			],
			planB: [
				transit("08:00", "10:10", "東武特急（指定席）", 125, 2940, "淺草", "東武日光", "列車照坐，改室內動線。"),
				item("activity", "10:25", "12:00", "日光駅 世界遺產會館", "日光世界遺産会館", { notes: "室內展覽，等雨勢細再上山。" }),
				transit("12:10", "12:30", "東武巴士", 15, 350, "東武日光", "輪王寺", "先去有大殿嘅輪王寺。"),
				item("activity", "12:30", "14:00", "輪王寺（室內）", "輪王寺", {
					highlight: true,
					notes: "三佛堂室內。東照宮宝物館可加。"
				}),
				item("meal", "14:00", "15:00", "午餐", "東照宮表參道", { notes: "有蓋店鋪。" }),
				item("activity", "15:00", "16:00", "東照宮宝物館", "日光東照宮宝物館", {
					highlight: true,
					notes: "少行室外參道。陽明門外觀看雨勢決定。"
				}),
				transit("16:10", "16:50", "東武巴士＋電車", 40, 760, "東照宮", "鬼怒川温泉", "提早入旅館浸湯。"),
				item("hotel", "17:00", "19:00", "提早 CI＋溫泉", "Tabist 鬼怒川パークコテージ", {
					highlight: true,
					notes: "雨天把浸湯當主行程。"
				}),
				item("meal", "19:00", "20:00", "自理晚餐", "鬼怒川温泉駅前", { notes: "セブン／駅前食堂。素泊。" })
			]
		},
		{
			date: "2026-11-03",
			weekday: "二",
			title: "橫濱演唱會",
			city: "橫濱",
			lat: 35.4578,
			lon: 139.6322,
			stay: "東橫INN 秋葉淺草橋",
			arrivalConstraint: "鬼怒川早上 checkout；東武特急指定席回淺草",
			departureConstraint: "ぴあアリーナMM 17:00 開場；散場後返淺草橋",
			planA: [
				item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", { notes: "素泊。駅前 7-11。" }),
				item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", { notes: "預留行去駅時間。確認鎖門同鑰匙。" }),
				transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", "11/03 指定席。到淺草後轉北千住較順。"),
				item("meal", "12:35", "12:55", "車站速食", "淺草駅／北千住", { notes: "只係墊肚，正餐留去みなとみらい。" }),
				transit("13:00", "14:15", "日比谷線＋東急東橫", 70, 580, "北千住", "みなとみらい", "日比谷直通東橫至みなとみらい。時間緊，唔好喺淺草逗留。"),
				item("free", "14:20", "16:00", "會場周邊＋早晚餐", "みなとみらい Queen's Square", { notes: "Queen's Square／MARK IS 室內。開場前食飽。" }),
				item("activity", "16:00", "17:00", "會場附近等開場", "ぴあアリーナMM", { notes: "確認入口、袋檢、周邊 enta。" }),
				item("activity", "17:00", "21:00", "赤色の響祭", "ぴあアリーナMM", {
					highlight: true,
					notes: "室內演唱會。散場人潮大，預先記新高島／櫻木町出口。"
				}),
				transit("21:15", "22:30", "東急東橫＋日比谷／JR", 70, 700, "新高島／櫻木町", "淺草橋", "末班足夠。可北千住轉。"),
				item("hotel", "22:30", "23:30", "回酒店", "東橫INN 秋葉淺草橋", { notes: "明日伴手禮＋回程。" })
			],
			planB: [
				item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", {}),
				item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", {}),
				transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", ""),
				transit("12:50", "14:10", "日比谷線＋東急東橫", 75, 580, "北千住", "みなとみらい", "落雨唔好行淺草室外。"),
				item("activity", "14:10", "16:00", "Landmark／Queen's Square 室內", "横浜ランドマークタワー", {
					highlight: true,
					notes: "全室內殺時間。展望台可選。"
				}),
				item("meal", "15:30", "16:20", "早晚餐", "Queen's Square 横浜", { notes: "開場前食完。" }),
				item("activity", "16:30", "21:00", "赤色の響祭", "ぴあアリーナMM", {
					highlight: true,
					notes: "演唱會室內，風雨唔影響。"
				}),
				transit("21:15", "22:30", "東急東橫＋日比谷", 70, 700, "新高島", "淺草橋", "")
			]
		},
		{
			date: "2026-11-04",
			weekday: "三",
			title: "伴手禮回程",
			city: "東京",
			lat: 35.6812,
			lon: 139.7671,
			arrivalConstraint: "無；早上退房淺草橋",
			departureConstraint: "16:00 到成田 T2；CX505 18:00",
			planA: [
				item("hotel", "09:30", "10:10", "Check out 寄袋／帶袋", "東橫INN 秋葉淺草橋", { notes: "大袋直接帶去東京駅／成田。" }),
				transit("10:20", "10:30", "JR 總武線", 6, 150, "淺草橋", "東京駅", "一站之隔。"),
				item("activity", "10:30", "12:30", "伴手禮", "東京駅一番街", {
					highlight: true,
					notes: "Kit Kat、ROYCE、東京香蕉、キャラクターストリート。記住液體安檢。"
				}),
				item("meal", "12:30", "13:20", "午餐", "東京駅 GRANSTA", { notes: "最後一餐日食。13:45 要去月台。" }),
				transit("13:45", "15:20", "成田エクスプレス", 65, 3250, "東京駅", "成田空港 T2", "N'EX 指定席。目標 15:20–16:00 入航廈。"),
				item("activity", "15:20", "17:40", "辦理登機＋免稅", "成田空港 第2航廈", {
					highlight: true,
					notes: "成田免稅券 95 折。16:00 到場，18:00 起飛。"
				}),
				item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
					highlight: true,
					notes: "國泰。約 21:20–22:00 到 HKG，再金巴返澳門。"
				}),
				transit("22:20", "00:20+1", "B4＋金巴返澳門", 120, 1400, "香港國際機場", "港珠澳澳門口岸", "趕唔切機場直達末班（約 21:30）就用金巴通宵。日圓欄僅作佔位。")
			],
			planB: [
				item("hotel", "09:00", "09:40", "提早 Check out", "東橫INN 秋葉淺草橋", { notes: "風雨或誤點風險高就提早走。" }),
				transit("09:50", "10:00", "JR 總武線", 6, 150, "淺草橋", "東京駅", ""),
				item("activity", "10:00", "12:00", "伴手禮（全室內）", "東京駅一番街", {
					highlight: true,
					notes: "唔出丸之內室外。"
				}),
				item("meal", "12:00", "12:40", "午餐", "東京駅 GRANSTA", {}),
				transit("12:50", "14:10", "成田エクスプレス（早班）", 65, 3250, "東京駅", "成田空港 T2", "提早一班，15:00 前到 T2。"),
				item("activity", "14:10", "17:40", "免稅＋候機", "成田空港 第2航廈", {
					highlight: true,
					notes: "用成田／線上訂 95 折券。多餘時間留喺禁區。"
				}),
				item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
					highlight: true,
					notes: "航班不變。提早到港較易趕機場直達。"
				}),
				transit("22:10", "23:40", "機場直達／金巴返澳門", 90, 1400, "香港國際機場", "澳門口岸", "提早班較有機會搭到直達巴士；否則金巴通宵。")
			]
		}
	],
	foods: [
		{
			name: "牛かつ もと村 秋葉原店",
			city: "東京",
			category: "炸牛排",
			reason: "上野買完藥一站到秋葉原，出餐快、外國人友善，適合 10/26 早午餐。",
			mapsQuery: "牛かつ もと村 秋葉原",
			priceBand: "¥1,200–1,800"
		},
		{
			name: "ジャンクガレッジ 秋葉原店",
			city: "東京",
			category: "拉麵",
			reason: "中央通行完好補，分量大，紅眼當日晚餐夠飽。",
			mapsQuery: "ジャンクガレッジ 秋葉原",
			priceBand: "¥1,000–1,500"
		},
		{
			name: "麺屋武蔵 武骨 新宿店",
			city: "東京",
			category: "拉麵",
			reason: "新宿電器同 Alpen 行完可走去，濃厚魚介豚骨，夜晚觀光客龍較短。",
			mapsQuery: "麺屋武蔵 武骨 新宿",
			priceBand: "¥1,000–1,400"
		},
		{
			name: "豊洲 千客万来 ラーメン横丁",
			city: "東京",
			category: "市場食堂",
			reason: "teamLab 完場步行可達，多家名店輪替，比築地容易入座。",
			mapsQuery: "豊洲 千客万来",
			priceBand: "¥1,000–2,000"
		},
		{
			name: "日光湯波料理 梅の家",
			city: "日光",
			category: "鄉土料理",
			reason: "東照宮表參道，湯葉定食同社寺行程夾，比駅前更近參觀動線。",
			mapsQuery: "日光湯波料理 梅の家",
			priceBand: "¥1,500–2,800"
		}
	],
	coupons: [
		coupon({
			name: "Donki唐吉訶德",
			discount: "滿額免稅，最高再折7%",
			expiry: "無期限",
			tags: ["綜合"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-9",
			final_url: "https://japanportal.donki-global.com/coupon/?ptcd=0076003303",
			kind: "page"
		}),
		coupon({
			name: "Bic Camera",
			discount: "滿額免稅，最高再折7%",
			expiry: "2026/10/31",
			tags: ["電器"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-1",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/BicCamera_260820.png",
			kind: "image"
		}),
		coupon({
			name: "SALONIA",
			discount: "購買指定商品，享有95折優惠（需與 Bic Camera優惠券 一同使用）",
			expiry: "2026/11/30",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-19",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/salonia_260820.jpg",
			kind: "image"
		}),
		coupon({
			name: "愛電王Edion",
			discount: "滿額免稅，最高再折7%",
			expiry: "2026/12/31",
			tags: ["電器"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-10",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/edion2025.jpg",
			kind: "image"
		}),
		coupon({
			name: "Laox",
			discount: "滿額免稅，再折8%",
			expiry: "2026/10/31",
			tags: ["電器"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-15",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/LAOX_2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "成田機場免稅店",
			discount: "享有95折優惠",
			expiry: "2027/3/31",
			tags: ["機場", "免稅"],
			region: "東京",
			link: "https://funtime.tw/c/blog-68172-16",
			final_url: "https://duty-free-japan.jp/narita/ta/content/coupon2833-30.html",
			kind: "page"
		}),
		coupon({
			name: "成田/羽田機場 免稅商品線上訂",
			discount: "享有95折優惠",
			expiry: "無期限",
			tags: ["機場", "免稅"],
			region: "東京",
			link: "https://funtime.tw/c/blog-68172-17",
			final_url: "https://duty-free-japan.jp/qrposter/tc/?agentid=123",
			kind: "page"
		}),
		coupon({
			name: "SUNDRUG",
			discount: "滿額免稅，再享3~7%折扣",
			expiry: "無期限",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/b2s50T",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/sundrug%20_funtime.jpg",
			kind: "image"
		}),
		coupon({
			name: "鶴羽藥妝",
			discount: "滿額免稅，最高享免稅+7%優惠",
			expiry: "2027/12/31",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-11",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/tsuruha2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "札幌藥妝",
			discount: "滿額免稅，最高享免稅+7%優惠",
			expiry: "無期限",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-13",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/2026sapporo.jpg",
			kind: "image"
		}),
		coupon({
			name: "cosmos",
			discount: "滿額免稅，最高享免稅+9%優惠",
			expiry: "2026/12/31",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/DsrcXF",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/cosmos2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "DRUG ELEVEN",
			discount: "滿額免稅，最高享免稅+7%優惠",
			expiry: "2027/2/28",
			tags: ["藥妝"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-22",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/DRUGELEVEN_2027.jpg",
			kind: "image"
		}),
		coupon({
			name: "小田急百貨",
			discount: "消費滿1千日圓(含稅)，可享6%優惠",
			expiry: "2028/3/31",
			tags: ["百貨"],
			region: "東京",
			link: "https://funtime.tw/c/blog-68172-12",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/odakyu.png",
			kind: "image"
		}),
		coupon({
			name: "近鐵百貨店",
			discount: "滿2千日圓(不含稅)，可享有95折優惠",
			expiry: "2026/12/31",
			tags: ["百貨"],
			region: "關西",
			link: "https://funtime.tw/c/blog-68172-14",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/kintetsu2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "銀座樂天免稅店",
			discount: "滿1萬日圓，折1千日圓；滿2萬日圓，折2千日圓",
			expiry: "2027/1/31",
			tags: ["機場", "免稅"],
			region: "東京",
			link: "https://funtime.tw/c/blog-68172-7",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/Lottedutyfree_GINZA_FunTime2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "大丸松坂屋",
			discount: "單筆消費含稅滿3千日圓，享95折",
			expiry: "2026/8/31",
			tags: ["百貨"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-6",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/daimaru_250820.pdf",
			kind: "page"
		}),
		coupon({
			name: "西武百貨",
			discount: "消費滿1千日圓，享95折",
			expiry: "2027/12/31",
			tags: ["百貨"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-2",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/seibu2027.jpg",
			kind: "image"
		}),
		coupon({
			name: "京王百貨",
			discount: "單筆消費滿3千日圓，享95折",
			expiry: "2027/3/31",
			tags: ["百貨"],
			region: "東京",
			link: "https://funtime.tw/c/blog-68172-3",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/Keio_2026.jpg",
			kind: "image"
		}),
		coupon({
			name: "Alpen",
			discount: "免稅再折5%",
			expiry: "2026/12/31",
			tags: ["運動"],
			region: null,
			link: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
			kind: "image"
		}),
		coupon({
			name: "Victoria運動用品",
			discount: "免稅再折5%",
			expiry: "2026/12/31",
			tags: ["運動"],
			region: null,
			link: "https://funtime.tw/c/blog-68172-8",
			final_url: "https://www.funtime.com.tw/travelstore/coupon/FunTime_Victoria_202612.jpg",
			kind: "image"
		})
	]
};
var AI_FOOD_PROMPT = `你是日本旅遊美食顧問。只回 JSON array，不要 markdown、不要前言。
必須剛好 3 間餐廳，欄位僅限：name, city, category, reason, mapsQuery, priceBand。
reason 用繁體中文 1–2 句。priceBand 用日圓區間例如 "¥1,000–1,800"。
行程：澳門出發（經香港機場 UO624）東京 2026-10-25 至 11-04，景點含淺草、押上、秋葉原、新宿、川崎、豐洲 teamLab、駒澤拉麵祭、池袋、幕張 Fan Fest、日光東照宮、鬼怒川、橫濱ぴあアリーナMM、東京駅伴手禮。
請推薦行程沿線、外國人友善、不必抽籤的店。`;
var config = {
	aiProvider: "xai",
	xai: {
		apiKey: "",
		endpoint: "https://api.x.ai/v1/chat/completions",
		model: "grok-4.6"
	},
	gemini: {
		apiKey: "",
		endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
	}
};
var PLAN_STORAGE = "tokyo-aurora-plan-choice";
var TAB_STORAGE = "tokyo-aurora-tab";
var DAY_STORAGE = "tokyo-aurora-day";
var TODAY_ISO = "2026-09-07";
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
function mapsLink(name) {
	return `https://maps.google.com/maps?q=${encodeURIComponent(name)}`;
}
function inferCouponTags(name, existing) {
	if (existing.length) return existing;
	const n = name.toLowerCase();
	const tags = [];
	if (/bic|愛電王|edion|laox|victoria/i.test(name) || n.includes("victoria")) tags.push("電器");
	if (/sundrug|鶴羽|札幌|cosmos|salonia|drug/i.test(n + name)) tags.push("藥妝");
	if (/近鐵|大丸|西武|名鐵|京王|小田急/.test(name)) tags.push("百貨");
	if (/donki|唐吉/.test(name)) tags.push("綜合");
	if (/機場|成田|羽田|免稅/.test(name)) tags.push("機場");
	if (/alpen|victoria|運動/.test(n + name) && !tags.includes("電器")) tags.push("運動");
	return tags.length ? tags : ["其他"];
}
function defaultDay() {
	const start = TRIP.startDate;
	const end = TRIP.endDate;
	if (TODAY_ISO < start) return start;
	if (TODAY_ISO > end) return end;
	return TRIP.days.find((d) => d.date === TODAY_ISO)?.date ?? start;
}
function daysUntil(date) {
	const a = (/* @__PURE__ */ new Date(`${TODAY_ISO}T00:00:00+09:00`)).getTime();
	const b = (/* @__PURE__ */ new Date(`${date}T00:00:00+09:00`)).getTime();
	return Math.round((b - a) / 864e5);
}
function readJson(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function weatherLabel(code) {
	if (code === 0) return {
		label: "晴",
		Icon: Sun
	};
	if (code === 1) return {
		label: "大致晴",
		Icon: Sun
	};
	if (code === 2) return {
		label: "間中有雲",
		Icon: CloudSun
	};
	if (code === 3) return {
		label: "陰",
		Icon: Cloud
	};
	if (code === 45 || code === 48) return {
		label: "霧",
		Icon: CloudFog
	};
	if ([
		51,
		53,
		55,
		56,
		57
	].includes(code)) return {
		label: "毛毛雨",
		Icon: CloudDrizzle
	};
	if ([
		61,
		63,
		65,
		66,
		67
	].includes(code)) return {
		label: "雨",
		Icon: CloudRain
	};
	if ([
		71,
		73,
		75,
		77
	].includes(code)) return {
		label: "雪",
		Icon: Snowflake
	};
	if ([
		80,
		81,
		82
	].includes(code)) return {
		label: "驟雨",
		Icon: CloudRain
	};
	if ([85, 86].includes(code)) return {
		label: "雪驟",
		Icon: Snowflake
	};
	if ([
		95,
		96,
		99
	].includes(code)) return {
		label: "雷雨",
		Icon: CloudLightning
	};
	return {
		label: "天氣",
		Icon: Cloud
	};
}
function useWeather(lat, lon, date) {
	const [state, setState] = (0, import_react.useState)({ status: "loading" });
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const run = async () => {
			setState({ status: "loading" });
			try {
				const result = await fetchWeather({ data: {
					lat,
					lon,
					date
				} });
				if (cancelled) return;
				if (result.ok) {
					setState({
						status: "ok",
						code: result.code,
						tMin: result.tMin,
						tMax: result.tMax,
						source: result.source
					});
					return;
				}
				setState({ status: "empty" });
			} catch {
				if (!cancelled) setState({ status: "empty" });
			}
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [
		lat,
		lon,
		date
	]);
	return state;
}
function TypeIcon({ type }) {
	const cls = "size-3.5 shrink-0";
	if (type === "transit") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: cls });
	if (type === "meal") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: cls });
	if (type === "flight") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: cls });
	if (type === "hotel") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, { className: cls });
	if (type === "free") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { className: cls });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: cls });
}
function typeLabel(type) {
	switch (type) {
		case "transit": return "交通";
		case "meal": return "用餐";
		case "flight": return "航班";
		case "hotel": return "住宿";
		case "free": return "自由";
		default: return "活動";
	}
}
function WeatherPill({ lat, lon, date }) {
	const weather = useWeather(lat, lon, date);
	if (weather.status === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-surface/80 px-2.5 py-1 text-xs text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), "讀取天氣"]
	});
	if (weather.status === "empty") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-full bg-surface/80 px-2.5 py-1 text-xs text-muted",
		children: "天氣暫無"
	});
	const { label, Icon } = weatherLabel(weather.code);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1 text-xs text-fg",
		title: weather.source === "archive" ? "參考去年同期" : "預報",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-muted",
				children: [
					Math.round(weather.tMin),
					"° / ",
					Math.round(weather.tMax),
					"°"
				]
			}),
			weather.source === "archive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-highlight/15 px-1.5 py-px text-xs font-medium tracking-wide text-highlight",
				children: "Ref"
			}) : null
		]
	});
}
function TimelineCard({ item }) {
	const isTransit = item.type === "transit";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-xl p-3.5 transition-shadow duration-150", item.highlight ? "bg-highlight/10 shadow-[0_0_0_1px_rgba(251,191,36,0.45)]" : isTransit ? "bg-surface-2/80 shadow-border" : "glass rounded-xl"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeIcon, { type: item.type }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: typeLabel(item.type) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-fg/90",
							children: [
								item.startTime,
								" – ",
								item.endTime
							]
						})
					]
				}), item.highlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-0.5 rounded-full bg-highlight/20 px-2 py-0.5 text-xs font-semibold text-highlight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-2.5" }), "重點"]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-1.5 font-medium leading-snug text-fg",
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: item.mapsUrl || mapsLink(item.locationName),
				target: "_blank",
				rel: "noreferrer",
				className: "mt-1 inline-flex items-center gap-1 text-sm text-accent hover:text-primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "underline-offset-2 hover:underline",
						children: item.locationName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3 opacity-70" })
				]
			}),
			isTransit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 grid grid-cols-3 gap-2 rounded-lg bg-bg/40 px-2.5 py-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-subtle",
						children: "工具"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 font-medium text-fg",
						children: item.mode
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1 text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), "耗時"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 font-medium tabular-nums text-fg",
						children: [item.durationMin, " 分"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-1 text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-3" }), "預估"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 font-medium tabular-nums text-fg",
						children: item.costJPY ? `¥${item.costJPY.toLocaleString()}` : "—"
					})] })
				]
			}) : null,
			item.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: item.notes
			}) : null
		]
	});
}
function DayTimeline({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative ml-2 space-y-3 border-l border-border pl-5",
		children: items.map((it, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute -left-[25px] top-4 size-2.5 rounded-full", it.highlight ? "bg-highlight" : it.type === "transit" ? "bg-accent/70" : "bg-primary") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineCard, { item: it })]
		}, `${it.startTime}-${it.title}-${idx}`))
	});
}
function ItineraryTab({ day, planKey, onTogglePlan }) {
	const items = planKey === "B" ? day.planB : day.planA;
	const hasB = day.planB.length > 0;
	const countdown = daysUntil(TRIP.startDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "glass-strong relative overflow-hidden rounded-2xl p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 top-0 h-20 w-32 aurora-line opacity-40" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-wide text-muted",
							children: [
								day.date.replace("2026-", ""),
								" · ",
								day.weekday,
								" · ",
								day.city
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-xl font-semibold text-fg",
							children: day.title
						}),
						day.stay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: ["住宿 ", day.stay]
						}) : null
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherPill, {
						lat: day.lat,
						lon: day.lon,
						date: day.date
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-1 text-xs text-muted",
					children: [day.arrivalConstraint !== "無" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["抵達限制：", day.arrivalConstraint] }) : null, day.departureConstraint !== "無" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["離開限制：", day.departureConstraint] }) : null]
				}),
				countdown > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-primary",
					children: [
						"出發倒數 ",
						countdown,
						" 日"
					]
				}) : countdown === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-primary",
					children: "今日出發"
				}) : null,
				hasB ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onTogglePlan,
					className: "mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg transition-transform duration-150 active:scale-[0.98]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "切換方案 / 雨天備案"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"目前：方案 ",
						planKey,
						planKey === "A" ? "（主行程）" : "（雨天／室內備案）"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayTimeline, { items })]
	});
}
function parseFoodArray(text) {
	const start = text.indexOf("[");
	const end = text.lastIndexOf("]");
	if (start < 0 || end <= start) throw new Error("no json");
	const raw = JSON.parse(text.slice(start, end + 1));
	if (!Array.isArray(raw)) throw new Error("not array");
	const foods = [];
	for (const row of raw) {
		if (!row || typeof row !== "object") continue;
		const r = row;
		const name = String(r.name ?? "").trim();
		if (!name) continue;
		foods.push({
			name,
			city: String(r.city ?? "").trim(),
			category: String(r.category ?? "").trim(),
			reason: String(r.reason ?? "").trim(),
			mapsQuery: String(r.mapsQuery ?? name).trim(),
			priceBand: String(r.priceBand ?? "").trim()
		});
	}
	if (foods.length < 3) throw new Error("need 3");
	return foods.slice(0, 3);
}
async function fetchClientXai() {
	const key = config.xai.apiKey.trim();
	if (!key) throw new Error("empty key");
	const res = await fetch(config.xai.endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: config.xai.model,
			temperature: .7,
			max_tokens: 800,
			messages: [{
				role: "user",
				content: AI_FOOD_PROMPT
			}]
		})
	});
	if (!res.ok) throw new Error(`http_${res.status}`);
	return parseFoodArray((await res.json()).choices?.[0]?.message?.content ?? "");
}
function FoodCard({ food }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "glass rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [food.city, food.category ? ` · ${food.category}` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 text-base font-semibold text-fg",
					children: food.name
				})] }), food.priceBand ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full bg-primary/15 px-2 py-1 text-xs tabular-nums text-primary",
					children: food.priceBand
				}) : null]
			}),
			food.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: food.reason
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: mapsLink(food.mapsQuery || food.name),
				target: "_blank",
				rel: "noreferrer",
				className: "mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-2 px-4 text-sm font-medium text-accent shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), "Map"]
			})
		]
	});
}
function FoodTab() {
	const [foods, setFoods] = (0, import_react.useState)(TRIP.foods);
	const [offline, setOffline] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const onAi = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			try {
				const server = await recommendFoods();
				if (server.ok && server.foods.length >= 3) {
					setFoods(server.foods);
					setOffline(false);
					return;
				}
			} catch {}
			try {
				const client = await fetchClientXai();
				setFoods(client);
				setOffline(false);
			} catch {
				setFoods(TRIP.foods);
				setOffline(true);
			}
		} finally {
			setLoading(false);
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "沿線推薦"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "先睇預先揀好嘅店，再叫 AI 補三間"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void onAi(),
					disabled: loading,
					className: "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-start whitespace-nowrap rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg active:scale-[0.98] disabled:opacity-60",
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "AI 智能推薦"]
				})]
			}),
			offline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl bg-highlight/12 px-3 py-2 text-sm text-highlight shadow-[0_0_0_1px_rgba(251,191,36,0.28)]",
				children: "目前使用離線推薦"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: foods.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodCard, { food: f }, f.name))
			})
		]
	});
}
function CouponModal({ coupon, onClose }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 p-4 backdrop-blur-sm",
		onClick: onClose,
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-strong max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl p-4",
			onClick: (e) => e.stopPropagation(),
			role: "dialog",
			"aria-modal": "true",
			"aria-label": coupon.name,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: coupon.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg",
						"aria-label": "關閉",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-fg",
					children: coupon.discount
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted",
					children: ["到期：", coupon.expiry]
				}),
				coupon.region ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted",
					children: ["地區：", coupon.region]
				}) : null,
				coupon.expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium text-danger",
					children: "已過期"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: inferCouponTags(coupon.name, coupon.tags).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary",
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: coupon.final_url || coupon.link,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-fg",
					children: ["開啟優惠", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
				})
			]
		})
	});
}
function CouponsTab() {
	const allTags = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set(["全部"]);
		for (const c of TRIP.coupons) for (const t of inferCouponTags(c.name, c.tags)) set.add(t);
		return [...set];
	}, []);
	const [filter, setFilter] = (0, import_react.useState)("全部");
	const [open, setOpen] = (0, import_react.useState)(null);
	const list = TRIP.coupons.filter((c) => {
		if (filter === "全部") return true;
		return inferCouponTags(c.name, c.tags).includes(filter);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "優惠券"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "點卡片睇詳情同外連 · 過期會變暗"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
				children: allTags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(tag),
					className: cn("inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150", filter === tag ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted shadow-border"),
					children: tag
				}, tag))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen(c),
					className: cn("glass rounded-2xl p-4 text-left transition-shadow duration-150 hover:shadow-border-hover", c.expired && "opacity-45"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold leading-snug",
								children: c.name
							}), c.expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-danger/20 px-2 py-0.5 text-xs font-semibold text-danger",
								children: "已過期"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted",
							children: c.discount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-subtle",
							children: ["到期 ", c.expiry]
						}),
						c.region ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-subtle",
							children: c.region
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: inferCouponTags(c.name, c.tags).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/12 px-2 py-0.5 text-xs text-primary",
								children: t
							}, t))
						})
					]
				}, c.name))
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponModal, {
				coupon: open,
				onClose: () => setOpen(null)
			}) : null
		]
	});
}
function BottomNav({ tab, onTab }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "glass-strong fixed bottom-0 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 border-t border-glass-border pb-[env(safe-area-inset-bottom)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-3",
			children: [
				{
					id: "itinerary",
					label: "行程",
					Icon: CalendarRange
				},
				{
					id: "food",
					label: "美食",
					Icon: UtensilsCrossed
				},
				{
					id: "coupons",
					label: "優惠券",
					Icon: Ticket
				}
			].map(({ id, label, Icon }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onTab(id),
					className: cn("flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-xs font-medium", tab === id ? "text-primary" : "text-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), label]
				}) }, id);
			})
		})
	});
}
function isTabId(v) {
	return v === "itinerary" || v === "food" || v === "coupons";
}
function BootSplash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh w-full items-center justify-center bg-bg",
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold tracking-tight text-fg",
					children: "東京 2026"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "載入中…"
				})
			]
		})
	});
}
function App() {
	const [tab, setTab] = (0, import_react.useState)("itinerary");
	const [dayId, setDayId] = (0, import_react.useState)(TRIP.startDate);
	const [plans, setPlans] = (0, import_react.useState)({});
	const [ready, setReady] = (0, import_react.useState)(false);
	const mainRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const tabRaw = readJson(TAB_STORAGE, "itinerary");
		const nextTab = isTabId(tabRaw) ? tabRaw : "itinerary";
		const dayRaw = readJson(DAY_STORAGE, defaultDay());
		const nextDay = TRIP.days.some((d) => d.date === dayRaw) ? dayRaw : defaultDay();
		const storedPlans = readJson(PLAN_STORAGE, {});
		const nextPlans = {};
		for (const [key, value] of Object.entries(storedPlans)) if (value === "A" || value === "B") nextPlans[key] = value;
		setTab(nextTab);
		setDayId(nextDay);
		setPlans(nextPlans);
		const finish = () => {
			if (!cancelled) setReady(true);
		};
		const timer = window.setTimeout(finish, 1e3);
		(document.fonts?.ready ?? Promise.resolve()).finally(() => {
			window.clearTimeout(timer);
			requestAnimationFrame(finish);
		});
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		localStorage.setItem(TAB_STORAGE, JSON.stringify(tab));
	}, [tab, ready]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		localStorage.setItem(DAY_STORAGE, JSON.stringify(dayId));
	}, [dayId, ready]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		localStorage.setItem(PLAN_STORAGE, JSON.stringify(plans));
	}, [plans, ready]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		mainRef.current?.scrollTo({ top: 0 });
	}, [
		dayId,
		tab,
		ready
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootSplash, {});
	const selected = TRIP.days.find((d) => d.date === dayId) ?? TRIP.days[0];
	if (!selected) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootSplash, {});
	const day = selected;
	const planKey = plans[day.date] ?? "A";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-dvh w-full justify-center overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-dvh w-full max-w-2xl flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "shrink-0 border-b border-glass-border bg-bg/80 pt-3 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg font-semibold tracking-tight text-fg",
							children: "東京 2026"
						})
					}), tab === "itinerary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3",
						children: TRIP.days.map((d) => {
							const active = d.date === day.date;
							const md = d.date.slice(5).replace("-", "/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDayId(d.date),
								className: cn("flex min-h-14 w-20 shrink-0 flex-col items-center justify-center rounded-2xl px-3 text-center transition-colors duration-150", active ? "bg-primary text-primary-fg" : "glass text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: d.weekday
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold tabular-nums",
									children: md
								})]
							}, d.date);
						})
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					ref: mainRef,
					className: "min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-28",
					children: [
						tab === "itinerary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItineraryTab, {
							day,
							planKey,
							onTogglePlan: () => setPlans((prev) => ({
								...prev,
								[day.date]: (prev[day.date] ?? "A") === "A" ? "B" : "A"
							}))
						}) : null,
						tab === "food" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodTab, {}) : null,
						tab === "coupons" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponsTab, {}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {
					tab,
					onTab: setTab
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as component };
