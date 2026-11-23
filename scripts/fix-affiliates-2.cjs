/**
 * fix-affiliates-2.cjs
 * 残った変換パターンを処理する
 * - [TODO形式リンク](url) パターン
 * - [![img](url)](url) + [**商品名**](url) + 説明文 + [Amazonで詳細](url) パターン
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');
const BLOG_DIR = path.join(BASE, 'src', 'content', 'blog');

// 商品マスター（URL → カード情報）
const urlToProduct = {
  'amzn.to/4nol6GZ': {
    title: 'Echo Dot (第5世代) - Alexa、センサー搭載',
    imageUrl: 'https://m.media-amazon.com/images/I/71Y21S6bZEL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/4noAoeQ',  // 正規URL
  },
  'amzn.to/3KnOluK': {
    title: 'Echo Show 5 (第3世代) - スマートディスプレイ with Alexa',
    imageUrl: 'https://m.media-amazon.com/images/I/61vQqn6zZxL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/48l5n6X',  // 正規URL
  },
  'amzn.to/4jd3v2w': {
    title: 'Amazonベーシック スマートプラグ',
    imageUrl: 'https://m.media-amazon.com/images/I/51Auu5oApHL._AC_SL1500_.jpg',
    amazonUrl: 'https://amzn.to/4nGU3XD',  // 正規URL
  },
  'amzn.to/4rnI8iA': {
    title: 'Echo Dot (第5世代) - Alexa、センサー搭載',
    imageUrl: 'https://m.media-amazon.com/images/I/71Y21S6bZEL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/4noAoeQ',
  },
  'amzn.to/4apAbUo': {
    title: 'Echo Pop - コンパクトスマートスピーカー with Alexa',
    imageUrl: 'https://m.media-amazon.com/images/I/61e1BLJVOFL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/4pZObu7',
  },
  'amzn.to/3ESKH9U': {
    title: 'EarFun OpenJump オープンイヤー イヤホン',
    imageUrl: 'https://m.media-amazon.com/images/I/61ePPkVOJbL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/3ESKH9U',
  },
  'amzn.to/4gFweMR': {
    title: 'Xiaomi ロボット掃除機 S20 吸引・水拭き両用 5000Pa',
    imageUrl: 'https://m.media-amazon.com/images/I/61LXauzSmCL._AC_SX679_.jpg',
    amazonUrl: 'https://amzn.to/4gFweMR',
  },
};

function makeCard(item) {
  const { title, imageUrl, amazonUrl } = item;
  return `<div style='background: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; padding: 16px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); display: flex; flex-wrap: wrap; align-items: center; gap: 16px;'>
 <div style='flex: 0 0 140px; text-align: center; margin: 0 auto;'>
 <a href='${amazonUrl}' target='_blank' rel='nofollow noopener'>
 <img src='${imageUrl}' alt='${title}' style='max-width: 130px; height: auto;'>
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

function getProductByUrl(url) {
  for (const [key, item] of Object.entries(urlToProduct)) {
    if (url.includes(key)) return item;
  }
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  let changed = false;

  // パターン: [\n\n<!-- TODO: ... -->\n![](...)\n\n](amzn.to/xxx)\n\n[商品名](amzn.to/xxx)\n\n[Amazonで詳細を見る](amzn.to/xxx)
  // 開始の [ からエンドの] まで（複数行）
  const todoPattern = /\[\s*\n\s*(?:<!--[^>]*-->\s*\n\s*)?!?\[[^\]]*\]\([^)]*\)\s*\n\s*\]\((https?:\/\/amzn\.to\/[A-Za-z0-9]+)\)\s*\n\n\[[^\]]*\]\(\1\)\s*\n\n\[Amazonで詳細を見る\]\(\1\)/g;

  content = content.replace(todoPattern, (match, url) => {
    const item = getProductByUrl(url);
    if (!item) {
      console.warn(`  ⚠️  ${url} に対応する商品なし`);
      return match;
    }
    console.log(`  🔄 TODOパターン → ${item.title}`);
    changed = true;
    return makeCard(item);
  });

  // パターン2: [![img](...)がAmazon URLにリンク + [**商品名**](url) + 説明文行 + [Amazonで詳細](url)
  // [![Echo Dot 第5世代](img)](url)\n\n[**商品名**](url)\n説明文\n\n[Amazonで詳細を見る](url)
  const boldLinkPattern = /\[!\[[^\]]*\]\([^)]+\)\]\((https?:\/\/amzn\.to\/[A-Za-z0-9]+)\)\s*\n\n\[\*\*[^\]]+\*\*\]\(\1\)\s*\n[^\n]+\n\n\[Amazonで詳細を見る\]\(\1\)/g;

  content = content.replace(boldLinkPattern, (match, url) => {
    const item = getProductByUrl(url);
    if (!item) {
      console.warn(`  ⚠️  ${url} に対応する商品なし（boldリンクパターン）`);
      return match;
    }
    console.log(`  🔄 boldリンクパターン → ${item.title}`);
    changed = true;
    return makeCard(item);
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${filename} を保存`);
  } else {
    console.log(`  ℹ️  ${filename} 変更なし`);
  }
}

const targets = [
  'alexa-parent-mental-care-tips.md',
  'alexa-parenting-partner.md',
  'alexa-unresponsive-fix-troubleshooting.md',
  'open-ear-earphones-parenting.md',
  'robot-vacuum-parenting-guide.md',
];

console.log('📝 残りの記事を処理...\n');
for (const f of targets) {
  console.log(`\n[${f}]`);
  processFile(path.join(BLOG_DIR, f));
}
console.log('\n🎉 完了！');
