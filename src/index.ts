export interface AnimateOptions {
  duration?: number;
  fill?: string;
  fillBase?: string;
  stroke?: string;
  count?: string | number | undefined;
  strokeWidth?: number | undefined;
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
    fill = "#fff",
    stroke = "#333",
    count = "infinite",
    strokeWidth = 1,
    fillBase,
  } = options || ({} as AnimateOptions);
  const maxPath = pathElement.getTotalLength();
  const j = Math.random().toString(36).substr(2, 8);
  const fillBaseVal = fillBase || pathElement.getAttribute("fill");
  const path = {
    fill: "none",
    animation: `animation${j} ${duration}s linear ${count} forwards`,
    stroke: fillBase,
    strokeWidth,
  };
  setStyle(pathElement, path);
  document.styleSheets[0].insertRule(
    `
      @keyframes animation${j} {
      0% {
        fill: ${fill};
        stroke: ${stroke};
        stroke-dasharray: ${maxPath};
        stroke-dashoffset: ${maxPath};
      }
      50% {
        fill: ${fill};
        stroke: ${stroke};
        stroke-dasharray: ${maxPath};
        stroke-dashoffset: 0;
      }
      100% {
        fill: ${fillBaseVal};
        stroke: ${fillBaseVal};
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
  for (let i = 0; i < pathElements.length; i++)
    setPathAnimation(pathElements[i], options);
}
export default setSvgAnimation;
