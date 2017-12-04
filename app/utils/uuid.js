/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

// https://gist.github.com/jed/982883
// https://stackoverflow.com/a/2117523
/* eslint-disable no-bitwise */
export const generateUUID = (a, b) =>
  a
    ? (b | ((Math.random() * 16) >> (b / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0|(8)/g, generateUUID);
