<h1 align="center">SVG-Animate-Web</h1>

<p align="center">
Making your svg moving🦄.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/svg-animate-web">
    <img src="https://img.shields.io/npm/v/svg-animate-web?color=14C9C9&label=" alt="NPM version">
  </a>
</p>


## 动机

周末闲暇时，我在做个人网站时遇到一个有趣的需求：想让 SVG 图标有个描边动画效果。市面上有很多成熟的动画库，但大多功能繁杂、体积庞大。其实我只需要一个轻量的 SVG 动画解决方案，于是决定自己动手写一个。

这就是`svg-animate-web`的由来 —— 一个完全为个人兴趣开发的小工具，纯粹是解决自己的需求，顺便分享给有类似需求的同学。

## 📦 Installation

```bash
npm install svg-animate-web
or
pnpm add svg-animate-web
or
yarn add svg-animate-web
```

## 🦄 Usage
[Demo](https://svg-animate-web.netlify.app/)


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

## 🐟 Source

[Demo Source](./play/src/App.vue)

<p align="center">
<img src="./docs/use.gif" style="width:100%;"  />
</p>
