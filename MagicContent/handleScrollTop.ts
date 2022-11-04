const handleScrollTop = `
  let requestAnimationFrameId;

  const handleScrollTop = () => {
    const st = document.documentElement && document.body
      ? document.documentElement.scrollTop || document.body.scrollTop
      : 0;
    if (st > 0) {
      requestAnimationFrameId = window.requestAnimationFrame(handleScrollTop);
      window.scrollTo(0, st - st / 5);
    } else {
      window.cancelAnimationFrame(requestAnimationFrameId);
    }
  }

  window.addEventListener("message", event => {
    if (event.data) {
      let parsedEvent = JSON.parse(event.data);
      if (parsedEvent.type === 'scrolltop') {
        handleScrollTop();
      }
    }
  });
`;

export default handleScrollTop;
