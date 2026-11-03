# 刘欣彤 · 个人作品集

网站：https://sarahvanlaer1-png.github.io/

根目录为 GitHub Pages 发布文件；`portfolio-source/` 保存 React + Vite 源码。

## 本地修改

使用 Node.js 22.12+ 和 pnpm：

```sh
cd portfolio-source
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

发布更新时，将 `portfolio-source/dist/` 内的文件复制到仓库根目录，再提交到 main 分支。保留 `.nojekyll`。

首屏使用两段经过压缩的 9 秒无声预览；完整视频仅在打开作品弹窗时加载。动态背景按需挂载，离屏暂停或释放资源。原始作品与预览位于 `portfolio-source/public/assets/videos/`。
