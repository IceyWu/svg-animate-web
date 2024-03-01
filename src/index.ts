export interface AnimateOptions {
  duration?: number;
  fillColor?: string;
  strokeColor?: string;
  count?: string | number | undefined;
}

/**
 * @param target 目标元素
 * @param styles 样式
 * @return void
 * @description 设置元素样式
 */
export function setStyle(target: any, styles: any) {
  for (const k in styles) target.style[k] = styles[k];
}
export function getAllPath(svgDom: any) {
  const path = svgDom.querySelectorAll("path");
  return path;
}
/**
 * @param pathElement 目标元素b
 * @param options 动画配置
 * @return void
 * @description 设置svg动画
 */
export function setPathAnimation(pathElement: any, options?: AnimateOptions) {
  const {
    duration = "5",
    fillColor = "#fff",
    strokeColor = "#333",
    count = "infinite",
  } = options as AnimateOptions;
  const maxPath = pathElement.getTotalLength();
  const j = Math.random().toString(36).substr(2, 8);
  const fill = pathElement.getAttribute("fill");
  const path = {
    fill: "none",
    animation: `animation${j} ${duration}s linear ${count} forwards`,
  };
  setStyle(pathElement, path);
  document.styleSheets[0].insertRule(
    `
      @keyframes animation${j} {
      0% {
        fill: ${fillColor};
        stroke: ${strokeColor};
        stroke-dasharray: ${maxPath};
        stroke-dashoffset: ${maxPath};
      }
      50% {
        fill: ${fillColor};
        stroke: ${strokeColor};
        stroke-dasharray: ${maxPath};
        stroke-dashoffset: 0;
      }
      100% {
        fill: ${fill};
        stroke: ${fill};
      }
      }
    `
  );
}

export function setSvgAnimation(
  svgElement: HTMLElement | undefined,
  options?: AnimateOptions
) {
  const pathElements = getAllPath(svgElement);
  for (let i = 0; i < pathElements.length; i++) {
    setPathAnimation(pathElements[i], options);
  }
}
export default setSvgAnimation;
