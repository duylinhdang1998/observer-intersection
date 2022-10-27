import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { FC } from 'react';
import { checkElementIntersectingViewport, createIntersectionObserver } from '../../utils';
import { defaultProps } from './const';
import * as styles from './styles';
import { Props } from './types';

export const ViewportTracking: FC<Props> = ({
  children,
  offsetTop = defaultProps.offsetTop,
  offsetBottom = defaultProps.offsetBottom,
  numberOfRuns = defaultProps.numberOfRuns,
  onEnterViewport = defaultProps.onEnterViewport,
  onLeaveViewport = defaultProps.onLeaveViewport,
  nativeProps = defaultProps.nativeProps,
}) => {
  const [inViewport, setInViewport] = useState(false);
  const [enterStart, setEnterStart] = useState(false);
  const [leaveStart, setLeaveStart] = useState(false);
  const [enterCount, setEnterCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enterStart && enterCount < numberOfRuns) {
      onEnterViewport?.();
      setInViewport(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterStart, enterCount]);

  useEffect(() => {
    if (leaveStart && leaveCount < numberOfRuns) {
      onLeaveViewport?.();
      setInViewport(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveStart, leaveCount]);

  const _handleScroll = useCallback(() => {
    if (viewRef.current) {
      if (checkElementIntersectingViewport(viewRef.current)) {
        setEnterStart(true);
        setEnterCount((enterCount) => enterCount + 1);
      } else {
        setLeaveStart(true);
        setLeaveCount((leaveCount) => leaveCount + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const intersectionObserver = createIntersectionObserver();
    intersectionObserver.addListener(_handleScroll, viewRef.current);
    return () => intersectionObserver.removeListener(_handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div {...nativeProps} style={{ ...nativeProps.style, ...styles.container }}>
      {children instanceof Function ? children(inViewport) : children}
      <div ref={viewRef} style={styles.tracking({ offsetBottom, offsetTop })} />
    </div>
  );
};
