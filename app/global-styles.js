import { injectGlobal } from 'styled-components';

import proximaNova from './assets/fonts/ProximaNova-Regular.otf';
import proximaNovaBold from './assets/fonts/ProximaNova-Bold.otf';
import proximaNovaLight from './assets/fonts/ProximaNova-Light.otf';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  @font-face {
    font-family: proximaNova;
    src: url(${proximaNova}) format('opentype');
    font-weight: 400;
    font-style: normal;
   }

   @font-face {
    font-family: proximaNova;
    src: url(${proximaNovaLight}) format('opentype');
    font-weight: 300;
    font-style: normal;
   }

  @font-face {
    font-family: proximaNova;
    src: url(${proximaNovaBold}) format('opentype');
    font-weight: 700;
    font-style: normal;
   }

  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: proximaNova, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;
