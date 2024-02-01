# Blog-Server

[简体中文](README.zh-CN.md)

The name of the project has not yet been decided, and you can give me some suggestions.

> A simple blog server based on Node.js, Next.js and SQLite.

![License](https://img.shields.io/github/license/skyone-wzw/blog-server)
![Node.js Version](https://img.shields.io/node/v/blog-server)

## Features

* [x] GitHub Flavored Markdown support
* [x] Edit post online
* [x] React Server Components
* [ ] Export posts to static HTML files using [skyone-wzw/blog-server-export](https://github.com/skyone-wzw/blog-server-export)

## Quick Start

Clone this repository and install dependencies.

```bash
git clone https://github.com/skyone-wzw/blog-server.git --depth=1
cd blog-server
npm install
```

Start the server.

```bash
npm run build && npm run start
```

Open `http://localhost:3000` in your browser and enjoy it!

## Configuration

There are tow configuration files about the application: `.env` and `data/config.json`.

In `.env` file, you can set the data-dir of the server and the path of the database file.

```ini
DATABASE_URL="file:./data/data.db"
DATA_DIR=./data

# Optional, you can set it in data/config.json
SECRET_KEY="12345678123456781234567812345678"
SECRET_IV="1234567812345678"
AUTH_EMAIL=abc@example.com
AUTH_PASSWORD=123456
```

The `data/config.json` is the configuration file of the blog. You can set the title, description, author and so on. The configure file is located in `${DATA_DIR}/config.json`.

Refer the example below:

```json
{
  "title": "Example Blog",
  "description": "Example Blog - Powered by Blog-Server",
  "url": "https://example.com",
  "keywords": ["example", "blog"],

  "master": {
    "name": "Your Name",
    "description": "Your Description",
    "email": "your-email@example.com",
    "github": "your-github-username"
  },
  
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

## License

[MIT](LICENSE)
