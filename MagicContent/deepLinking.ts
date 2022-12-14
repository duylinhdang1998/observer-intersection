import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

const searcher = (str: string) => (s: string | RegExp) => str.search(s) !== -1;

const replacer = (str: string) => str.replace(/(\/|\?.*)$/g, '').replace(/^.*\//g, '');

const checkYoutubeTypeAccount = (url: string) => (searcher(url)('/user/') ? 'user' : 'chanel');

function getUrl(url: string) {
  if (searcher(url)('instagram.com')) {
    return {
      ios: `instagram://user?username=${replacer(url)}`,
      android: `intent://instagram.com/_u/${replacer(url)}/#Intent;package=com.instagram.android;scheme=https;end`,
      browser: url,
    };
  } else if (searcher(url)('plus.google.com')) {
    return {
      ios: `gplus://plus.google.com/u/0/${replacer(url)}`,
      android: `gplus://plus.google.com/u/0/${replacer(url)}`,
      browser: url,
    };
  } else if (searcher(url)(/fb:\/\/|facebook.com/g)) {
    return {
      ios: url,
      android: `intent://#Intent;package=com.facebook.katana;scheme=${url};end`,
      browser: !searcher(url)('fb://') ? url : `https://www.facebook.com/${url.replace(/fb:\/\/(profile|page|group)\/(\?id=|)/g, '')}`,
    };
  } else if (searcher(url)('twitter.com')) {
    return {
      ios: `twitter://user?screen_name=${replacer(url)}`,
      android: `intent://twitter.com/${replacer(url)}#Intent;package=com.twitter.android;scheme=https;end`,
      browser: url,
    };
  } else if (searcher(url)('youtube.com')) {
    return {
      ios: `vnd.youtube://www.youtube.com/${checkYoutubeTypeAccount(url)}/${replacer(url)}`,
      android: `intent://www.youtube.com/${checkYoutubeTypeAccount(url)}/${replacer(url)}#Intent;package=com.google.android.youtube;scheme=https;end`,
      browser: url,
    };
  } else if (searcher(url)('pinterest.com')) {
    return {
      ios: `pinterest://user/${replacer(url)}`,
      android: `pinterest://www.pinterest.com/${replacer(url)}`,
      browser: url,
    };
  } else {
    return {
      ios: url,
      android: url,
      browser: url,
    };
  }
}

async function socialLinking(url: string) {
  return Linking.openURL(Platform.OS === 'ios' ? getUrl(url).ios : getUrl(url).android).catch(_ => {
    WebBrowser.openBrowserAsync(getUrl(url).browser);
  });
}

async function deepLinking(url: string) {
  if (searcher(url)('facebook.com')) {
    try {
      const { data } = await axios.get(url);
      const metaPropertyIos = data.replace(/\/>/g, '/>\n').match(/<meta property="al:ios:url".*\/>/g)[0];
      const metaPropertyAndroid = data.replace(/\/>/g, '/>\n').match(/<meta property="al:android:url".*\/>/g)[0];
      const metaPropertyContent = (Platform.OS === 'ios' ? metaPropertyIos : metaPropertyAndroid)
        .match(/content.*(?=")/g)[0]
        .replace(/content="/g, '');
      socialLinking(metaPropertyContent);
    } catch (err) {
      socialLinking(url);
    }
  } else {
    socialLinking(url);
  }
}

export default deepLinking;
