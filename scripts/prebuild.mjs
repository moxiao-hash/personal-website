// 预渲染脚本：把 site-data.js 中的项目作为轮播卡片写入 index.html 的项目区。
//
// 用途：本项目由 GitHub Pages 直接托管静态文件（无 CI 构建）。为了让"查看源代码"
// 也能直接看到项目轮播卡片（而不是空的项目容器），提交前运行此脚本，把轮播卡片
// HTML 静态写入 index.html，并同步更新总数计数。main.js 仍会在浏览器里按
// site-data.js 重新初始化轮播，作为数据驱动的实时兜底。
//
// 用法：npm run render
import { readFile, writeFile } from 'node:fs/promises';

import { projects } from '../src/data/site-data.js';
import { createProjectSlideMarkup } from '../src/ui/projects.js';

const indexPath = new URL('../index.html', import.meta.url);

const html = await readFile(indexPath, 'utf8');
const slidesMarkup = projects.map(createProjectSlideMarkup).join('\n');
const total = String(projects.length).padStart(2, '0');

// 定位 project-list（carousel-track）容器，将其展开以容纳轮播卡片 HTML。
const pattern = /(<div\b[^>]*\bid=["']project-list["'][^>]*>)[\s\S]*?(<\/div>)/;

if (!pattern.test(html)) {
  throw new Error('project-list container was not found in index.html');
}

let rendered = html.replace(pattern, (_match, open, close) => {
  return `${open}\n${slidesMarkup}\n${close}`;
});

// 同步更新总数计数（如 "01 / 05" 中的 05）。
rendered = rendered.replace(
  /(<span class="carousel-total">)[\s\S]*?(<\/span>)/,
  (_match, open, close) => `${open}${total}${close}`,
);

await writeFile(indexPath, rendered, 'utf8');
console.log(`Rendered ${projects.length} project slide(s) into index.html.`);
