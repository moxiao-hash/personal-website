# moxiao6657 个人主页

一个无需构建、无运行时依赖的静态个人主页。页面使用原生 HTML、CSS 和 JavaScript，可部署到免费静态托管平台，也可迁移到自己的 Nginx 或 Caddy 服务器。

## 本地预览与测试

Node.js 和 npm 仅用于运行自动化测试及本地开发，不是网站部署或运行的必需条件。

在项目根目录启动本地静态服务器：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。运行自动化测试：

```bash
npm test
```

## 添加或更新作品

编辑 `src/data/site-data.js` 中的 `projects` 数组。每个作品都使用完整结构：

```js
{
  name: '作品名称',
  description: '一句简短介绍',
  tags: ['标签一', '标签二'],
  url: 'https://project.example.com',
}
```

- `name`：作品名称。
- `description`：作品简介。
- `tags`：标签数组。
- `url`：作品地址；只有有效的 HTTP(S) URL 才会显示为可访问链接。
- 作品还没上线时，将 `url` 留空为 `''`，卡片会安全地显示“即将上线”，不会产生无效链接。

修改后先运行 `npm run render`，把最新的项目卡片预渲染写入 `index.html`，再运行 `npm test`，确认数据结构和页面契约仍然正确。这样即使不执行浏览器里的 JavaScript，直接"查看源代码"也能看到项目卡片。

## 免费静态托管

GitHub Pages、Cloudflare Pages 或 Vercel 都可以托管本项目。项目本身是纯静态文件，运行时无需构建：只要把 `index.html`、`assets/` 和 `src/` 作为发布目录即可。为了便于查看 `index.html` 时直接看到项目卡片，编辑 `src/data/site-data.js` 后请在本地执行一次 `npm run render`（预渲染脚本会把最新卡片静态写入 `index.html`），再提交。

绑定个人域名时，在域名服务商处按托管平台提示添加 DNS 记录，并在平台中填写对应域名、开启 HTTPS。

## 部署到自己的服务器

同样无需安装 Node.js 或执行构建命令。把 `index.html`、`assets/` 和 `src/` 上传到 Web 服务器的文档根目录，例如 `/var/www/personal-website`，并确保这些文件对 Web 服务器可读。

Nginx 可将主机名指向该目录：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/personal-website;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

生产环境还应配置 TLS 证书，并把 HTTP 请求 301 重定向到 HTTPS。可使用 Certbot 申请和续期证书，然后让 Nginx 在 443 端口加载证书。

Caddy 会为可公开访问且 DNS 已正确解析的域名自动申请并续期 HTTPS 证书，最小配置为：

```caddyfile
example.com {
    root * /var/www/personal-website
    file_server
}
```

将 `example.com` 替换为实际主机名，并先把域名的 A/AAAA 记录指向服务器 IP。主页可使用主域名；以后每个作品可使用独立子域名（例如 `project.example.com`），将其 DNS 指向对应服务器，并为该子域名配置独立的 Nginx `server` 或 Caddy 站点及文档根目录。

## 视觉与交互

本站的编排参考了优秀个人作品集的杂志式排版与设计巧思，并转译为统一的蓝色体系：

- **编号 eyebrow**：每节以 `01 / about`、`02 / learning`… 编号与短横线开场，营造章节感。
- **Hero 双栏**：左侧文案 + 封面亮点强调词，右侧为蓝色装饰场景（纯 CSS 渐变球体），窄屏自动回退单列。
- **分区对比**：项目区（`#projects`）用深蓝底色从浅蓝主背景中突显，配合大号总数（`05 · REPOSITORIES`）。
- **产品感卡片**：每个项目卡片顶部带有"浏览器窗口"细节（纯 CSS 伪元素，不影响 DOM，查看源码仍可读）。
- **顶部导航与状态点**：固定顶栏（WORK / ABOUT / CONTACT）+ `Building in public` 状态点。
- **按钮体系**：胶囊实心主按钮与描边次级按钮，配合轻量上浮微交互。
- **动效细节**：Hero 装饰球体缓慢自转、精指针设备上的自定义光标跟随环、按钮磁吸吸附微效（均尊重 `prefers-reduced-motion`，触屏设备自动降级）。

以上均为纯 CSS/结构与少量 JavaScript 实现，无第三方依赖；遵循 `prefers-reduced-motion` 与触屏（`pointer: coarse`）降级。
