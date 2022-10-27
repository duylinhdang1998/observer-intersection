import { HTMLAttributes, ReactNode } from 'react';

type ChildrenFn = (inViewport: boolean) => ReactNode;

export interface Props {
  /** #### `onEnterViewport` sẽ hoạt động trước hoặc sau khi chạm top component tuỳ thuộc vào chỉ số `offsetTop`. Mặc định là `0` */
  offsetTop?: number;
  /** #### `onEnterViewport` sẽ hoạt động trước hoặc sau khi chạm bottom component tuỳ thuộc vào chỉ số `offsetBottom`. Mặc định là `0` */
  offsetBottom?: number;
  /** #### Số lần component chạy lại và khởi động 2 sự kiện `onEnterViewport` và `onLeaveViewport` */
  numberOfRuns?: number;
  /** #### Sự kiện được gọi khi component nằm trong màn hình */
  onEnterViewport?: () => void;
  /** #### Sự kiện được gọi khi component nằm ngoài màn hình */
  onLeaveViewport?: () => void;
  /** #### Children có thể là ReactNode và cũng có thể là 1 hàm callback có inViewport và return ra ReactNode */
  children: ReactNode | ChildrenFn;
  /** ####  */
  nativeProps?: HTMLAttributes<HTMLDivElement>;
}
