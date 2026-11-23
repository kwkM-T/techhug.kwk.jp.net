/**
 * fix-affiliates.js
 * 1. affiliates.json を全面更新
 * 2. 記事内の [affi id=X] ショートコードを HTML カードに変換
 * 3. 記事内の Markdown 形式 Amazon リンクを HTML カードに差し替え
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const BLOG_DIR = path.join(BASE, 'src', 'content', 'blog');
const DATA_DIR = path.join(BASE, 'src', 'data');

// ============================================================
// 1. affiliates.json の全面更新
// ============================================================
const affiliates = [
  {
    id: "echo-show5",
    aliases: ["3"],
    title: "Echo Show 5 (第3世代) - スマートディスプレイ with Alexa",
    description: "2メガピクセルカメラ付き。ビデオ通話や画像表示に対応したコンパクトなスマートディスプレイ。お留守番・育児・インテリアとして大活躍。",
    imageUrl: "https://m.media-amazon.com/images/I/61vQqn6zZxL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/48l5n6X",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "echo-dot5",
    aliases: ["4"],
    title: "Echo Dot (第5世代) - Alexa、センサー搭載",
    description: "定番の人気モデル。鮮やかなサウンドと温湿度センサーを搭載。コンパクトで使いやすく、はじめてのAlexaにも最適。",
    imageUrl: "https://m.media-amazon.com/images/I/71Y21S6bZEL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4noAoeQ",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "echo-pop",
    aliases: [],
    title: "Echo Pop - コンパクトスマートスピーカー with Alexa",
    description: "手頃な価格でAlexaを始められるエントリーモデル。カラーバリエーションが豊富でインテリアに合わせやすい。",
    imageUrl: "https://m.media-amazon.com/images/I/61e1BLJVOFL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4pZObu7",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "smart-plug",
    aliases: ["7"],
    title: "Amazonベーシック スマートプラグ",
    description: "普通のコンセントをスマートホーム化。Alexa対応で声だけで家電のオン・オフが可能に。タイマー設定も簡単。",
    imageUrl: "https://m.media-amazon.com/images/I/51Auu5oApHL._AC_SL1500_.jpg",
    amazonUrl: "https://amzn.to/4nGU3XD",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "smart-bulb",
    aliases: ["8"],
    title: "Amazonベーシック スマートLED電球 E26",
    description: "Alexa対応のスマート電球。声で明るさ・色温度を調整でき、寝かしつけや就寝時の照明制御に最適。",
    imageUrl: "https://m.media-amazon.com/images/I/71uF8GPU0UL._AC_SL1500_.jpg",
    amazonUrl: "https://amzn.to/4gMb3ZJ",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "smartband-9",
    aliases: [],
    title: "Xiaomi Smart Band 9 スマートバンド",
    description: "21日間連続使用可能。振動アラーム・着信通知・LINEアプリ通知に対応。150種類のスポーツモードと環境光センサー搭載。",
    imageUrl: "https://m.media-amazon.com/images/I/51a2bJCxoVL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/42af1FA",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "fitbit-inspire3",
    aliases: [],
    title: "Fitbit Inspire 3 フィットネストラッカー",
    description: "最大10日間のバッテリー。心拍計測・睡眠スコア・健康指標ダッシュボードを搭載した軽量フィットネストラッカー。",
    imageUrl: "https://m.media-amazon.com/images/I/61bC1MPCmaL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4gG11ZY",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "apple-watch-se2",
    aliases: [],
    title: "Apple Watch SE 第2世代 GPS モデル",
    description: "衝突事故検出・心拍数モニタリング・Retinaディスプレイ・耐水性能を備えたApple Watchのエントリーモデル。",
    imageUrl: "https://m.media-amazon.com/images/I/71nHDQhSoWL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/46reWQc",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "redmi-watch5",
    aliases: [],
    title: "Redmi Watch 5 Active スマートウォッチ",
    description: "大画面ディスプレイと長時間バッテリーを備えたコスパ優秀なスマートウォッチ。健康管理機能も充実。",
    imageUrl: "https://m.media-amazon.com/images/I/61yBLVWkqRL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4oXPDfB",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "fire7-kids",
    aliases: [],
    title: "Amazon Fire 7 キッズモデル タブレット",
    description: "2年間保証付き。子ども向けコンテンツが使い放題のAmazon Kids+1年分同梱。丈夫なキッズカバー付き。",
    imageUrl: "https://m.media-amazon.com/images/I/71aVTcOzZSL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/46DQw4Z",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "firehd10-kids-pro",
    aliases: [],
    title: "Amazon Fire HD 10 キッズプロ (10インチ)",
    description: "大画面10インチ。Amazon Kids+1年間使い放題付き。高解像度で学習・読書・動画視聴に最適なキッズタブレット。",
    imageUrl: "https://m.media-amazon.com/images/I/71XVbVNYjCL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/3KItcvi",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "earfun-openjump",
    aliases: [],
    title: "EarFun OpenJump オープンイヤー イヤホン",
    description: "耳を塞がない開放型Bluetoothイヤホン。マルチポイント接続・IPX7防水・ワイヤレス充電対応。育児中の「ながら聴き」に最適。",
    imageUrl: "https://m.media-amazon.com/images/I/61ePPkVOJbL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/3ESKH9U",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "earfun-air-pro-4i",
    aliases: [],
    title: "EarFun Air Pro 4i ノイズキャンセリングイヤホン",
    description: "高性能ANCと優れた音質を両立したワイヤレスイヤホン。長時間再生で集中作業や育児後の息抜きタイムに。",
    imageUrl: "https://m.media-amazon.com/images/I/61YUHLCBNfL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4imGVoG",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "earfun-clip",
    aliases: [],
    title: "EarFun Clip オープンイヤーイヤホン",
    description: "クリップ型で耳に引っ掛けて使う開放型イヤホン。家事・育児中でも周囲の音を聴きながら音楽やPodcastを楽しめる。",
    imageUrl: "https://m.media-amazon.com/images/I/61V9X5q1N6L._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/49wlEX9",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "xiaomi-s20",
    aliases: [],
    title: "Xiaomi ロボット掃除機 S20 吸引・水拭き両用",
    description: "5000Pa強力吸引＋水拭き対応。高精度マッピングで効率的に掃除。育児で忙しい家庭の掃除を自動化。",
    imageUrl: "https://m.media-amazon.com/images/I/61LXauzSmCL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4gFweMR",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "roborock-q5pro",
    aliases: [],
    title: "roborock Q5 Pro ロボット掃除機",
    description: "高精度LIDARナビゲーション搭載の上位モデル。強力吸引と水拭き機能で、部屋の隅まで徹底清掃。",
    imageUrl: "https://m.media-amazon.com/images/I/61NfkTxFouL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/4p08yq2",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "eufy-cam-c220",
    aliases: [],
    title: "Anker Eufy Indoor Cam C220 屋内カメラ",
    description: "2K超高画質・360°首振り対応の屋内セキュリティカメラ。子どものお留守番の見守りに最適。クラウド不要ローカル保存対応。",
    imageUrl: "https://m.media-amazon.com/images/I/51dFoLCjMnL._AC_SX679_.jpg",
    amazonUrl: "https://amzn.to/43OvOP7",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  },
  {
    id: "amazon-prime",
    aliases: [],
    title: "Amazonプライム会員",
    description: "配送料ゼロ＆プライムビデオ・音楽・Amazon Alexa AIが使い放題。30日間無料体験あり。",
    imageUrl: null,
    amazonUrl: "https://link.amazon.co.jp/B0b6DwUZS",
    rakutenUrl: null,
    otherUrl: null,
    otherLabel: null
  }
];

fs.writeFileSync(
  path.join(DATA_DIR, 'affiliates.json'),
  JSON.stringify(affiliates, null, 2),
  'utf-8'
);
console.log('✅ affiliates.json を更新しました');

// ============================================================
// HTML カード生成ヘルパー
// ============================================================

function makeCard(item) {
  if (!item) return '';
  const { title, imageUrl, amazonUrl } = item;
  return `<div style='background: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; padding: 16px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-wrap: wrap; align-items: center; gap: 16px;'>
 <div style='flex: 0 0 140px; text-align: center; margin: 0 auto;'>
 <a href='${amazonUrl}' target='_blank' rel='nofollow noopener'>
 <img src='${imageUrl || ''}' alt='${title}' style='max-width: 130px; height: auto;'>
 </a>
 </div>
 <div style='flex: 1; min-width: 230px; text-align: left;'>
 <p style='margin: 0 0 10px 0; font-size: 14px; font-weight: bold; line-height: 1.45;'>
 <a href='${amazonUrl}' target='_blank' rel='nofollow noopener' style='color: #222; text-decoration: none;'>
 ${title}
 </a>
 </p>
 <a href='${amazonUrl}' target='_blank' rel='nofollow noopener' style='background: #ff9900; color: #111; font-weight: bold; font-size: 13px; padding: 9px 20px; border-radius: 4px; text-decoration: none; display: inline-block; border-bottom: 2px solid #cc7a00;'>
 Amazonで詳細を見る ›
 </a>
 </div>
</div>`;
}

// ID（数値エイリアスも含む）から商品を引くマップを構築
const byId = {};
for (const item of affiliates) {
  byId[item.id] = item;
  for (const alias of (item.aliases || [])) {
    byId[alias] = item;
  }
}

// amzn.to URL から商品を探す
function findByAmazonUrl(url) {
  const short = url.replace(/^https?:\/\//, '').split('/')[1]; // e.g. 48l5n6X
  for (const item of affiliates) {
    if (item.amazonUrl && item.amazonUrl.includes(short)) return item;
  }
  return null;
}

// ============================================================
// 記事修正
// ============================================================

/** Amazonプライムバナー HTML */
const primeBanner = `<div style="text-align: center; margin: 30px 0; padding: 18px 12px; background: #fff; border-top: 2px dashed #e0e0e0; border-bottom: 2px dashed #e0e0e0;">
  <p style="font-size: 13px; color: #e65100; font-weight: bold; margin: 0 0 8px 0;">＼ 配送料ゼロ＆動画・音楽・AIが使い放題 ／</p>
  <a href="https://link.amazon.co.jp/B0b6DwUZS" target="_blank" rel="nofollow noopener" style="background: #0073e6; color: #fff; font-size: 15px; font-weight: bold; padding: 12px 32px; border-radius: 6px; text-decoration: none; display: inline-block; box-shadow: 0 2px 5px rgba(0,115,230,0.25);">
    Amazonプライム公式ページで無料体験を見る ›
  </a>
  <p style="font-size: 11px; color: #888; margin: 8px 0 0 0;">※30日間の無料体験期間中はいつでも無料解約できます</p>
</div>`;

/**
 * amzn.to の短縮IDを URL から抽出（例: https://amzn.to/48l5n6X → 48l5n6X）
 */
function extractShortId(url) {
  const m = url.match(/amzn\.to\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

/**
 * Markdown ファイルを処理して変換する
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  let changed = false;

  // --- 1. \[affi id=X\] を HTML カードに変換 ---
  content = content.replace(/\\?\[affi id=(\d+)\\?\]/g, (match, id) => {
    const item = byId[id];
    if (!item) {
      console.warn(`  ⚠️  [affi id=${id}] に対応する商品が見つかりません`);
      return match;
    }
    console.log(`  🔄 [affi id=${id}] → ${item.title}`);
    changed = true;
    return makeCard(item);
  });

  // --- 2. Markdown 形式の Amazon リンクブロックを HTML カードに変換 ---
  // パターン: 任意行数のMarkdownリンク・画像リンクがまとまってアマゾンリンクを構成している箇所
  // 形式A: [![](imageUrl)](amazonUrl) + 商品名リンク + "Amazonで詳細を見る"リンク
  // 形式B: ](amazonUrl) + 商品名リンク + "Amazonで詳細を見る" （画像が別行の場合）

  // まず全amzn.toリンクを収集して、どの商品が登場するか確認
  const amznUrls = new Set();
  const urlRegex = /https?:\/\/amzn\.to\/[A-Za-z0-9]+/g;
  let m;
  while ((m = urlRegex.exec(content)) !== null) {
    amznUrls.add(m[0]);
  }

  // 各 Amazon URL について、対応するカードブロックに変換
  for (const amazonUrl of amznUrls) {
    const shortId = extractShortId(amazonUrl);
    if (!shortId) continue;

    const item = findByAmazonUrl(amazonUrl);
    if (!item) {
      console.warn(`  ⚠️  ${amazonUrl} に対応する商品が見つかりません`);
      continue;
    }

    const card = makeCard(item);

    // パターン1: [![...](imageUrl)](amznUrl) の形式（画像付きリンク）
    // 後続に商品名リンクと「Amazonで詳細を見る」リンクが続く場合
    // まとめて1つのカードに置換する
    // 複数パターンに対応する正規表現
    const escapedUrl = amazonUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // パターン1: 画像リンク + 任意の説明文 + 商品名リンク + "Amazonで詳細を見る"リンク（3行構成）
    // [![...](...)または[...  ... ](url)形式
    const p1 = new RegExp(
      // 画像付きリンクまたは複数行リンク
      `(?:<!\\-\\- TODO[^\\n]*\\n)?` +
      `(?:!\\[[^\\]]*\\]\\([^)]+\\)\\n?)?` +
      `\\n?` +
      `(?:<!\\-\\- TODO[^\\n]*\\n)?` +
      `(?:!\\[[^\\]]*\\]\\([^)]+\\)\\n?)?` +
      `\\n?` +
      `\\[` +
      `(?:[^\\]]*(?:\\n[^\\]]*)?)?` +
      `\\]\\(${escapedUrl}\\)\\n?` +
      `\\n?` +
      `\\[(?:[^\\]]+)\\]\\(${escapedUrl}\\)\\n?` +
      `\\n?` +
      `\\[Amazonで詳細を見る\\]\\(${escapedUrl}\\)`,
      'g'
    );

    const before1 = content;
    content = content.replace(p1, card);
    if (content !== before1) {
      console.log(`  🔄 ${filename}: ${amazonUrl} のリンクブロックをカードに変換`);
      changed = true;
      continue;
    }

    // パターン2: シンプルな [![](img)](url) + 商品名 + "Amazonで詳細を見る"
    const p2 = new RegExp(
      `\\[\\s*!?\\[[^\\]]*\\]\\([^)]+\\)\\s*\\]\\(${escapedUrl}\\)\\n?\\n?` +
      `(?:👉[^\\n]*\\n\\n?)?` +
      `\\[[^\\]]+\\]\\(${escapedUrl}\\)\\n?\\n?` +
      `\\[Amazonで詳細を見る\\]\\(${escapedUrl}\\)`,
      'g'
    );

    const before2 = content;
    content = content.replace(p2, card);
    if (content !== before2) {
      console.log(`  🔄 ${filename}: ${amazonUrl} のリンクブロック(p2)をカードに変換`);
      changed = true;
      continue;
    }

    // パターン3: [![](img)](url)\n👉説明\n商品名リンク\n「詳細を見る」リンク
    const p3 = new RegExp(
      `\\[\\!\\[[^\\]]*\\]\\([^)]+\\)\\]\\(${escapedUrl}\\)\\n?` +
      `(?:\\n?👉[^\\n]*\\n)?` +
      `\\n?` +
      `\\[[^\\]]+\\]\\(${escapedUrl}\\)\\n?` +
      `\\n?` +
      `\\[Amazonで詳細を見る\\]\\(${escapedUrl}\\)`,
      'g'
    );

    const before3 = content;
    content = content.replace(p3, card);
    if (content !== before3) {
      console.log(`  🔄 ${filename}: ${amazonUrl} のリンクブロック(p3)をカードに変換`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${filename} を保存しました`);
  } else {
    console.log(`  ℹ️  ${filename} は変更なし`);
  }
}

// 全ブログ記事を処理
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
console.log(`\n📝 ${files.length}件の記事を処理します...\n`);
for (const file of files) {
  console.log(`\n[${file}]`);
  processFile(path.join(BLOG_DIR, file));
}

console.log('\n🎉 完了！');
