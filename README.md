# Mall User Template

基于 Vue 3 + Vite + TypeScript 的商城前台模板，覆盖从浏览商品、下单支付到售后退款的完整购物流程。

## 在这套模板中的位置

Mall Template 由四个仓库组成，可以一起部署成一个完整的小型商城：

| 仓库 | 作用 |
| --- | --- |
| [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs) | 入口文档、整体架构和本地一起部署的示例 |
| [mall-backend-template](https://github.com/dreaifeHebi/mall-backend-template) | Spring Boot 后端，提供后台 API（`mall-admin`）和商城 API（`mall-portal`） |
| [mall-admin-template](https://github.com/dreaifeHebi/mall-admin-template) | 后台管理端，对接 `mall-admin` |
| **mall-user-template**（本仓库） | 商城前台，对接 `mall-portal` |

想把整套模板一起跑起来，从 [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs) 开始。

## 功能

- 浏览：首页推荐、商品列表与筛选、新品和热销、商品详情、分类、品牌列表和品牌详情
- 购物：购物车、确认下单（收货地址、促销金额、商品清单）
- 支付：选择支付方式、创建支付、查询和取消支付；默认使用本地自确认支付，不需要第三方账号即可走通下单流程
- 订单与售后：订单列表和详情、取消订单、确认收货、删除订单；退款申请、退款列表和详情
- 账户：注册登录、资料编辑、修改密码、找回和重置密码、邮箱验证、收货地址管理
- 会员互动：商品收藏、品牌关注、浏览足迹（未登录时只保存在当前浏览器会话）
- 内容页：关于、联系方式、帮助中心、下单须知
- 界面默认英文，顶部可切换 `EN / 中文`

## 技术栈

- Vue 3、Vue Router 4、Pinia
- Vite 6、TypeScript、vue-tsc
- Axios、Day.js
- 生产镜像：Node 20 构建 + Nginx 1.27 静态托管

## 快速开始

需要 Node.js 20 及以上，并先启动后端 `mall-portal`（默认监听 `http://localhost:8085`，见 [mall-backend-template](https://github.com/dreaifeHebi/mall-backend-template)）。

```bash
npm install
```

在仓库根目录新建 `.env.local`，让开发服务器把 `/portal` 请求转发到后端：

```bash
VITE_API_BASE_URL=/portal
VITE_PROXY_TARGET=http://localhost:8085
```

启动开发服务器：

```bash
npm run dev
```

打开 `http://localhost:8060`。演示账号 `demo_user / 123456` 由后端的数据库初始化脚本创建，登录页可一键填入。

其他常用命令：

```bash
npm run typecheck   # 类型检查
npm run build       # 类型检查并构建到 dist/
npm run preview     # 本地预览构建结果（端口 8060）
```

## 配置要点

| 变量 | 作用 |
| --- | --- |
| `VITE_API_BASE_URL` | 浏览器请求商城 API 时使用的前缀，未设置时为 `/portal` |
| `VITE_PROXY_TARGET` | 仅开发服务器使用：`/portal` 请求去掉前缀后转发到这个地址 |

- **Docker 镜像**：[`Dockerfile`](./Dockerfile) 默认以 `VITE_API_BASE_URL=/portal` 构建，[`deployment/nginx.conf`](./deployment/nginx.conf) 把 `/portal/` 和 `/uploads/` 转发到 `mall-portal:8085`。整套编排见 [mall-template-docs](https://github.com/dreaifeHebi/mall-template-docs)。
- **前后端分开部署**：构建时把 `VITE_API_BASE_URL` 设为能访问到商城 API 的完整地址，例如 `VITE_API_BASE_URL=https://api.example.com/portal npm run build`。
- **邮件链接**：注册确认、找回密码等邮件里的链接指向前台路由，前台地址由后端的 `FRONTEND_BASE_URL` 决定。
- **GitHub Actions**：[`build-sync-s3.yml`](./.github/workflows/build-sync-s3.yml) 只能手动触发，默认只构建。把 `deploy` 输入设为 `true`，并配置 secret `AWS_ROLE_ARN` 和变量 `USER_API_BASE_URL`、`USER_S3_BUCKET`、`AWS_REGION` 后，会把构建结果同步到 S3 兼容的静态托管。

## 已知限制

- 默认的本地自确认支付会直接把订单标记为已支付，只适合演示和开发。Stripe、支付宝、微信、信用卡等渠道在后端留了接入点，正式使用需要配置商户参数并完成回调联调。
- 退款申请提交后需要在后台审核；真实的原路退款同样依赖支付渠道配置。
- 注册确认、找回密码和邮箱验证需要后端配置 SMTP 才能真正发出邮件。

## 开发记录

从上游 UniApp 前台改造到当前版本的过程记录见 [docs/migration-notes.md](./docs/migration-notes.md)。

## 许可证

仓库根目录暂未附带 LICENSE 文件。

本项目改造自 [macrozheng/mall](https://github.com/macrozheng/mall) 及其前台项目 [macrozheng/mall-app-web](https://github.com/macrozheng/mall-app-web)（均为 Apache-2.0），感谢原作者。
