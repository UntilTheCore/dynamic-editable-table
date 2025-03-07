function findAndFocusInput(element) {
  // 检查当前元素是否为 input 元素
  if (element.tagName === 'INPUT') {
    element.focus();
    return true;
  }

  // 遍历当前元素的子节点
  const children = element.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (findAndFocusInput(child)) {
      return true;
    }
  }

  return false;
}

/**
 * @param {HTMLElement} el
 * @param bind
 * @constructor
 */
const DFocus = {
  name: "focus",
  directive: (el, bind) => {
    findAndFocusInput(el);
  }
}

/**
 */
export function registerDirective(app) {
  app.directive(DFocus.name, DFocus.directive);
}


