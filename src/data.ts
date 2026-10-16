import { C } from "./theme";

// 距離・所要時間は R_01（香港漁農自然護理署「郊野樂行」各区間ページ、2026-10-16 確認）の公式概数
export type Section = {
  n: number;
  title: string;
  from: string;
  to: string;
  fromEn: string;
  toEn: string;
  km: number;
  minutes: number;
  accent: string;
};

export const SECTIONS: Section[] = [
  { n: 1, title: "港と街を見渡して\n出発", from: "山頂", to: "薄扶林水塘道", fromEn: "THE PEAK", toEn: "POK FU LAM RESERVOIR RD", km: 7, minutes: 135, accent: C.red },
  { n: 2, title: "暮らしの隣を\n歩く", from: "薄扶林水塘道", to: "貝璐道", fromEn: "POK FU LAM RESERVOIR RD", toEn: "PEEL RISE", km: 4.5, minutes: 90, accent: C.jade },
  { n: 3, title: "森の細部に\n気づく", from: "貝璐道", to: "灣仔峽", fromEn: "PEEL RISE", toEn: "WAN CHAI GAP", km: 6.5, minutes: 120, accent: "#2f7d43" },
  { n: 4, title: "道の先に、\n歴史もある", from: "灣仔峽", to: "黃泥涌峽", fromEn: "WAN CHAI GAP", toEn: "WONG NAI CHUNG GAP", km: 7.5, minutes: 180, accent: "#8c5a2e" },
  { n: 5, title: "登った先の\n広がり", from: "黃泥涌峽", to: "柏架山道", fromEn: "WONG NAI CHUNG GAP", toEn: "MOUNT PARKER RD", km: 4, minutes: 120, accent: "#c98a12" },
  { n: 6, title: "水辺で\nひと息", from: "柏架山道", to: "大潭道", fromEn: "MOUNT PARKER RD", toEn: "TAI TAM RD", km: 4.5, minutes: 75, accent: C.teal },
  { n: 7, title: "山腹の道から\n海へ", from: "大潭道", to: "土地灣", fromEn: "TAI TAM RD", toEn: "TO TEI WAN", km: 7.5, minutes: 150, accent: C.sea },
  { n: 8, title: "龍脊の稜線、\nそして大浪灣へ", from: "土地灣", to: "大浪灣", fromEn: "TO TEI WAN", toEn: "BIG WAVE BAY", km: 8.5, minutes: 165, accent: C.red },
];

export const CREDIT = {
  user: "本人撮影｜撮影地点未確定",
  lugard2011: "Mk2010 / CC BY-SA 3.0 / Wikimedia Commons「Lugard Road (Hong Kong).jpg」",
  lugard2022: "姒姓賢寧 / CC BY-SA 4.0 / Wikimedia Commons「Lugard Road, Victoria Peak part 9 in October 2022.jpg」",
  pokfulam: "Minghong / CC BY-SA 4.0 / Wikimedia Commons「Pok Fu Lam Reservoir 6.jpg」",
  taitam: "Minghong / CC BY-SA 3.0 / Wikimedia Commons「Tai Tam Reservoir 3.jpg」",
  bigwave: "Thehistorianisaac / CC0 / Wikimedia Commons「Big wave bay 2025.jpg」",
  illust: "イメージイラスト｜実在の場所ではありません",
  chara: "案内役キャラクター（イメージ）｜実景ではありません",
} as const;
