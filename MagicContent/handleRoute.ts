const handleRoute = `
  window.addEventListener("message", event => {
    if (event.data) {
      let parsedEvent = JSON.parse(event.data);
      if (parsedEvent.type === 'route') {
        window.location.href = route;
      }
    }
  });
`;

export default handleRoute;
