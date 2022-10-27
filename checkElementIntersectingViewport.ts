/** Check element nằm trong viewport hay không */
export const checkElementIntersectingViewport = (container: Element) => {
  const rect = container.getBoundingClientRect();
  return rect.top + rect.height >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight);
};
