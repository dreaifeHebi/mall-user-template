# Mall User Template

Mall 用户端模板，基于 Vue 3、Vite、TypeScript、Pinia 和 Vue Router，面向通用 Web 商城页面。

旧 UniApp 项目仅作为离线参考保留在 `legacy-uniapp/`；当前运行路由不再做旧 hash 兼容。

## 默认接口

- `VITE_API_BASE_URL=http://localhost:8085/portal`
- `VITE_FRONTEND_BASE_URL=http://localhost:8060`
- `VITE_BACKEND_BASE_URL=http://localhost:8085`

配置可以放在 `.env.development`、`.env.production` 或 CI 的变量中。

## 本地运行

```bash
npm install
npm run dev
```

默认访问地址：`http://localhost:8060`

默认展示账号：

- `demo_user / 123456`

## 构建

```bash
npm run build
```

GitHub Actions 只保留手动触发。默认只构建；只有手动把 `deploy` 输入设为 `true` 且配置了对应 secrets/vars 时，才会同步到 S3 兼容静态托管。

## 当前迁移范围

- 已替换：UniApp -> 普通 Vue 3 Web app
- 已接入：商城首页、商品列表、新品/热销商品列表、商品详情、品牌列表、品牌详情、购物车、确认下单、订单列表、订单详情、H5 支付创建/状态查询/取消、本地 `LOCAL_SELF` 自确认支付成功、退款申请/列表/详情/取消、用户中心、登录注册入口、账户资料编辑、修改密码、找回/重置密码、邮箱验证、收货地址列表和编辑、商品收藏、本次会话浏览足迹、品牌关注、关于/联系/帮助/下单须知内容页、默认英文 UI 和 `EN / 中文` 语言切换
- 已清理：运行层旧 UniApp hash 兼容、会员等级/积分展示、外部坏图样例
- 待生产接入：Stripe/支付宝/微信等第三方支付 provider、真实回调联调和后台退款审核/真实原路退款联调
