import { CSSProperties } from 'react';
import { Props } from './types';

export const container: CSSProperties = {
  position: 'relative',
};

export const tracking = ({ offsetBottom, offsetTop }: Pick<Props, 'offsetTop' | 'offsetBottom'>): CSSProperties => ({
  position: 'absolute',
  width: '100%',
  zIndex: '-99999',
  top: offsetTop,
  bottom: offsetBottom,
});
