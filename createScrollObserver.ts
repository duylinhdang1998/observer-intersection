interface Listener {
  (): void;
}

const defaultConfig: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
};

/** Tạo event scroll */
export const createIntersectionObserver = (config: IntersectionObserverInit = defaultConfig) => {
  let _intersectionObserver: IntersectionObserver;

  const _addListener = (listener: Listener, target: Element | null) => {
    if (!!window.IntersectionObserver && target) {
      _intersectionObserver = new IntersectionObserver(listener, config);
      _intersectionObserver.observe(target);
    } else {
      listener();
      window.addEventListener('scroll', listener);
    }
  };

  const _removeListener = (listener: Listener) => {
    if (!!window.IntersectionObserver && !!_intersectionObserver) {
      _intersectionObserver.disconnect();
    } else {
      window.removeEventListener('scroll', listener);
    }
  };

  return {
    addListener: _addListener,
    removeListener: _removeListener,
  };
};
