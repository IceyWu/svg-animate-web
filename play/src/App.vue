<template>
  <div
    font-sans
    text="center gray-700 dark:gray-200"
    class="w-full h-screen flex flex-col"
  >
    <div class="sticky top-0">
      <TheHeader />
    </div>
    <div class="fcc">
      <SVGLogo @vue:mounted="initSvg" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { VNode } from "vue";
import SetSvgAnimation from "../../src/";
import SVGLogo from "./components/SVGLogo.vue";
const initSvg = (vnode: VNode) => {
  const dom = vnode.el as any;
  // SetSvgAnimation(dom, {
  //   duration: 1,

  //   strokeWidth: 0.5,
  //   count: 1,
  // });
  SetSvgAnimation(dom, {
    duration: 5,
    fill: "transparent",
    fillBase: "#333",
    stroke: "#333",
    strokeWidth: 10,
    count: 1,
  });
};
</script>
