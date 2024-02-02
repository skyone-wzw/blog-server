# Blog-Server

[English](README.en.md)

项目名称尚未确定，也许你可以给我一些建议？

> 一个简单的博客服务器。基于 Node.js、Next.js 和 SQLite。

![License](https://img.shields.io/github/license/skyone-wzw/blog-server)
![Node.js Version](https://img.shields.io/node/v/blog-server)

## 特点

* [x] 支持 GFM (GitHub Flavored Markdown)
* [x] 在线编辑文章
* [x] React Server Components
* [x] Docker 快速部署
* [ ] 可以使用 [skyone-wzw/blog-server-export](https://github.com/skyone-wzw/blog-server-export) 将文章导出为静态 HTML 文件

## 快速开始

首先克隆这个仓库并安装依赖。

```bash
git clone https://github.com/skyone-wzw/blog-server.git --depth=1
cd blog-server
npm install
```

启动服务器

```bash
npm run build && npm run start
```

在浏览器中打开 `http://localhost:3000` 并享受它吧！

## 配置

有两个配置文件：`.env` 和 `data/config.json`。

在 `.env` 文件中，你可以设置数据目录和数据库文件的路径。

```ini
DATABASE_URL="file:./data/data.db"
DATA_DIR=./data

# Optional, you can set it in data/config.json
SECRET_KEY="12345678123456781234567812345678"
SECRET_IV="1234567812345678"
AUTH_EMAIL=abc@example.com
AUTH_PASSWORD=123456
```

`data/config.json` 是环境变量的代替方案。如果你不喜欢使用环境变量，你可以使用这个文件。

参考下面的示例：

```json
{
  "auth": {
    "email": "",
    "password": ""
  },
  
  "secret": {
    "key": "",
    "iv": ""
  }
}
```

## 开源许可证

[MIT](LICENSE)
