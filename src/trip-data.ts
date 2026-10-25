export type ItemType = "activity" | "transit" | "meal" | "flight" | "hotel" | "free";

export interface PlanItem {
  type: ItemType;
  startTime: string;
  endTime: string;
  title: string;
  locationName: string;
  mapsUrl: string;
  highlight: boolean;
  notes: string;
  mode?: string;
  durationMin?: number;
  costJPY?: number;
  from?: string;
  to?: string;
}

export interface DayPlan {
  date: string;
  weekday: string;
  title: string;
  city: string;
  lat: number;
  lon: number;
  stay?: string;
  arrivalConstraint: string;
  departureConstraint: string;
  planA: PlanItem[];
  planB: PlanItem[];
}

export interface FoodRec {
  name: string;
  city: string;
  category: string;
  reason: string;
  mapsQuery: string;
  priceBand: string;
}

export interface Coupon {
  name: string;
  discount: string;
  expiry: string;
  expired: boolean;
  tags: string[];
  region: string | null;
  link: string;
  final_url: string;
  kind: "page" | "image";
}

export interface TripData {
  tripTitle: string;
  theme: string;
  startDate: string;
  endDate: string;
  flights: {
    outbound: {
      flightNo: string;
      from: string;
      to: string;
      depart: string;
      arrive: string;
      notes: string;
    };
    inbound: {
      flightNo: string;
      from: string;
      to: string;
      depart: string;
      arrive: string;
      notes: string;
    };
  };
  openTasks: string[];
  days: DayPlan[];
  foods: FoodRec[];
  coupons: Coupon[];
}

const TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function mapsUrl(q: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}`;
}

function item(
  type: ItemType,
  startTime: string,
  endTime: string,
  title: string,
  locationName: string,
  extra: Partial<PlanItem> = {},
): PlanItem {
  return {
    type,
    startTime,
    endTime,
    title,
    locationName,
    mapsUrl: mapsUrl(locationName),
    highlight: false,
    notes: "",
    ...extra,
  };
}

function transit(
  startTime: string,
  endTime: string,
  mode: string,
  durationMin: number,
  costJPY: number,
  from: string,
  to: string,
  notes = "",
): PlanItem {
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
    to,
  };
}

function isExpired(expiry: string): boolean {
  if (!expiry || expiry === "無期限") return false;
  const m = expiry.replace(/[./]/g, "-").match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return false;
  const iso = `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return iso < TODAY;
}

function coupon(c: Omit<Coupon, "expired"> & { expired?: boolean }): Coupon {
  return { ...c, expired: c.expired ?? isExpired(c.expiry) };
}

export const TRIP: TripData = {
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
      notes: "澳門金巴／機場直達去 HKG，再 UO624 紅眼",
    },
    inbound: {
      flightNo: "CX505",
      from: "NRT T2",
      to: "澳門（經 HKG）",
      depart: "2026-11-04 18:00",
      arrive: "當日晚上",
      notes: "16:00 到成田 T2；國泰；到港後金巴返澳",
    },
  },
  openTasks: ["東橫兩間付款", "鬼怒川素泊（三餐自理）", "東武特急指定席 11/02+11/03"],
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
        item("free", "17:30", "18:45", "出發前晚餐", "澳門市區", {
          notes: "喺澳門食完再出發，唔好指望機場晚餐。",
        }),
        transit("19:00", "21:10", "金巴＋B4", 130, 1400, "港珠澳澳門口岸", "香港國際機場", "金巴約 MOP/HK$65–70，轉 B4 約 HK$9.8。過關＋等車預留充足。日圓欄僅作佔位。"),
        item("activity", "21:10", "23:40", "辦理登機與候機", "香港國際機場", {
          notes: "UO624 紅眼，帶頸枕同耳塞。",
        }),
        item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
          highlight: true,
          notes: "澳門出發經港珠澳。飛行約 3 小時 50 分，到埗日本時間 26 日 04:45。",
        }),
      ],
      planB: [
        item("meal", "16:00", "17:10", "提早晚餐", "澳門市區", {
          notes: "趕封關巴士就要提早食。",
        }),
        transit("17:40", "19:40", "澳門香港機場直達", 120, 5200, "澳門口岸", "香港國際機場海天", "直達禁區、免入香港關。末班約 20:30，票約 MOP 280。建議搭 18:30–19:30 班。"),
        item("activity", "19:40", "23:40", "機場候機（室內備案）", "香港國際機場", {
          notes: "直達巴士入海天後過關登機，避開地面交通。",
        }),
        item("flight", "23:55", "04:45+1", "UO624 紅眼飛羽田", "HKG → HND T3", {
          highlight: true,
          notes: "航班不變，只係提早過關。",
        }),
      ],
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
        item("activity", "04:45", "05:45", "抵達＋出關", "羽田空港 第3航廈", {
          notes: "紅眼入境通常快。提款／買西瓜卡可在航廈內完成。",
        }),
        transit("05:45", "06:30", "京急＋JR", 45, 580, "羽田空港 T3", "淺草橋", "京急機場快特→品川，轉 JR 京濱東北／山手至秋葉原，再行一站淺草橋。"),
        item("hotel", "06:30", "07:00", "寄行李", "東橫INN 神田秋葉原", {
          notes: "CI 通常 16:00；早到可寄大袋。早餐多為免費 06:30–09:00。",
        }),
        item("meal", "07:00", "08:00", "早餐", "東橫INN 神田秋葉原", {
          notes: "用酒店早餐最穩陣，唔使再搵舖。",
        }),
        transit("08:10", "08:25", "JR 京濱東北", 8, 150, "秋葉原／淺草橋", "上野", "一站到上野。出廣小路口行入アメ横。"),
        item("activity", "08:30", "10:00", "上野買藥", "上野アメ横 藥妝街", {
          highlight: true,
          notes: "先 SUNDRUG／マツモトキヨシ／札幌藥妝比價。用藥妝券；液體之後要托運或符合機艙限制。",
        }),
        transit("10:10", "10:20", "JR 山手／京濱東北", 6, 150, "上野", "秋葉原", "回頭一站，袋唔好買太重就行得輕鬆。"),
        item("meal", "10:30", "11:20", "早午餐", "秋葉原", {
          notes: "站前或中央通。買完藥未食得滯可食輕。",
        }),
        item("activity", "11:30", "18:30", "ACG／電器", "秋葉原中央通", {
          highlight: true,
          notes: "直接掃秋葉原。先 Yodobashi／Animate，再側街同人誌。Bic Camera 券 10/31 到期。",
        }),
        item("meal", "18:40", "19:50", "晚餐", "秋葉原", {
          notes: "中央通行完即食。早睡補紅眼。",
        }),
        item("hotel", "20:00", "22:00", "入住休息", "東橫INN 神田秋葉原", {
          notes: "10/26–30 連住。",
        }),
      ],
      planB: [
        item("activity", "04:45", "05:45", "抵達＋出關", "羽田空港 第3航廈", {
          notes: "同方案 A。",
        }),
        transit("05:45", "06:30", "京急＋JR", 45, 580, "羽田空港 T3", "淺草橋", ""),
        item("hotel", "06:30", "10:00", "先瞓補眠（室內）", "東橫INN 神田秋葉原", {
          notes: "紅眼＋落雨就不要硬行。寄袋後問可否早入房。",
        }),
        transit("10:15", "10:30", "JR 京濱東北", 8, 150, "秋葉原／淺草橋", "上野", "藥妝舖全室內。"),
        item("activity", "10:30", "12:00", "上野買藥（室內）", "マツモトキヨシ 上野", {
          highlight: true,
          notes: "改行車站構內／アメ横騎樓藥妝，唔使入公園。",
        }),
        item("meal", "12:10", "13:00", "午餐", "上野駅 構內", {
          notes: "買完藥喺站食，淋唔到雨。",
        }),
        transit("13:10", "13:20", "JR 山手／京濱東北", 6, 150, "上野", "秋葉原", ""),
        item("activity", "13:25", "18:30", "秋葉原室內掃貨", "ヨドバシカメラ 秋葉原", {
          highlight: true,
          notes: "Yodobashi、Animate、Donki 全部室內。",
        }),
        item("meal", "18:40", "19:50", "晚餐", "秋葉原", { notes: "行完即食，早返酒店。" }),
        item("hotel", "20:00", "22:00", "入住休息", "東橫INN 神田秋葉原", {}),
      ],
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
          notes: "本館＋Isetan Men。鄰近 OIOI。小田急／京王券今日可用。",
        }),
        item("meal", "13:20", "14:20", "午餐", "伊勢丹新宿／ルミネ", {
          notes: "會食樓層或 Lumine 食街。",
        }),
        transit("14:20", "14:35", "步行", 10, 0, "伊勢丹新宿", "Alpen Tokyo", "東南口方向。"),
        item("activity", "14:35", "15:35", "睇裝備", "Alpen Tokyo", {
          highlight: true,
          notes: "Alpen 券：免稅再折 5%，2026/12/31 前。",
        }),
        transit("15:35", "15:50", "步行", 8, 0, "Alpen Tokyo", "BicCamera 新宿東口", ""),
        item("activity", "15:50", "19:00", "電器", "BicCamera／Yodobashi 新宿", {
          highlight: true,
          notes: "Bic 券 10/31 到期，今日係最佳使用日。Laox 同日到期。",
        }),
        item("meal", "19:15", "20:30", "晚餐", "新宿 思い出横丁", {
          notes: "炭火小店。人多就改麺屋武蔵。",
        }),
        transit("20:40", "21:10", "JR 總武線", 20, 200, "新宿", "秋葉原", "末班好密，唔趕。"),
      ],
      planB: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:30", "11:00", "JR 總武線快速", 20, 200, "秋葉原", "新宿", ""),
        item("activity", "11:00", "13:30", "室內百貨", "高島屋タイムズスクエア", {
          highlight: true,
          notes: "全室內。可轉京王百貨（滿 3,000 円 95 折）。",
        }),
        item("meal", "13:30", "14:30", "午餐", "京王百貨 新宿", {
          notes: "京王券：單筆滿 3,000 円 95 折。",
        }),
        item("activity", "14:45", "17:00", "東急手創／小田急", "東急ハンズ 新宿", {
          highlight: true,
          notes: "小田急券滿 1,000 円 6% off。",
        }),
        item("activity", "17:10", "19:00", "室內電器", "ヨドバシカメラ 新宿西口", {
          highlight: true,
          notes: "唔使行東口室外。",
        }),
        item("meal", "19:10", "20:20", "晚餐", "ルミネエスト 新宿", { notes: "車站構內，出閘即走。" }),
        transit("20:30", "21:00", "JR 總武線", 20, 200, "新宿", "秋葉原", ""),
      ],
    },
    {
      date: "2026-10-28",
      weekday: "三",
      title: "新宿＋神宮＋澀谷",
      city: "東京",
      lat: 35.6595,
      lon: 139.7004,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "無",
      departureConstraint: "晚上回秋葉原酒店",
      planA: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:00", "10:30", "JR 總武線快速", 20, 200, "秋葉原", "新宿", "快速約 16 分。27 日已行伊勢丹、Alpen、Bic。"),
        item("activity", "10:30", "13:30", "小田急＋京王", "小田急百貨店 新宿店", {
          highlight: true,
          notes: "朝早同中午都留喺新宿。小田急滿 1,000 円 6% off。京王就喺隔籬，滿 3,000 円 95 折。",
        }),
        item("meal", "13:30", "14:40", "午餐", "ルミネ新宿", { notes: "食完再行一陣，等涼啲先去神宮。" }),
        item("free", "14:40", "15:05", "新宿緩衝", "新宿駅", { notes: "室內等，唔好曬住去參道。" }),
        transit("15:10", "15:30", "JR 山手線", 12, 170, "新宿", "原宿", "一站，再行約 5 分入南參道。"),
        item("activity", "15:35", "16:50", "明治神宮", "明治神宮", {
          highlight: true,
          notes: "免費。午後冇咁熱。10 月底約 16:50 日落，行參道同本殿。大雨改用 Plan B。",
        }),
        transit("17:00", "17:20", "步行／JR", 15, 0, "明治神宮", "渋谷", "出原宿沿表參道，或山手線一站。入夜先到。"),
        item("activity", "17:30", "19:10", "購物", "渋谷 PARCO", {
          highlight: true,
          notes: "入夜行。樓層全室內。可順路 SHIBUYA109。",
        }),
        item("activity", "19:15", "20:15", "唱片＋十字路口", "タワーレコード 渋谷", {
          highlight: true,
          notes: "夜景十字路口。",
        }),
        item("meal", "20:20", "21:20", "晚餐", "渋谷", { notes: "PARCO 或道玄坂。" }),
        transit("21:30", "22:00", "JR 山手線", 25, 200, "渋谷", "秋葉原", "山手內回直達。"),
      ],
      planB: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:15", "10:45", "JR 總武線快速", 20, 200, "秋葉原", "新宿", "落雨都係室內百貨。"),
        item("activity", "10:45", "13:30", "高島屋タイムズスクエア", "高島屋タイムズスクエア", {
          highlight: true,
          notes: "朝早同中午留新宿，全室內。可轉京王百貨用券。大雨取消明治神宮。",
        }),
        item("meal", "13:30", "14:30", "午餐", "京王百貨 新宿", {}),
        item("activity", "14:30", "15:40", "ルミネ新宿", "ルミネ新宿", {
          notes: "繼續室內，等到入夜先去澀谷。",
        }),
        transit("15:50", "16:10", "JR 山手線", 7, 170, "新宿", "渋谷", "大雨唔去神宮。"),
        item("activity", "16:15", "18:30", "渋谷 PARCO", "渋谷 PARCO", {
          highlight: true,
          notes: "室內主場。",
        }),
        item("activity", "18:40", "20:00", "スクランブルスクエア", "渋谷スクランブルスクエア", {
          highlight: true,
          notes: "入夜。東急フードショー同展望都有頂。",
        }),
        item("meal", "20:10", "21:10", "晚餐", "渋谷ヒカリエ", {}),
        transit("21:20", "21:50", "JR 山手線", 25, 200, "渋谷", "秋葉原", ""),
      ],
    },
    {
      date: "2026-10-29",
      weekday: "四",
      title: "teamLab＋MAPPA",
      city: "東京",
      lat: 35.655,
      lon: 139.7966,
      stay: "東橫INN 神田秋葉原",
      arrivalConstraint: "teamLab、MAPPA 都要預先買時段票",
      departureConstraint: "晚上回秋葉原酒店",
      planA: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:20", "11:00", "JR＋百合海鷗", 35, 330, "淺草橋", "新豊洲", "淺草橋→新橋，轉ゆりかもめ至新豊洲。"),
        item("activity", "11:00", "13:00", "teamLab Planets", "チームラボプラネッツ TOKYO DMM", {
          highlight: true,
          notes: "要預先買時段。赤腳涉水，帶短襪同毛巾。室內，落雨都去得。",
        }),
        transit("13:00", "13:15", "步行", 12, 0, "teamLab Planets", "豊洲 千客万来", "有蓋通道。只留午餐，唔好行足。"),
        item("meal", "13:15", "14:00", "午餐", "豊洲 千客万来", {
          notes: "食完即走。溫泉同橫丁留返有時間先。",
        }),
        transit("14:00", "14:40", "百合海鷗＋步行", 35, 370, "新豊洲", "有楽町", "ゆりかもめ至新橋，行去東京國際論壇 B1。"),
        item("activity", "14:45", "16:30", "MAPPA EXPO", "YURAKUCHO MUSEUM 東京国際フォーラム", {
          highlight: true,
          notes: "後期 10/28 起。10:00–18:00，最後入場約 17:30。預早買時段票，約 ¥2,000。",
        }),
        transit("16:40", "17:05", "JR 京濱東北", 18, 170, "有楽町", "秋葉原", "直達，落秋葉原即返酒店一帶。"),
        item("meal", "17:20", "18:30", "晚餐", "秋葉原", { notes: "電器街或車站大樓。唔使再折去池袋。" }),
        item("free", "18:30", "20:30", "秋葉原自由", "秋葉原", {
          notes: "行店或返東橫。Cross Store 留 30 日池袋。",
        }),
      ],
      planB: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:20", "11:05", "JR＋百合海鷗", 40, 330, "淺草橋", "豊洲", "若 teamLab 時段取消／售罄。"),
        item("activity", "11:10", "13:00", "ららぽーと豊洲", "ららぽーと豊洲", {
          highlight: true,
          notes: "全室內商場。",
        }),
        item("meal", "13:00", "13:45", "午餐", "ららぽーと豊洲", {}),
        transit("13:50", "14:30", "百合海鷗＋步行", 35, 370, "豊洲", "有楽町", "轉去博物館，唔好留到關門。"),
        item("activity", "14:40", "16:30", "MAPPA EXPO", "YURAKUCHO MUSEUM 東京国際フォーラム", {
          highlight: true,
          notes: "室內。最後入場約 17:30。",
        }),
        transit("16:40", "17:05", "JR 京濱東北", 18, 170, "有楽町", "秋葉原", ""),
        item("meal", "17:20", "18:30", "晚餐", "秋葉原", {}),
      ],
    },
    {
      date: "2026-10-30",
      weekday: "五",
      title: "拉麵祭＋Cross Store",
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
          notes: "室外為主。帶現金、濕紙巾、遮。人潮大，先食再影。",
        }),
        transit("15:40", "16:30", "東急＋JR 山手", 40, 280, "駒沢大学", "池袋", "返澀谷轉山手北行。"),
        item("activity", "16:30", "18:00", "行店", "Animate 池袋本店", {
          highlight: true,
          notes: "本店樓層多。買完再行去 Sunshine。",
        }),
        transit("18:00", "18:15", "步行", 12, 0, "Animate 池袋本店", "サンシャインシティ", "東池袋，約 10–15 分。"),
        item("meal", "18:15", "19:00", "晚餐", "サンシャインシティ", { notes: "食完上 3 樓，店 21:00 關門。" }),
        item("activity", "19:00", "21:00", "Bandai Namco Cross Store", "バンダイナムコ Cross Store 東京", {
          highlight: true,
          notes: "Sunshine 世界進口商場 3F。10:00–21:00，全年無休。",
        }),
        item("activity", "21:00", "22:00", "池ハロ Night", "サンシャインシティ", {
          notes: "Cross Store 打烊後先行。室內為主，視人流。",
        }),
        transit("22:10", "22:40", "JR 山手線", 22, 200, "池袋", "秋葉原", "末班前好充足。"),
      ],
      planB: [
        item("meal", "08:00", "09:00", "酒店早餐", "東橫INN 神田秋葉原", {}),
        transit("10:30", "11:10", "JR 山手線", 25, 200, "秋葉原", "池袋", "落雨取消室外拉麵祭。"),
        item("activity", "11:15", "13:00", "Sunshine 水族館", "サンシャイン水族館", {
          highlight: true,
          notes: "全室內。可現場或提早網上票。",
        }),
        item("meal", "13:00", "14:00", "午餐", "サンシャインシティ", {}),
        item("activity", "14:00", "16:00", "Animate 池袋本店", "Animate 池袋本店", {
          highlight: true,
          notes: "全室內。",
        }),
        transit("16:00", "16:15", "步行", 12, 0, "Animate 池袋本店", "サンシャインシティ", ""),
        item("activity", "16:15", "18:15", "Bandai Namco Cross Store", "バンダイナムコ Cross Store 東京", {
          highlight: true,
          notes: "Sunshine 3F，室內。21:00 關門，下午場時間鬆。",
        }),
        item("meal", "18:15", "19:00", "晚餐", "サンシャインシティ", {}),
        item("activity", "19:00", "21:00", "池ハロ（室內場）", "サンシャインシティ", {
          notes: "改行商場內活動，少企室外廣場。",
        }),
        transit("21:15", "21:45", "JR 山手線", 22, 200, "池袋", "秋葉原", ""),
      ],
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
        item("hotel", "08:30", "09:30", "Check out，大袋寄走／暫存", "東橫INN 神田秋葉原", {
          notes: "大袋寄去 11/01 東橫INN 秋葉淺草橋，或酒店暫存。只帶當日袋去蘇我。",
        }),
        transit("09:30", "10:30", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "總武快速至千葉，轉內房一線至蘇我。"),
        item("hotel", "10:30", "10:50", "入酒店（只帶當日袋）", "ホテルリブマックス千葉蘇我駅前", {
          notes: "駅前 1 分鐘。放袋即走。",
        }),
        transit("10:50", "11:15", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "直達幕張メッセ最近駅。"),
        item("activity", "11:15", "20:30", "Fan Fest Day 1", "幕張メッセ", {
          highlight: true,
          notes: "FF14 Fan Festival。20:30 結束。室內。帶證、水、行動電源。",
        }),
        transit("20:45", "21:05", "JR 京葉線", 15, 200, "海浜幕張", "蘇我", "散場人多，預多時間出站。"),
        item("meal", "21:15", "22:15", "晚餐", "蘇我駅前", {
          notes: "駅前食肆。早瞓備戰 D2 THE PRIMALS。",
        }),
        item("hotel", "22:15", "23:00", "入住", "ホテルリブマックス千葉蘇我駅前", {}),
      ],
      planB: [
        item("hotel", "08:30", "09:30", "Check out，寄大袋", "東橫INN 神田秋葉原", {
          notes: "同方案 A。活動本身係室內，備案只加緩衝。",
        }),
        transit("09:40", "10:40", "JR 總武快速＋內房", 50, 820, "秋葉原", "蘇我", "落雨多 10 分鐘出酒店。"),
        item("hotel", "10:40", "11:00", "入酒店放袋", "ホテルリブマックス千葉蘇我駅前", {}),
        transit("11:00", "11:20", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
        item("activity", "11:20", "20:30", "Fan Fest Day 1", "幕張メッセ", {
          highlight: true,
          notes: "20:30 結束。活動室內。要避開會場先去イオンモール幕張新都心。",
        }),
        transit("20:45", "21:05", "JR 京葉線", 15, 200, "海浜幕張", "蘇我", ""),
        item("meal", "21:15", "22:15", "晚餐", "蘇我駅前", {}),
      ],
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
      departureConstraint: "20:30 散場後轉住淺草橋，取回大袋",
      planA: [
        transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", "住駅前，出門即上車。"),
        item("activity", "09:30", "20:30", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
          highlight: true,
          notes: "THE PRIMALS。20:30 結束。提早入座／排隊。散場人多。",
        }),
        transit("20:45", "22:05", "京葉線＋JR", 75, 820, "海浜幕張", "淺草橋", "京葉至東京，轉總武。預多 15 分出站。"),
        item("hotel", "22:05", "22:30", "入酒店（取回大袋）", "東橫INN 秋葉淺草橋", {
          notes: "11/01 同 11/03 住呢間。確認大袋已到。",
        }),
        item("meal", "22:30", "23:15", "晚餐", "淺草橋／秋葉原", {
          notes: "散場後簡單食或便利店。明日 08:00 出發日光。",
        }),
      ],
      planB: [
        transit("09:10", "09:30", "JR 京葉線", 12, 200, "蘇我", "海浜幕張", ""),
        item("activity", "09:30", "20:30", "Fan Fest Day 2 THE PRIMALS", "幕張メッセ", {
          highlight: true,
          notes: "20:30 先完。演出仍係主軸。戶外排隊遇雨用會場連廊。",
        }),
        transit("20:45", "22:05", "京葉線＋JR", 75, 820, "海浜幕張", "淺草橋", ""),
        item("hotel", "22:05", "22:30", "入酒店取袋", "東橫INN 秋葉淺草橋", {}),
        item("meal", "22:30", "23:15", "晚餐", "淺草橋", { notes: "簡單食。明日 08:00 日光。" }),
      ],
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
          notes: "陽明門、三猿、眠貓。陽明門維修要查當日告示。",
        }),
        item("meal", "12:30", "13:30", "午餐", "東照宮表參道", {
          notes: "湯葉定食或烤鱒魚。表參道有蓋店鋪。",
        }),
        item("activity", "13:30", "16:10", "輪王寺＋二荒山", "輪王寺", {
          highlight: true,
          notes: "三社寺套票划算。二荒山石階視體力。",
        }),
        transit("16:15", "16:45", "東武巴士", 20, 350, "東照宮", "東武日光駅", ""),
        item("meal", "17:30", "19:00", "晚飯", "東武日光駅前", {
          notes: "駅前鄉土料理。轉車前食飽，旅館素泊無晚餐。",
        }),
        transit("19:10", "19:50", "東武線", 35, 760, "東武日光", "鬼怒川温泉", "特急或普通。"),
        item("hotel", "19:50", "20:20", "入旅館（遲 CI）", "Tabist 鬼怒川パークコテージ", {
          highlight: true,
          notes: "素泊、三餐自理。遲 CI 必須預先講。自助／超商解決宵夜。",
        }),
      ],
      planB: [
        transit("08:00", "10:10", "東武特急（指定席）", 125, 2940, "淺草", "東武日光", "列車照坐，改室內動線。"),
        item("activity", "10:25", "12:00", "日光駅 世界遺產會館", "日光世界遺産会館", {
          notes: "室內展覽，等雨勢細再上山。",
        }),
        transit("12:10", "12:30", "東武巴士", 15, 350, "東武日光", "輪王寺", "先去有大殿嘅輪王寺。"),
        item("activity", "12:30", "14:00", "輪王寺（室內）", "輪王寺", {
          highlight: true,
          notes: "三佛堂室內。東照宮宝物館可加。",
        }),
        item("meal", "14:00", "15:00", "午餐", "東照宮表參道", { notes: "有蓋店鋪。" }),
        item("activity", "15:00", "16:00", "東照宮宝物館", "日光東照宮宝物館", {
          highlight: true,
          notes: "少行室外參道。陽明門外觀看雨勢決定。",
        }),
        transit("16:10", "16:50", "東武巴士＋電車", 40, 760, "東照宮", "鬼怒川温泉", "提早入旅館浸湯。"),
        item("hotel", "17:00", "19:00", "提早 CI＋溫泉", "Tabist 鬼怒川パークコテージ", {
          highlight: true,
          notes: "雨天把浸湯當主行程。",
        }),
        item("meal", "19:00", "20:00", "自理晚餐", "鬼怒川温泉駅前", {
          notes: "セブン／駅前食堂。素泊。",
        }),
      ],
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
        item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", {
          notes: "素泊。駅前 7-11。",
        }),
        item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", {
          notes: "預留行去駅時間。確認鎖門同鑰匙。",
        }),
        transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", "11/03 指定席。到淺草後轉北千住較順。"),
        item("meal", "12:35", "12:55", "車站速食", "淺草駅／北千住", {
          notes: "只係墊肚，正餐留去みなとみらい。",
        }),
        transit("13:00", "14:15", "日比谷線＋東急東橫", 70, 580, "北千住", "みなとみらい", "日比谷直通東橫至みなとみらい。時間緊，唔好喺淺草逗留。"),
        item("free", "14:20", "16:00", "會場周邊＋早晚餐", "みなとみらい Queen's Square", {
          notes: "Queen's Square／MARK IS 室內。開場前食飽。",
        }),
        item("activity", "16:00", "17:00", "會場附近等開場", "ぴあアリーナMM", {
          notes: "確認入口、袋檢、周邊 enta。",
        }),
        item("activity", "17:00", "21:00", "赤色の響祭", "ぴあアリーナMM", {
          highlight: true,
          notes: "室內演唱會。散場人潮大，預先記新高島／櫻木町出口。",
        }),
        transit("21:15", "22:30", "東急東橫＋日比谷／JR", 70, 700, "新高島／櫻木町", "淺草橋", "末班足夠。可北千住轉。"),
        item("hotel", "22:30", "23:30", "回酒店", "東橫INN 秋葉淺草橋", {
          notes: "明日伴手禮＋回程。",
        }),
      ],
      planB: [
        item("meal", "07:30", "08:15", "早餐", "セブンイレブン 鬼怒川立岩", {}),
        item("hotel", "08:15", "09:40", "Check out", "Tabist 鬼怒川パークコテージ", {}),
        transit("10:00", "12:35", "東武特急（指定席）", 150, 2940, "鬼怒川温泉", "淺草", ""),
        transit("12:50", "14:10", "日比谷線＋東急東橫", 75, 580, "北千住", "みなとみらい", "落雨唔好行淺草室外。"),
        item("activity", "14:10", "16:00", "Landmark／Queen's Square 室內", "横浜ランドマークタワー", {
          highlight: true,
          notes: "全室內殺時間。展望台可選。",
        }),
        item("meal", "15:30", "16:20", "早晚餐", "Queen's Square 横浜", {
          notes: "開場前食完。",
        }),
        item("activity", "16:30", "21:00", "赤色の響祭", "ぴあアリーナMM", {
          highlight: true,
          notes: "演唱會室內，風雨唔影響。",
        }),
        transit("21:15", "22:30", "東急東橫＋日比谷", 70, 700, "新高島", "淺草橋", ""),
      ],
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
        item("hotel", "09:30", "10:10", "Check out 寄袋／帶袋", "東橫INN 秋葉淺草橋", {
          notes: "大袋直接帶去東京駅／成田。",
        }),
        transit("10:20", "10:30", "JR 總武線", 6, 150, "淺草橋", "東京駅", "一站之隔。"),
        item("activity", "10:30", "12:30", "伴手禮", "東京駅一番街", {
          highlight: true,
          notes: "Kit Kat、ROYCE、東京香蕉、キャラクターストリート。記住液體安檢。",
        }),
        item("meal", "12:30", "13:20", "午餐", "東京駅 GRANSTA", {
          notes: "最後一餐日食。13:45 要去月台。",
        }),
        transit("13:45", "15:20", "成田エクスプレス", 65, 3250, "東京駅", "成田空港 T2", "N'EX 指定席。目標 15:20–16:00 入航廈。"),
        item("activity", "15:20", "17:40", "辦理登機＋免稅", "成田空港 第2航廈", {
          highlight: true,
          notes: "成田免稅券 95 折。16:00 到場，18:00 起飛。",
        }),
        item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
          highlight: true,
          notes: "國泰。約 21:20–22:00 到 HKG，再金巴返澳門。",
        }),
        transit("22:20", "00:20+1", "B4＋金巴返澳門", 120, 1400, "香港國際機場", "港珠澳澳門口岸", "趕唔切機場直達末班（約 21:30）就用金巴通宵。日圓欄僅作佔位。"),
      ],
      planB: [
        item("hotel", "09:00", "09:40", "提早 Check out", "東橫INN 秋葉淺草橋", {
          notes: "風雨或誤點風險高就提早走。",
        }),
        transit("09:50", "10:00", "JR 總武線", 6, 150, "淺草橋", "東京駅", ""),
        item("activity", "10:00", "12:00", "伴手禮（全室內）", "東京駅一番街", {
          highlight: true,
          notes: "唔出丸之內室外。",
        }),
        item("meal", "12:00", "12:40", "午餐", "東京駅 GRANSTA", {}),
        transit("12:50", "14:10", "成田エクスプレス（早班）", 65, 3250, "東京駅", "成田空港 T2", "提早一班，15:00 前到 T2。"),
        item("activity", "14:10", "17:40", "免稅＋候機", "成田空港 第2航廈", {
          highlight: true,
          notes: "用成田／線上訂 95 折券。多餘時間留喺禁區。",
        }),
        item("flight", "18:00", "22:00", "CX505 返澳（經香港）", "NRT T2 → HKG", {
          highlight: true,
          notes: "航班不變。提早到港較易趕機場直達。",
        }),
        transit("22:10", "23:40", "機場直達／金巴返澳門", 90, 1400, "香港國際機場", "澳門口岸", "提早班較有機會搭到直達巴士；否則金巴通宵。"),
      ],
    },
  ],
  foods: [
    {
      name: "牛かつ もと村 秋葉原店",
      city: "東京",
      category: "炸牛排",
      reason: "上野買完藥一站到秋葉原，出餐快、外國人友善，適合 10/26 早午餐。",
      mapsQuery: "牛かつ もと村 秋葉原",
      priceBand: "¥1,200–1,800",
    },
    {
      name: "ジャンクガレッジ 秋葉原店",
      city: "東京",
      category: "拉麵",
      reason: "中央通行完好補，分量大，紅眼當日晚餐夠飽。",
      mapsQuery: "ジャンクガレッジ 秋葉原",
      priceBand: "¥1,000–1,500",
    },
    {
      name: "麺屋武蔵 武骨 新宿店",
      city: "東京",
      category: "拉麵",
      reason: "新宿電器同 Alpen 行完可走去，濃厚魚介豚骨，夜晚觀光客龍較短。",
      mapsQuery: "麺屋武蔵 武骨 新宿",
      priceBand: "¥1,000–1,400",
    },
    {
      name: "豊洲 千客万来 ラーメン横丁",
      city: "東京",
      category: "市場食堂",
      reason: "teamLab 完場步行可達，多家名店輪替，比築地容易入座。",
      mapsQuery: "豊洲 千客万来",
      priceBand: "¥1,000–2,000",
    },
    {
      name: "日光湯波料理 梅の家",
      city: "日光",
      category: "鄉土料理",
      reason: "東照宮表參道，湯葉定食同社寺行程夾，比駅前更近參觀動線。",
      mapsQuery: "日光湯波料理 梅の家",
      priceBand: "¥1,500–2,800",
    },
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
      kind: "page",
    }),
    coupon({
      name: "Bic Camera",
      discount: "滿額免稅，最高再折7%",
      expiry: "2026/10/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-1",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/BicCamera_260820.png",
      kind: "image",
    }),
    coupon({
      name: "SALONIA",
      discount: "購買指定商品，享有95折優惠（需與 Bic Camera優惠券 一同使用）",
      expiry: "2026/11/30",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-19",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/salonia_260820.jpg",
      kind: "image",
    }),
    coupon({
      name: "愛電王Edion",
      discount: "滿額免稅，最高再折7%",
      expiry: "2026/12/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-10",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/edion2025.jpg",
      kind: "image",
    }),
    coupon({
      name: "Laox",
      discount: "滿額免稅，再折8%",
      expiry: "2026/10/31",
      tags: ["電器"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-15",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/LAOX_2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "成田機場免稅店",
      discount: "享有95折優惠",
      expiry: "2027/3/31",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-16",
      final_url: "https://duty-free-japan.jp/narita/ta/content/coupon2833-30.html",
      kind: "page",
    }),
    coupon({
      name: "成田/羽田機場 免稅商品線上訂",
      discount: "享有95折優惠",
      expiry: "無期限",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-17",
      final_url: "https://duty-free-japan.jp/qrposter/tc/?agentid=123",
      kind: "page",
    }),
    coupon({
      name: "SUNDRUG",
      discount: "滿額免稅，再享3~7%折扣",
      expiry: "無期限",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/b2s50T",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/sundrug%20_funtime.jpg",
      kind: "image",
    }),
    coupon({
      name: "鶴羽藥妝",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "2027/12/31",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-11",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/tsuruha2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "札幌藥妝",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "無期限",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-13",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/2026sapporo.jpg",
      kind: "image",
    }),
    coupon({
      name: "cosmos",
      discount: "滿額免稅，最高享免稅+9%優惠",
      expiry: "2026/12/31",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/DsrcXF",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/cosmos2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "DRUG ELEVEN",
      discount: "滿額免稅，最高享免稅+7%優惠",
      expiry: "2027/2/28",
      tags: ["藥妝"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-22",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/DRUGELEVEN_2027.jpg",
      kind: "image",
    }),
    coupon({
      name: "小田急百貨",
      discount: "消費滿1千日圓(含稅)，可享6%優惠",
      expiry: "2028/3/31",
      tags: ["百貨"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-12",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/odakyu.png",
      kind: "image",
    }),
    coupon({
      name: "近鐵百貨店",
      discount: "滿2千日圓(不含稅)，可享有95折優惠",
      expiry: "2026/12/31",
      tags: ["百貨"],
      region: "關西",
      link: "https://funtime.tw/c/blog-68172-14",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/kintetsu2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "銀座樂天免稅店",
      discount: "滿1萬日圓，折1千日圓；滿2萬日圓，折2千日圓",
      expiry: "2027/1/31",
      tags: ["機場", "免稅"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-7",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/Lottedutyfree_GINZA_FunTime2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "大丸松坂屋",
      discount: "單筆消費含稅滿3千日圓，享95折",
      expiry: "2026/8/31",
      tags: ["百貨"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-6",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/daimaru_250820.pdf",
      kind: "page",
    }),
    coupon({
      name: "西武百貨",
      discount: "消費滿1千日圓，享95折",
      expiry: "2027/12/31",
      tags: ["百貨"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-2",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/seibu2027.jpg",
      kind: "image",
    }),
    coupon({
      name: "京王百貨",
      discount: "單筆消費滿3千日圓，享95折",
      expiry: "2027/3/31",
      tags: ["百貨"],
      region: "東京",
      link: "https://funtime.tw/c/blog-68172-3",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/Keio_2026.jpg",
      kind: "image",
    }),
    coupon({
      name: "Alpen",
      discount: "免稅再折5%",
      expiry: "2026/12/31",
      tags: ["運動"],
      region: null,
      link: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/2026Alpen.png",
      kind: "image",
    }),
    coupon({
      name: "Victoria運動用品",
      discount: "免稅再折5%",
      expiry: "2026/12/31",
      tags: ["運動"],
      region: null,
      link: "https://funtime.tw/c/blog-68172-8",
      final_url: "https://www.funtime.com.tw/travelstore/coupon/FunTime_Victoria_202612.jpg",
      kind: "image",
    }),
  ],
};

export const AI_FOOD_PROMPT = `你是日本旅遊美食顧問。只回 JSON array，不要 markdown、不要前言。
必須剛好 3 間餐廳，欄位僅限：name, city, category, reason, mapsQuery, priceBand。
reason 用繁體中文 1–2 句。priceBand 用日圓區間例如 "¥1,000–1,800"。
行程：澳門出發（經香港機場 UO624）東京 2026-10-25 至 11-04，景點含淺草、押上、秋葉原、新宿、澀谷、豐洲 teamLab、有樂町 MAPPA、駒澤拉麵祭、池袋、幕張 Fan Fest、日光東照宮、鬼怒川、橫濱ぴあアリーナMM、東京駅伴手禮。
請推薦行程沿線、外國人友善、不必抽籤的店。`;
