import { useRef, useState } from 'react';
import { WebViewMessageEvent } from 'react-native-webview';
import { NavigationStackProp } from 'react-navigation-stack';
import deepLinking from './deepLinking';

const useWebViewMessage = <T extends string>(navigation: NavigationStackProp, screenName: T, stringParams = '') => {
  const [title, setTitle] = useState('');
  const waitRef = useRef(false);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const { payload, type } = JSON.parse(event.nativeEvent.data);
    switch (type) {
      case 'mounted': {
        setTitle(payload.title);
        break;
      }
      case 'browser': {
        deepLinking(payload.url);
        break;
      }
      case 'navigate': {
        if (!waitRef.current) {
          waitRef.current = true;
          navigation.push(screenName, {
            url: `${payload.url}${!!stringParams ? (payload.url.includes('?') ? '&' : '?') : ''}${stringParams}`,
          });
          setTimeout(() => {
            waitRef.current = false;
          }, 1000);
        }
        break;
      }
      default:
        break;
    }
  };
  return {
    title,
    onMessage: handleMessage,
  };
};

export default useWebViewMessage;
