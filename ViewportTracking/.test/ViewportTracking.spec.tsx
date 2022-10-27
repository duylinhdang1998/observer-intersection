import { render } from '@testing-library/react';
import { ViewportTracking } from '..';
import { checkElementIntersectingViewport } from '../../../utils';

test('ViewportTracking', async () => {
  const { container } = render(
    <div id="tracking">
      <ViewportTracking
        children={(inViewport) => {
          return (
            <div id="target" data-value={inViewport}>
              {inViewport}
            </div>
          );
        }}
      />
    </div>,
  );

  const $trackingEl = container.querySelector('#tracking');
  const value = JSON.parse(container.querySelector('#target').getAttribute('data-value'));
  const expectValue = checkElementIntersectingViewport($trackingEl);

  expect(value).toBe(expectValue);
});
