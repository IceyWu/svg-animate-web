<template>
  <div class="w-full min-h-screen bg-gray-50 flex flex-col">
    <div class="sticky top-0 z-10">
      <TheHeader />
    </div>

    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold text-center mb-6">SVG绘制过程动画</h1>

      <div class="flex flex-col md:flex-row gap-4">
        <!-- 控制面板 -->
        <div class="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
          <!-- SVG 示例选择 -->
          <div class="mb-4">
            <label class="block font-bold mb-2">选择示例SVG:</label>
            <div class="flex gap-2">
              <select 
                v-model="selectedExample" 
                class="flex-1 border rounded px-2 py-1"
              >
                <option value="">--选择示例--</option>
                <option value="sun">太阳</option>
                <option value="heart">心形</option>
                <option value="star">星形</option>
                <option value="house">房子</option>
                <option value="face">笑脸</option>
                <option value="iceywu">签名</option>
              </select>
              <button 
                @click="loadExample" 
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                加载示例
              </button>
            </div>
          </div>

          <!-- 文件上传 -->
          <div class="mb-4">
            <label class="block font-bold mb-2">或上传SVG文件:</label>
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept=".svg"
              class="w-full border rounded p-2"
            >
          </div>

          <!-- 渲染模式 -->
          <div class="mb-4">
            <label class="block font-bold mb-2">渲染模式:</label>
            <select 
              v-model="animateOptions.renderMode" 
              class="w-full border rounded px-2 py-1"
            >
              <option value="outline">线条模式</option>
              <option value="fill">填充模式</option>
              <option value="mixed">混合模式</option>
            </select>
          </div>

          <!-- 动画参数 -->
          <div class="mb-4">
            <label class="block font-bold mb-2">动画持续时间(秒):</label>
            <input 
              type="number" 
              v-model="animateOptions.duration" 
              min="0.5" 
              max="10" 
              step="0.5"
              class="w-full border rounded px-2 py-1"
            >
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-2">线条宽度:</label>
            <input 
              type="number" 
              v-model="animateOptions.strokeWidth" 
              min="0.5" 
              max="10" 
              step="0.5"
              class="w-full border rounded px-2 py-1"
            >
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-2">动画延迟(秒):</label>
            <input 
              type="number" 
              v-model="animateOptions.delay" 
              min="0" 
              max="5" 
              step="0.1"
              class="w-full border rounded px-2 py-1"
            >
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-2">动画次数:</label>
            <select 
              v-model="animateOptions.count" 
              class="w-full border rounded px-2 py-1"
            >
              <option value="1">1次</option>
              <option value="2">2次</option>
              <option value="3">3次</option>
              <option value="infinite">无限循环</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-2">缓动函数:</label>
            <select 
              v-model="animateOptions.easing" 
              class="w-full border rounded px-2 py-1"
            >
              <option value="linear">线性</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>

          <!-- 动画控制按钮 -->
          <div class="flex gap-2">
            <button 
              @click="startAnimation" 
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              开始动画
            </button>
            <button 
              @click="pauseAnimation" 
              class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              暂停
            </button>
            <button 
              @click="resetAnimation" 
              class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              重置
            </button>
          </div>
        </div>

        <!-- SVG显示区域 -->
        <div class="w-full md:w-2/3 bg-white rounded-lg shadow p-4 flex items-center justify-center min-h-[400px]">
          <div ref="svgContainer" class="w-full h-full flex items-center justify-center">
            <SVGLogo v-if="!customSvgLoaded" />
            <div v-else v-html="svgContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { setSvgAnimation, controlSvgAnimation } from '../../src/';
import SVGLogo from './components/SVGLogo.vue';
import { svgExamples } from './data/svgExamples'; // 导入SVG示例库



// 引用和状态变量
const svgContainer = ref<HTMLElement | null>(null);
const selectedExample = ref('');
const customSvgLoaded = ref(false);
const svgContent = ref('');

// 动画选项
const animateOptions = reactive({
  duration: 3,
  strokeWidth: 2,
  count: 1,
  renderMode: 'outline' as 'outline' | 'fill' | 'mixed',
  delay: 0,
  easing: 'linear' as 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out',
  fill: 'transparent',
  onComplete: () => {
    console.log('Animation completed!');
  }
});

// 加载示例SVG
const loadExample = async () => {
  if (!selectedExample.value) return;
  
  const exampleContent = svgExamples[selectedExample.value as keyof typeof svgExamples];
  console.log('🐠-----exampleContent-----', exampleContent);
  if (exampleContent) {
    customSvgLoaded.value = true;
    svgContent.value = exampleContent;
    
    await nextTick();
    initSvgAnimation();
  }
};

// 文件上传处理
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        customSvgLoaded.value = true;
        svgContent.value = e.target?.result as string || '';
        
        await nextTick();
        initSvgAnimation();
      };
      reader.readAsText(file);
    } else {
      alert('请选择SVG文件');
    }
  }
};

// 初始化SVG动画
const initSvgAnimation = () => {
  if (!svgContainer.value) return;
  
  const svgElement = svgContainer.value.querySelector('svg');
  if (svgElement) {
    resetAnimation();
  }
};

// 开始动画
const startAnimation = () => {
  if (!svgContainer.value) return;
  
  const svgElement = svgContainer.value.querySelector('svg');
  if (svgElement) {
    setSvgAnimation(svgElement, animateOptions);
  }
};

// 暂停动画
const pauseAnimation = () => {
  if (!svgContainer.value) return;
  
  const svgElement = svgContainer.value.querySelector('svg');
  if (svgElement) {
    controlSvgAnimation(svgElement, 'pause');
  }
};

// 重置动画
const resetAnimation = () => {
  if (!svgContainer.value) return;
  
  const svgElement = svgContainer.value.querySelector('svg');
  if (svgElement) {
    controlSvgAnimation(svgElement, 'reset');
  }
};

// 页面加载时初始化默认SVG
onMounted(async () => {
  // 默认加载太阳示例
  selectedExample.value = 'sun';
  await loadExample();
});
</script>

<style scoped>
/* 可以根据需要添加额外的样式 */
</style>