import { injectGlobal } from 'styled-components';
import WebFont from 'webfontloader';

// Load proxima-nova font-family from typekit servers
WebFont.load({
  typekit: {
    id: 'bqg8des',
  },
});

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body, textarea {
    font-family: proxima-nova, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }
`;
