import React, { useState } from 'react';
import { WebView, WebViewMessageEvent, WebViewProps } from 'react-native-webview';
import { withNavigation } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { WebViewErrorEvent, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { View } from '../View/View';
import { NavigationSuspense } from '../NavigationSuspense/NavigationSuspense';
import useWebViewLoadEnd from './useWebViewLoadEnd';
import useWebViewMessage from './useWebViewMessage';
import webviewCss from './webviewCss';

type OmitWebViewProps = Omit<
  WebViewProps,
  'decelerationRate' | 'ref' | 'source' | 'style' | 'originWhitelist' | 'javaScriptEnabled' | 'injectedJavaScript'
>;

export interface MagicContentProps<T extends string> extends OmitWebViewProps {
  navigation: NavigationStackProp;
  baseUrl: string;
  url: string;
  screenName: T;
  stringParams?: string;
  css?: string;
  javascript?: string;
  isScrollTop?: boolean;
  route?: string;
}

const MagicContentComponent = <T extends string>({
  navigation,
  baseUrl,
  url,
  screenName,
  stringParams = '',
  css = '',
  javascript = '',
  renderLoading = () => <ActivityIndicator size="small" />,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  pullToRefreshEnabled = true,
  allowsFullscreenVideo = true,
  sharedCookiesEnabled = true,
  isScrollTop = false,
  route = '',
  ...rest
}: MagicContentProps<T>) => {
  const [loading, setLoading] = useState(false);
  const { onMessage } = useWebViewMessage(navigation, screenName, stringParams);
  const { onLoadEnd, webViewRef } = useWebViewLoadEnd(baseUrl, javascript, isScrollTop, route);
  const _css = webviewCss + css;

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = (event: WebViewNavigationEvent | WebViewErrorEvent) => {
    setLoading(false);
    onLoadEnd();
    rest.onLoadEnd?.(event);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    onMessage(event);
    rest.onMessage?.(event);
  };

  return (
    <View flex tachyons="relative">
      {loading && (
        <View
          style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
          tachyons={['absolute', 'absoluteFill', 'z5', 'flex', 'justifyCenter', 'itemsCenter']}
        >
          {renderLoading()}
        </View>
      )}
      <NavigationSuspense>
        <WebView
          {...rest}
          decelerationRate="normal"
          ref={webViewRef}
          source={{ uri: url }}
          style={{
            width: '100%',
            height: '100%',
          }}
          originWhitelist={['*']}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          javaScriptEnabled
          pullToRefreshEnabled={pullToRefreshEnabled}
          allowsFullscreenVideo={allowsFullscreenVideo}
          sharedCookiesEnabled={sharedCookiesEnabled}
          injectedJavaScript={`
            document.head.insertAdjacentHTML('beforeend', '<style>${_css.replace(/\n/g, '').replace(/\s+/g, ' ')}</style>');
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mounted', payload: { title: document.title } }));
          `}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onMessage={handleMessage}
        />
      </NavigationSuspense>
    </View>
  );
};

export const MagicContent = withNavigation(MagicContentComponent);
