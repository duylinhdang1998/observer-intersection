import { GetOptional } from '../../@types';
import { Props } from './types';

export const defaultProps: Required<GetOptional<Props>> = {
  offsetTop: -100,
  offsetBottom: 0,
  numberOfRuns: Infinity,
  nativeProps: {},
  onEnterViewport: () => {},
  onLeaveViewport: () => {},
};
