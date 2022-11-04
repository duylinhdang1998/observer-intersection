const handleAnchorElement = (baseUrl: string) => `
const anchorClicks = [];

const getAttributes = el => {
  return el.getAttributeNames().reduce((obj, name) => ({
    ...obj,
    [name]: el.getAttribute(name)
  }), {});
}

if (!window.getEventListeners) {
  window.getEventListeners = () => []
}

const handleTouch = event => {
  const anchorEl = event.target.tagName === 'A' ? event.target : event.target.closest('a');
  const isAnchorListenerEmpty = !window.getEventListeners(anchorEl, 'click').length;
  const isMyListener = !isAnchorListenerEmpty && window.getEventListeners(anchorEl, 'click') && window.getEventListeners(anchorEl, 'click')[0] && window.getEventListeners(anchorEl, 'click')[0].listener && window.getEventListeners(anchorEl, 'click')[0].listener.toString() && window.getEventListeners(anchorEl, 'click')[0].listener.toString().includes('!!anchorEl.href &&');

  if (!anchorClicks.includes(anchorEl) && (isAnchorListenerEmpty || isMyListener)) {
    event.preventDefault();
    anchorEl.removeAttribute('target');
    anchorEl.removeAttribute('onclick');
    anchorEl.addEventListener('click', event => {
      event.preventDefault();

      const condition = !!anchorEl.href && !/^#/.test(anchorEl.getAttribute('href')) && !!/^http/.test(anchorEl.href) && !/\\.(jpe?g|png|svg|webp)$/.test(anchorEl.href) && !/remove|add|delete|(\s|-|)open(\s|-)|close|toggle/.test(JSON.stringify(getAttributes(anchorEl)));

      if (condition) {
        let type = 'navigate';
        const regex = new RegExp('^${baseUrl}', 'g');
        if (/^http/.test(anchorEl.href) && !regex.test(anchorEl.href)) {
          type = 'browser';
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload: { url: anchorEl.href } }));
      }
    }, false);
    anchorClicks.push(anchorEl);
  }
}
document.addEventListener('touchstart', handleTouch);
`;

export default handleAnchorElement;
