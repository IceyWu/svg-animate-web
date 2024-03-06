<h1 align="center">SVG-Animate-Web</h1>

<p align="center">
Making your svg moving🦄.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/svg-animate-web">
    <img src="https://img.shields.io/npm/v/svg-animate-web?color=14C9C9&label=" alt="NPM version">
  </a>
</p>

## 📦 Installation

```bash
npm install svg-animate-web
or
pnpm add svg-animate-web
or
yarn add svg-animate-web
```

## 🦄 Usage

### Vue

```html
<!-- temp.vue -->
<template>
  <svg
    class="w-80 h-80"
    ref="svgRef"
    xmlns="http://www.w3.org/2000/svg"
    id="canvas"
    viewBox="543.535 363.549 714.421 294.549"
  >
    <path
      d="M 5561 ....... 422.32"
      style="stroke: black; fill: black"
      stroke-width="5.5"
    />
    <path
      d="M 5561 ....... 422.32"
      style="stroke: black; fill: black"
      stroke-width="5.5"
    />
    ....
  </svg>
</template>
```

```ts
// main.ts
import SetSvgAnimation from 'svg-animate-web'
const svgRef = ref<HTMLElement>()
onMounted(() => {
  SetSvgAnimation(svgRef.value)

  // Or use with options
  // SetSvgAnimation(svgRef.value, {
  // duration: 5,
  //   fill: "transparent",
  //   fillBase: "#333",
  //   stroke: "#333",
  //   strokeWidth: 10,
  //   count:1
  // })
})
```

## 🐟 Show

[Demo Source](./play/src/App.vue)

<p align="center">
<img src="./docs/use.gif" style="width:100%;"  />
</p>
