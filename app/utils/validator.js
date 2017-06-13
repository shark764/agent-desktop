/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function isValidNumber(number) {
  let validNumber;
  try {
    validNumber = phoneNumberUtil.isValidNumber(phoneNumberUtil.parse(number, 'E164'));
  } catch (e) {
    // This just means it is invalid
    validNumber = false;
  }
  return validNumber;
}

export function isValidEmail(email) {
  return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email);
}
