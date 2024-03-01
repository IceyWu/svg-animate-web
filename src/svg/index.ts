/**
 * @param target 目标元素
 * @param styles 样式
 * @return void
 * @description 设置元素样式
 */
export function setStyle(target: any, styles: any) {
  for (const k in styles)
    target.style[k] = styles[k]
}
export function getAllPath(svgDom: any) {
  const path = svgDom.querySelectorAll('path')
  return path
}
/**
 * @param pathElement 目标元素b
 * @param options 动画配置
 * @return void
 * @description 设置svg动画
 */
export function setSvgAnimation(svgElement: any, options: any) {
  const pathElements = getAllPath(svgElement)
  for (let i = 0; i < pathElements.length; i++) {
    setPathAnimation(pathElements[i], {});
  }
  
}
export function setPathAnimation(pathElement: any, options: any) {
  const maxPath = pathElement.getTotalLength()
  const j = Math.random().toString(36).substr(2, 8)
  const fill = pathElement.getAttribute('fill')
  const path = {
    fill: 'none',
    animation: `animation${j} 5s linear 3 forwards`,
  }
  setStyle(pathElement, path)
  document.styleSheets[0].insertRule(
    `
    @keyframes animation${j} {
    0% {
      fill: white;
      stroke: #333;
      stroke-dasharray: ${maxPath};
      stroke-dashoffset: ${maxPath};
    }
    50% {
      fill: white;
      stroke: #333;
      stroke-dasharray: ${maxPath};
      stroke-dashoffset: 0;
    }
    100% {
      fill: ${fill};
      stroke: ${fill};
    }
    }
  `,
  )
}
export default setPathAnimation
