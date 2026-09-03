// 预渲染脚本：把 site-data.js 中的项目卡片写入 index.html 的 project-list 容器。
//
// 用途：本项目由 GitHub Pages 直接托管静态文件（无 CI 构建）。为了让"查看源代码"
// 也能直接看到项目卡片（而不是一个空的 project-list），提交前运行此脚本，把卡片
// HTML 静态写入 index.html。main.js 仍会在浏览器里按 site-data.js 重新渲染一遍，
// 内容一致，作为数据驱动的实时兜底。
//
// 用法：npm run render
import { readFile, writeFile } from 'node:fs/promises';

import { projects } from '../src/data/site-data.js';
import { createProjectCardMarkup } from '../src/ui/projects.js';

const indexPath = new URL('../index.html', import.meta.url);

const html = await readFile(indexPath, 'utf8');
const cardMarkup = projects.map(createProjectCardMarkup).join('\n');

// 定位 project-list 容器（自闭合，内含空白），将其展开以容纳卡片 HTML。
const pattern = /(<div\b[^>]*\bid=["']project-list["'][^>]*>)[\s\S]*?(<\/div>)/;

if (!pattern.test(html)) {
  throw new Error('project-list container was not found in index.html');
}

const rendered = html.replace(pattern, (_match, open, close) => {
  return `${open}\n${cardMarkup}\n${close}`;
});

await writeFile(indexPath, rendered, 'utf8');
console.log(`Rendered ${projects.length} project card(s) into index.html.`);
