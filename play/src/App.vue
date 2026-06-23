<script setup lang="ts">
import { controlSvgAnimation, setSvgAnimation } from "svg-animate-web";
import { onMounted, ref } from "vue";
import SVGLogo from "./components/SVGLogo.vue";

const logoRef = ref<InstanceType<typeof SVGLogo> | null>(null);

function getSvg(): SVGSVGElement | null {
  return logoRef.value?.$el ?? null;
}

function play() {
  const svg = getSvg();
  if (svg) {
    setSvgAnimation(svg, { duration: 3, count: "infinite", strokeWidth: 2 });
  }
}

function pause() {
  const svg = getSvg();
  if (svg) {
    controlSvgAnimation(svg, "pause");
  }
}

function reset() {
  const svg = getSvg();
  if (svg) {
    controlSvgAnimation(svg, "reset");
  }
}

onMounted(play);
</script>

<template>
  <main class="app">
    <h1>svg-animate-web</h1>

    <div class="stage">
      <SVGLogo ref="logoRef" />
    </div>

    <div class="controls">
      <button type="button" @click="play">Play</button>
      <button type="button" @click="pause">Pause</button>
      <button type="button" @click="reset">Reset</button>
    </div>
  </main>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.stage {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage :deep(svg) {
  width: 360px;
  height: auto;
}

.controls {
  display: flex;
  gap: 0.75rem;
}

button {
  padding: 0.5rem 1.25rem;
  border: 1px solid #646cff;
  border-radius: 6px;
  background: #646cff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #535bf2;
}
</style>
