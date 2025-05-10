// 基础动画配置接口
export interface BaseAnimateOptions {
  duration?: number;
  count?: string | number;
  delay?: number;
  easing?: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
  onComplete?: () => void;
  reverse?: boolean;
}

// 添加通用样式选项接口
export interface StyleOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

// 路径元素的动画配置
export interface PathAnimateOptions extends BaseAnimateOptions, StyleOptions {
  fillBase?: string;
  renderMode?: "outline" | "fill" | "mixed";
}

// 矩形元素的动画配置
export interface RectAnimateOptions extends BaseAnimateOptions, StyleOptions {
  renderMode?: "grow" | "fade-in" | "outline";
}

// 合并接口
export interface AnimateOptions extends BaseAnimateOptions, StyleOptions {
  rectOptions?: Partial<RectAnimateOptions>;
  pathOptions?: Partial<PathAnimateOptions>;
  fillBase?: string; // 兼容旧版本
  renderMode?: "outline" | "fill" | "mixed" | "grow" | "fade-in";
}

function setStyle(
  element: HTMLElement | SVGElement,
  styles: Record<string, any>
) {
  if (!element || !styles) return;

  Object.entries(styles).forEach(([key, value]) => {
    if (value === undefined) return;

    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

    // 跳过特定类名元素上的白名单属性
    if (element.className?.animVal && ["fill", "stroke-width"].includes(cssKey))
      return;

    element.style.setProperty(cssKey, value.toString());
  });
}

function getElementFillColor(
  element: SVGElement,
  defaultColor: string,
  userColor?: string
): string {
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

function getElementStrokeColor(
  element: SVGElement,
  defaultColor: string
): string {
  const inlineStroke = element.getAttribute("stroke");
  return inlineStroke && inlineStroke !== "none" ? inlineStroke : defaultColor;
}

function insertKeyframes(keyframes: string): void {
  let styleEl = document.getElementById(
    "svg-animate-keyframes"
  ) as HTMLStyleElement;

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
    // 回退到直接添加文本内容
    styleEl.textContent += keyframes;
  }
}

// 创建动画关键帧
function createAnimationKeyframes(
  renderMode: string,
  pathLength: number,
  id: string
): string {
  switch (renderMode) {
    case "outline":
      return `
        @keyframes animation${id} {
          0% { stroke-dashoffset: ${pathLength}; }
          100% { stroke-dashoffset: 0; }
        }
      `;

    case "fill":
      return `
        @keyframes animation${id} {
          0% { fill-opacity: 0; stroke-dashoffset: ${pathLength}; }
          60% { fill-opacity: 0; stroke-dashoffset: 0; }
          100% { fill-opacity: 1; stroke-dashoffset: 0; stroke-opacity: 0.3; }
        }
      `;

    case "mixed":
      return `
        @keyframes animation${id} {
          0% { fill-opacity: 0; stroke-dashoffset: ${pathLength}; }
          50% { fill-opacity: 0.5; stroke-dashoffset: ${pathLength / 2}; }
          100% { fill-opacity: 1; stroke-dashoffset: 0; }
        }
      `;

    case "grow":
      return `
        @keyframes rect-animation${id} {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `;

    case "fade-in":
      return `
        @keyframes rect-animation${id} {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `;

    default:
      return "";
  }
}

// 添加动画完成事件监听
function addAnimationEndListener(
  element: SVGElement,
  callback?: () => void
): void {
  if (!callback) return;

  element.addEventListener("animationend", function handler() {
    if (callback) {
      callback();
    }
    element.removeEventListener("animationend", handler);
  });
}

export function setPathAnimation(
  element: SVGElement,
  options?: AnimateOptions
) {
  if (!element || !(element instanceof SVGElement)) return;

  // 检查是否为矩形元素
  const isRect = element.tagName.toLowerCase() === "rect";

  if (isRect) {
    const config = {
      duration: options?.rectOptions?.duration ?? options?.duration ?? 5,
      fill: options?.rectOptions?.fill ?? options?.fill ?? "",
      stroke: options?.rectOptions?.stroke ?? options?.stroke ?? "#333",
      count: options?.rectOptions?.count ?? options?.count ?? "infinite",
      strokeWidth:
        options?.rectOptions?.strokeWidth ?? options?.strokeWidth ?? 1,
      renderMode:
        options?.rectOptions?.renderMode ??
        (options?.renderMode as any) ??
        "grow",
      delay: options?.rectOptions?.delay ?? options?.delay ?? 0,
      easing: options?.rectOptions?.easing ?? options?.easing ?? "linear",
      reverse: options?.rectOptions?.reverse ?? options?.reverse ?? false,
      onComplete: options?.onComplete,
    };

    applyRectAnimation(element as SVGRectElement, config);
  } else {
    const config = {
      duration: options?.pathOptions?.duration ?? options?.duration ?? 5,
      fill: options?.pathOptions?.fill ?? options?.fill ?? "",
      fillBase: options?.pathOptions?.fillBase ?? options?.fillBase,
      stroke: options?.pathOptions?.stroke ?? options?.stroke ?? "#333",
      count: options?.pathOptions?.count ?? options?.count ?? "infinite",
      strokeWidth:
        options?.pathOptions?.strokeWidth ?? options?.strokeWidth ?? 1,
      renderMode:
        options?.pathOptions?.renderMode ??
        (options?.renderMode as any) ??
        "outline",
      delay: options?.pathOptions?.delay ?? options?.delay ?? 0,
      easing: options?.pathOptions?.easing ?? options?.easing ?? "linear",
      reverse: options?.pathOptions?.reverse ?? options?.reverse ?? false,
      onComplete: options?.onComplete,
    };

    applyPathAnimation(element, config);
  }
}

// 矩形动画应用函数
function applyRectAnimation(
  rectElement: SVGRectElement,
  options: RectAnimateOptions
) {
  const {
    duration = 5,
    fill = "",
    stroke = "#333",
    count = "infinite",
    strokeWidth = 1,
    renderMode = "grow",
    delay = 0,
    easing = "linear",
    reverse = false,
    onComplete,
  } = options;

  const bbox = rectElement.getBBox();
  const width = bbox.width;
  const height = bbox.height;
  const id = Math.random().toString(36).substring(2, 10);
  const animationDirection = reverse ? "reverse" : "normal";

  let initialStyles: Record<string, any> = {
    fill,
    stroke,
    strokeWidth,
  };

  switch (renderMode) {
    case "grow":
      initialStyles = {
        fill,
        stroke,
        strokeWidth,
        transform: "scale(0)",
        transformOrigin: "center",
        animation: `rect-animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;

    case "fade-in":
      initialStyles = {
        fill,
        stroke,
        strokeWidth,
        opacity: 0,
        animation: `rect-animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;

    case "outline":
      const perimeter = 2 * (width + height);
      initialStyles = {
        fill: "none",
        stroke,
        strokeWidth,
        strokeDasharray: perimeter,
        strokeDashoffset: perimeter,
        animation: `rect-animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;
  }

  setStyle(rectElement, initialStyles);
  insertKeyframes(
    createAnimationKeyframes(renderMode, 2 * (width + height), id)
  );
  addAnimationEndListener(rectElement, onComplete);
}

// 路径动画应用函数
function applyPathAnimation(
  pathElement: SVGElement,
  options: PathAnimateOptions
) {
  const {
    duration = 5,
    fill = "",
    fillBase,
    stroke = "#333",
    count = "infinite",
    strokeWidth = 1,
    renderMode = "outline",
    delay = 0,
    easing = "linear",
    reverse = false,
    onComplete,
  } = options;

  // 计算路径长度
  let pathLength = 0;

  if (typeof (pathElement as any).getTotalLength === "function") {
    try {
      pathLength = (pathElement as any).getTotalLength();
    } catch (e) {
      const bbox = (pathElement as SVGGraphicsElement).getBBox();
      pathLength = 2 * (bbox.width + bbox.height);
    }
  } else {
    const bbox = (pathElement as SVGGraphicsElement).getBBox();
    pathLength = 2 * (bbox.width + bbox.height);
  }

  if (pathLength <= 0) pathLength = 1;

  const id = Math.random().toString(36).substring(2, 10);
  const fillBaseVal = getElementFillColor(pathElement, "#333", fillBase);
  const strokeBaseVal = getElementStrokeColor(pathElement, stroke);
  const animationDirection = reverse ? "reverse" : "normal";

  let initialStyles: Record<string, any> = {};

  switch (renderMode) {
    case "outline":
      initialStyles = {
        fill: "none",
        stroke: strokeBaseVal,
        strokeWidth,
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        animation: `animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;

    case "fill":
      initialStyles = {
        fill: fill || fillBaseVal,
        fillOpacity: 0,
        stroke:
          stroke || (fillBaseVal === "none" ? strokeBaseVal : fillBaseVal),
        strokeWidth,
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        animation: `animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;

    case "mixed":
      initialStyles = {
        fill: fillBaseVal,
        fillOpacity: 0,
        stroke: strokeBaseVal,
        strokeWidth,
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        animation: `animation${id} ${duration}s ${easing} ${delay}s ${count} ${animationDirection} forwards`,
      };
      break;
  }

  setStyle(pathElement, initialStyles);
  insertKeyframes(createAnimationKeyframes(renderMode, pathLength, id));
  addAnimationEndListener(pathElement, onComplete);
}

export function setSvgAnimation(
  svgElement: SVGSVGElement | HTMLElement | null | undefined,
  options?: AnimateOptions
) {
  if (!svgElement) return;

  const pathElements = svgElement.querySelectorAll(
    "path, line, polyline, polygon, rect, circle, ellipse"
  );

  Array.from(pathElements).forEach((element, index) => {
    if (!(element instanceof SVGElement)) return;

    const elementOptions = { ...options };
    elementOptions.delay = (options?.delay ?? 0) + index * 0.1;
    setPathAnimation(element, elementOptions);
  });
}

export function controlSvgAnimation(
  svgElement: SVGElement | HTMLElement | null | undefined,
  action: "play" | "pause" | "reset"
): void {
  if (!svgElement) return;

  const elements = svgElement.querySelectorAll(
    "path, line, polyline, polygon, rect, circle, ellipse"
  );

  elements.forEach((el) => {
    if (!(el instanceof SVGElement)) return;

    switch (action) {
      case "play":
        el.style.animationPlayState = "running";
        break;
      case "pause":
        el.style.animationPlayState = "paused";
        break;
      case "reset":
        const currentAnimation = el.style.animation;
        el.style.animation = "none";
        setTimeout(() => (el.style.animation = currentAnimation), 10);
        break;
    }
  });
}

export default setSvgAnimation;
