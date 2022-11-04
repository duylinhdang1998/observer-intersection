import { bottomBarHeight } from 'utils/constants/base';

const webviewCss = `
  * {
    user-select: none !important;
  }
  body {
    padding-bottom: ${bottomBarHeight}px;
  }
  html {
    margin-top: 0 !important;
  }
  .wil-header-wrap, [class^="wil-footer"] {
    display: none;
  }
  #shopify-section-header,
  #shopify-section-footer,
  #header,
  #footer {
    display: none !important;
  }
`;

export default webviewCss;
