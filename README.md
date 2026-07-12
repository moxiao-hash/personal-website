# moxiao6657 个人主页

一个无需构建、无运行时依赖的静态个人主页。页面使用原生 HTML、CSS 和 JavaScript，可部署到免费静态托管平台，也可迁移到自己的 Nginx 或 Caddy 服务器。

## 本地预览与测试

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

修改后运行 `npm test`，确认数据结构和页面契约仍然正确。

## 免费静态托管

GitHub Pages、Cloudflare Pages 或 Vercel 都可以托管本项目。项目没有构建步骤：将仓库根目录作为发布目录，直接发布 `index.html`、`assets/` 和 `src/` 即可。

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
