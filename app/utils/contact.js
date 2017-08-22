/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { isValidEmail, isValidNumber } from 'utils/validator';
import isURL from 'validator/lib/isURL';

export const formatValue = (attributeToValidate, value) => {
  let formattedValue;
  switch (attributeToValidate.type) {
    case 'phone':
      formattedValue = value.replace(/[^0-9+*#]/g, '');
      if (formattedValue.indexOf('+') !== 0 && formattedValue.length > 0) {
        formattedValue = `+${formattedValue}`;
      }
      break;
    case 'boolean':
      if (value === 'false' || value === '') formattedValue = false;
      else formattedValue = !!value;
      break;
    default:
      formattedValue = value;
  }
  return formattedValue;
};

export const getError = (attributeToValidate, value) => {
  let error = false;
  if (
    attributeToValidate.mandatory &&
    (value === undefined || value.length < 1)
  ) {
    error = 'errorRequired';
  } else if (value !== undefined && value.length) {
    switch (attributeToValidate.type) {
      case 'email':
        if (!isValidEmail(value)) {
          error = 'errorEmail';
        }
        break;
      case 'phone':
        try {
          if (!isValidNumber(value)) {
            error = 'errorPhone';
          }
        } catch (e) {
          error = 'errorPhone';
        }
        break;
      case 'link':
        if (
          !isURL(value, {
            protocols: ['http', 'https'],
            require_protocol: true,
          })
        ) {
          error = 'errorLink';
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          error = 'errorNumber';
        }
        break;
      default:
        break;
    }
  }
  return error;
};
