# Blog-Server

[English](README.en.md)

<p align="center">一个简单的博客服务器。基于 Node.js、Next.js 和 SQLite。</p>

![preview](previews/preview01.png)

> 项目名称尚未确定，也许你可以给我一些建议？

![License](https://img.shields.io/github/license/skyone-wzw/blog-server)

## 特点

* [x] 支持 GFM (GitHub Flavored Markdown)
* [x] 在线编辑文章
* [x] React Server Components
* [x] Docker 快速部署
* [x] 后台定制网站
* [ ] 全局搜索
* [ ] 在线上传自定义封面

项目还有很多功能未实现，但已经达到了正常使用的程度。欢迎提出建议和贡献代码。 数据库部分应该不会出现不向前兼容的情况，但配置文件和环境变量可能会有变化。

关于内存占用，由于使用 Node.js 且没有进行特殊优化（懒+不会+为了部署简单），和编译型语言自然比不了。空载状态下约 220MB，渲染一篇 3W 字的包含大量数学公式的文章额外使用约 20MB （仅首次渲染时，持续小于1秒），因此流量不大的博客一般使用 300MB。

## 快速开始

### 使用 Docker 运行

下载 `docker-compose.yml` 到本地

```shell
wget https://raw.githubusercontent.com/skyone-wzw/blog-server/master/docker-compose.yml
```

编辑环境变量（如为本地测试无需修改）

* `DATABASE_URL`: 数据库文件路径，默认为 `file:./data/data.db`
* `DATA_DIR`: 数据目录，默认为 `./data`
* `SECRET_KEY`: AES 加密密钥，必填，长度为 32 的字符串
* `SECRET_IV`: AES 加密向量，必填，长度为 16 的字符串
* `AUTH_EMAIL`: 后台登录邮箱，必填
* `AUTH_PASSWORD`: 后台登录密码，必填

```shell
docker-compose up -d
```

打开浏览器访问 `http://localhost:3000`。

### 从 Release 下载预编译版

从 [Release](https://github.com/skyone-wzw/blog-server/releases) 下载最新版本的预编译版。解压至任意目录，同步数据库并启动服务器：

```shell
npm prisma generate
npm run start
```

打开浏览器访问 `http://localhost:3000`。

### 从源码构建

> [!NOTE]
> 已知构建时可能出现内存泄漏（eslint@8 依赖库问题），正在等待修复，运行时不会出现问题。
> 
> 若要本地构建，至少需要 2GB 内存。

首先克隆这个仓库并安装依赖

```bash
git clone https://github.com/skyone-wzw/blog-server.git --depth=1
cd blog-server
npm install
```

构建程序

```shell
npx prisma generate
npm run run patch-font
npm run build
```

创建运行目录并拷贝构建产物

```shell
mkdir build
cp -r public build/public
cp -r .next/standalone/* build
mkdir build/.next
cp -r .next/static .next/static
```

后续步骤与 [从 Release 下载预编译版](#从-release-下载预编译版) 相同。

## 配置

有两个配置文件：`.env` 和 `data/config.json`。其他自定义内容（如网站标题、Logo、作者等）可以在网站后台设置。

### 环境变量

在 `.env` （位于项目根目录）文件中，你可以设置数据目录和数据库文件的路径，写入该文件的环境变量会被自动加载，当然直接设置环境变量也是可以的。

```ini
# Required
DATABASE_URL="file:./data/data.db"

# Optional, default is ./data
DATA_DIR=./data

# Optional, you can set it in data/config.json
SECRET_KEY="12345678123456781234567812345678"
SECRET_IV="1234567812345678"
AUTH_EMAIL=abc@example.com
AUTH_PASSWORD=123456
```

### 配置文件

`data/config.json` （data 目录由环境变量 `DATA_DIR` 指定）文件是环境变量的代替方案。如果你不想使用环境变量，也可以选择配置文件。但无论如何，你必须设置 `DATABASE_URL` 环境变量。

**注意：环境变量优先级高于配置文件。**

参考下面的示例，所有选项均为可选：

```json
{
  "auth": {
    "email": "",
    "password": ""
  },
  "secret": {
    "key": "",
    "iv": ""
  },
  "dir": {
    "data": "./data",
    "image": "./data/post",
    "cover": "./data/cover",
    "random": "./data/cover/random",
    "custom": "./data/custom"
  }
}
```

> 环境变量优先级高于配置文件，且环境变量在加载配置文件之后读取，但 `DATA_DIR` 例外，因为配置文件的位置也由 `DATA_DIR` 确定。
> 
> 简而言之，配置文件位于 `$DATA_DIR/config.json`，环境变量优先级高于配置文件。

### 配置项说明

环境变量中：

* `DATA_DIR`: 数据目录
* `DATABASE_URL`: 数据库文件路径，格式为 `file:/path/to/database.db`
* `SECRET_KEY`: AES 加密密钥
* `SECRET_IV`: AES 加密向量
* `AUTH_EMAIL`: 后台登录邮箱
* `AUTH_PASSWORD`: 后台登录密码

配置文件中：

* `auth.email`: 后台登录邮箱
* `auth.password`: 后台登录密码
* `secret.key`: AES 加密密钥
* `secret.iv`: AES 加密向量
* `dir.data`: 数据目录，建议使用环境变量 `DATA_DIR`
* `dir.image`: 文章图片目录，不建议修改
* `dir.cover`: 文章封面背景图目录，不建议修改
* `dir.random`: 文章封面背景图随机目录，不建议修改
* `dir.custom`: 自定义文件目录，不建议修改

## 文章封面背景图

目前尚未实现前端上传功能，你可以通过 FTP 或其他方式上传图片到服务器。

默认情况下，文章封面背景图是随机的。你可以在 `data/cover/random` 目录下放置你的图片。路径为 `data/cover/[slig].(jpg|png|webp)` 的图片会被对应文章的封面使用。具体匹配规则如下：

1. 查找 `data/cover/[slug].(jpg|png|webp)`，如果存在则使用，存在多个格式则随机选择一个
2. 查找 `data/cover/random/`，如果存在则随机选择一个
3. 若程序启动时未找到任何图片，则创建 `data/cover/random/default.webp` 作为默认图片

## 开源许可证

[MIT](LICENSE)
