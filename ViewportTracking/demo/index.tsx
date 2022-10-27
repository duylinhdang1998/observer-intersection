import { ViewportTracking } from '../ViewportTracking';

export const Demo = () => {
  return (
    <div>
      <h1>ViewportTracking demo</h1>
      <ViewportTracking
        offsetTop={-300}
        children={(inViewport) => {
          return <div data-value={inViewport}>{inViewport}</div>;
        }}
      />
    </div>
  );
};
