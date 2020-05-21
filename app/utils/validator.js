/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function isValidNumber(number) {
  let validNumber;
  try {
    validNumber = phoneNumberUtil.isValidNumber(
      phoneNumberUtil.parse(number, 'E164')
    );
  } catch (e) {
    // This just means it is invalid
    validNumber = false;
  }
  return validNumber;
}

export function isPossibleNumber(number) {
  let possibleNumber;
  try {
    possibleNumber = phoneNumberUtil.isPossibleNumber(
      phoneNumberUtil.parse(number, 'E164')
    );
  } catch (e) {
    // This just means it is invalid
    possibleNumber = false;
  }
  return possibleNumber;
}

export function isValidEmail(email) {
  return /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
    email
  );
}

export function isUUID(uuid) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    uuid
  );
}

export function sortOrder(v1, v2) {
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  const tempArray = [v1.name, v2.name];
  tempArray.sort(collator.compare);

  if (tempArray[0] === v1.name) {
    return -1;
  } else {
    return 1;
  }
}
