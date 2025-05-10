# 从需求到实现：我的 SVG 动画玩具库开发小记

## 契机

周末闲暇时，我在做个人网站时遇到一个有趣的需求：想让 SVG 图标有个描边动画效果。市面上有很多成熟的动画库，但大多功能繁杂、体积庞大。其实我只需要一个轻量的 SVG 动画解决方案，于是决定自己动手写一个。

这就是`svg-animate-web`的由来 —— 一个完全为个人兴趣开发的小工具，纯粹是解决自己的需求，顺便分享给有类似需求的同学。

## 核心理念

作为一个周末玩具项目，我给自己设定了几个简单规则：

- 只实现自己需要的功能，不追求大而全
- 无第三方依赖，纯原生实现
- 尽量保持 API 简洁明了

## 实现原理剖析

与其展示大量使用示例，我想和大家分享下这个小工具的核心实现原理和一些有趣的技术点。

### 描边动画的实现

SVG 描边动画的核心是利用`stroke-dasharray`和`stroke-dashoffset`这两个属性。源码中的核心实现如下：

```javascript
// 路径动画应用函数核心逻辑
function applyPathAnimation(pathElement, options) {
  // 计算路径长度
  let pathLength = 0;
  try {
    pathLength = pathElement.getTotalLength(); // 获取路径总长度
  } catch (e) {
    // 降级处理
    const bbox = pathElement.getBBox();
    pathLength = 2 * (bbox.width + bbox.height);
  }

  // 生成唯一ID
  const id = Math.random().toString(36).substring(2, 10);

  // 设置初始样式
  setStyle(pathElement, {
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    animation: `animation${id} ${options.duration}s ${options.easing} ${options.delay}s ${options.count} forwards`,
  });

  // 插入动画关键帧
  insertKeyframes(`
    @keyframes animation${id} {
      0% { stroke-dashoffset: ${pathLength}; }
      100% { stroke-dashoffset: 0; }
    }
  `);
}
```

这里的技术要点有：

1. 使用`getTotalLength()`获取路径长度，同时提供降级方案
2. 为每个动画生成唯一 ID，避免 CSS 冲突
3. 动态创建和插入 CSS 关键帧，而非使用 JavaScript 动画

### 动态样式和关键帧注入

为了避免污染全局 CSS 命名空间，我采用了动态生成和注入 CSS 的方式：

```javascript
function insertKeyframes(keyframes) {
  let styleEl = document.getElementById("svg-animate-keyframes");

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "svg-animate-keyframes";
    document.head.appendChild(styleEl);
  }

  try {
    const sheet = styleEl.sheet;
    if (sheet) {
      sheet.insertRule(keyframes, sheet.cssRules.length);
    } else {
      throw new Error("Style sheet not available");
    }
  } catch (e) {
    // 回退处理
    styleEl.textContent += keyframes;
  }
}
```

这段代码有个有趣的地方：我先尝试使用 CSSOM API 直接操作样式表，如果失败则回退到直接修改`textContent`。这增加了兼容性，同时尽量使用更高效的 API。

### 不同元素类型的处理

不同于许多商业库的复杂架构，我使用了简单的条件判断区分不同 SVG 元素：

```javascript
export function setPathAnimation(element, options) {
  if (!element || !(element instanceof SVGElement)) return;

  // 检查是否为矩形元素
  const isRect = element.tagName.toLowerCase() === "rect";

  if (isRect) {
    // 应用矩形特有动画
    applyRectAnimation(element, {
      // 配置参数
    });
  } else {
    // 应用路径元素动画
    applyPathAnimation(element, {
      // 配置参数
    });
  }
}
```

这种朴素的方式虽然不够优雅，但对于一个个人玩具项目来说足够简单明了，也便于理解和修改。

## 一些有趣的实现细节

### 自动处理 SVG 元素原始样式

在应用动画时，需要考虑 SVG 元素可能已有的样式。比如如何优雅处理已有的 fill 和 stroke 属性：

```javascript
function getElementFillColor(element, defaultColor, userColor) {
  if (userColor) return userColor;

  const inlineFill = element.getAttribute("fill");
  if (inlineFill && inlineFill !== "none") return inlineFill;

  try {
    const computedFill = window.getComputedStyle(element).fill;
    if (
      computedFill &&
      computedFill !== "none" &&
      computedFill !== "rgb(0, 0, 0)"
    ) {
      return computedFill;
    }
  } catch (e) {
    // 忽略计算样式错误
  }

  return defaultColor;
}
```

这个函数会按优先级依次检查：

1. 用户指定的颜色
2. 元素的内联 fill 属性
3. 元素的计算样式
4. 默认颜色

这种细节处理让库在实际使用时更加健壮。

### 性能考量

即使是个人玩具项目，我也注重性能。比如在处理多个 SVG 元素时，采用了延迟执行的策略：

```javascript
export function setSvgAnimation(svgElement, options) {
  if (!svgElement) return;

  const pathElements = svgElement.querySelectorAll(
    "path, line, polyline, polygon, rect, circle, ellipse"
  );

  Array.from(pathElements).forEach((element, index) => {
    if (!(element instanceof SVGElement)) return;

    const elementOptions = { ...options };
    elementOptions.delay = (options?.delay ?? 0) + index * 0.1; // 错开动画开始时间
    setPathAnimation(element, elementOptions);
  });
}
```

通过为每个元素设置递增的延迟，既创造了序列动画效果，又避免了同时执行大量动画带来的性能问题。


## 未来可能的改进

作为一个个人玩具项目，我并没有什么宏大的路线图，但确实有一些有趣的改进点：

- 添加更多元素类型的专用动画
- 优化动画性能，特别是对于复杂 SVG
- 增加更多动画控制选项

如果你对这个小工具感兴趣，欢迎在 GitHub[] 上提交 issue 或 PR，一起完善它。
