<div align="center">

<img src="./docs/logo.gif" alt="svg-animate-web logo" width="120" />

<h1>svg-animate-web</h1>

<p>一个零依赖的 <strong>SVG 动画</strong>工具库 —— 用一个函数让图标、Logo 和插画动起来。</p>

[![npm](https://img.shields.io/npm/v/svg-animate-web?style=flat-square&color=18181b&label=npm)](https://www.npmjs.com/package/svg-animate-web)
[![downloads](https://img.shields.io/npm/dm/svg-animate-web?style=flat-square&color=18181b&label=downloads)](https://www.npmjs.com/package/svg-animate-web)
[![gzip](https://img.shields.io/bundlephobia/minzip/svg-animate-web?style=flat-square&color=18181b&label=gzip)](https://bundlephobia.com/package/svg-animate-web)
[![types](https://img.shields.io/npm/types/svg-animate-web?style=flat-square&color=18181b&label=types)](https://www.npmjs.com/package/svg-animate-web)
[![license](https://img.shields.io/npm/l/svg-animate-web?style=flat-square&color=18181b&label=license)](./LICENSE)

**[English](./README.md)** · **[中文文档](./README.zh-CN.md)** · **[在线演示](https://svg-animate-web.netlify.app/)** · **[示例源码](./play/src/App.vue)**

<p align="center">
  <img src="./docs/use.gif" alt="svg-animate-web demo" width="520" />
</p>

</div>

---

## ✨ 特性

- 🪶 **零依赖** — 体积轻量，无运行时依赖
- 🧩 **框架无关** — 支持 Vue、React、原生 JS 或任意 Web 技术栈
- 🎨 **多种渲染模式** — `outline`、`fill`、`mixed`、`grow`、`fade-in`
- ⏯️ **播放控制** — 运行时支持 `play`、`pause`、`reset`
- 🔡 **类型友好** — 使用 TypeScript 构建

## 📦 安装

```bash
pnpm add svg-animate-web
```

## 🚀 使用

```ts
import { setSvgAnimation } from 'svg-animate-web'

const svg = document.querySelector<SVGSVGElement>('#my-svg')

setSvgAnimation(svg, {
  duration: 3,
  stroke: '#333',
  strokeWidth: 2,
  count: 'infinite',
})
```

```html
<svg id="my-svg" viewBox="0 0 100 100">
  <path d="M10 10 L90 90" />
  <path d="M90 10 L10 90" />
</svg>
```

Vue / React 用户可以在 SVG 元素挂载后调用 `setSvgAnimation`。

## ⚙️ 配置项

| 配置          | 类型                              | 默认值       | 说明                         |
| ------------- | --------------------------------- | ------------ | ---------------------------- |
| `duration`    | `number`                          | `5`          | 动画时长，单位秒             |
| `delay`       | `number`                          | `0`          | 初始延迟，单位秒             |
| `count`       | `number \| string`                | `'infinite'` | 动画循环次数                 |
| `easing`      | CSS timing function               | `'linear'`   | 动画缓动函数                 |
| `reverse`     | `boolean`                         | `false`      | 是否反向播放动画             |
| `fill`        | `string`                          | —            | 覆盖填充色                   |
| `fillBase`    | `string`                          | —            | 基础填充色                   |
| `stroke`      | `string`                          | `'#333'`     | 描边颜色                     |
| `strokeWidth` | `number`                          | `1`          | 描边宽度                     |
| `renderMode`  | `outline \| fill \| mixed \| grow \| fade-in` | path: `outline`, rect: `grow` | 动画样式 |
| `pathOptions` | `Partial<PathAnimateOptions>`     | —            | path 类元素的独立配置        |
| `rectOptions` | `Partial<RectAnimateOptions>`     | —            | `<rect>` 元素的独立配置      |
| `onComplete`  | `() => void`                      | —            | 动画结束后的回调             |

## 🛠️ API

```ts
setSvgAnimation(svg, options?)
setPathAnimation(element, options?)
controlSvgAnimation(svg, 'play' | 'pause' | 'reset')
```

## 🐟 示例

完整示例源码见 [`play/src/App.vue`](./play/src/App.vue)。

```bash
pnpm install
pnpm play
```

## 📄 License

<div align="center">

MIT © [Icey Wu](https://github.com/iceywu)

<sub>如果这个项目对你有帮助，欢迎点一个 ⭐。</sub>

</div>
