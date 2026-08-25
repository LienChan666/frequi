# FreqUI 简体中文版

本分支基于官方 [FreqUI](https://github.com/freqtrade/frequi)，为主要界面、按钮、表格、提示和图表术语提供简体中文显示。

## 设计

- 中文词条集中在 `src/locales/zh-CN.ts`。
- 界面翻译层位于 `src/plugins/zh-cn.ts`，官方新增文案在未翻译时会安全回退为英文。
- ECharts 画布中的常用图例和标题在相应图表组件内翻译。
- `nginx.conf` 将同源 `/api/` 请求代理到 Freqtrade 容器，避免将 API 暴露到公网。

## 远程构建

```bash
git switch zh-CN
docker compose -f docker-compose.zh.yml build
docker compose -f docker-compose.zh.yml up -d
```

默认仅监听 `127.0.0.1:8083`，可通过 SSH 隧道安全访问。要改变端口，设置 `FREQUI_ZH_PORT`：

```bash
FREQUI_ZH_PORT=8082 docker compose -f docker-compose.zh.yml up -d
```

## 同步官方更新

```bash
git fetch upstream
git rebase upstream/main
docker compose -f docker-compose.zh.yml build --pull
docker compose -f docker-compose.zh.yml up -d
```

> 注意：该分支只改变前端显示，不改变 Freqtrade 交易逻辑、策略或 API。
