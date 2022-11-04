import { useEffect, useRef } from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import handleAnchorElement from './handleAnchorElement';
import handleScrollTop from './handleScrollTop';
import handleRoute from './handleRoute';

const useWebViewLoadEnd = (baseUrl: string, javascript: string, isScrollTop: boolean, route: string) => {
  const webViewRef = useRef<WebView<WebViewProps>>(null);

  const handleLoadEnd = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        ${javascript}
        ${handleAnchorElement(baseUrl)}
        ${handleScrollTop}
        ${handleRoute}
      `);
    }
  };

  useEffect(() => {
    if (isScrollTop) {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'scrolltop' }));
    }
  }, [isScrollTop]);

  useEffect(() => {
    if (route) {
      webViewRef.current?.postMessage(JSON.stringify({ type: 'route', route }));
    }
  }, [route]);

  return {
    webViewRef,
    onLoadEnd: handleLoadEnd,
  };
};

export default useWebViewLoadEnd;
