# 迁移记录

本文件保存从旧 UniApp 前台改造为当前 Vue 3 模板时的过程记录，供维护者参考。面向使用者的介绍见仓库根目录的 [README](../README.md)。

后续的迁移进度、待办和验证记录都写在本文件里，README 只保留对外介绍。

## 旧代码

旧 UniApp 项目作为离线参考保留在 [`legacy-uniapp/`](../legacy-uniapp/)，不参与当前运行构建；当前运行路由不再兼容旧的 hash 路径。

## 迁移范围

以下内容为原 README 中的“当前迁移范围”清单，按原样保留。

- 已替换：UniApp -> 普通 Vue 3 Web app
- 已接入：商城首页、商品列表、新品/热销商品列表、商品详情、品牌列表、品牌详情、购物车、确认下单、订单列表、订单详情、H5 支付创建/状态查询/取消、本地 `LOCAL_SELF` 自确认支付成功、退款申请/列表/详情/取消、用户中心、登录注册入口、账户资料编辑、修改密码、找回/重置密码、邮箱验证、收货地址列表和编辑、商品收藏、本次会话浏览足迹、品牌关注、关于/联系/帮助/下单须知内容页、默认英文 UI 和 `EN / 中文` 语言切换
- 已清理：运行层旧 UniApp hash 兼容、会员等级/积分展示、外部坏图样例
- 待生产接入：Stripe/支付宝/微信等第三方支付 provider、真实回调联调和后台退款审核/真实原路退款联调

## 原 README 中的接口说明

原 README 写的默认接口为：

- `VITE_API_BASE_URL=http://localhost:8085/portal`
- `VITE_FRONTEND_BASE_URL=http://localhost:8060`
- `VITE_BACKEND_BASE_URL=http://localhost:8085`

后端 `mall-portal` 没有 `/portal` 上下文路径（接口直接挂在 `:8085` 根路径下，例如 `/home/content`），Docker 部署里由 Nginx 把 `/portal/` 去掉前缀后转发。新 README 按这一实际路径改写了配置说明；`.env.example` 和 `vite.config.ts` 里的 `/portal` 默认值未改动。`VITE_FRONTEND_BASE_URL` 和 `VITE_BACKEND_BASE_URL` 目前在 `src/` 中没有被读取。
