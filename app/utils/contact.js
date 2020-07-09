/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { isValidEmail, isPossibleNumber } from 'utils/validator';
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
    attributeToValidate.type !== 'boolean' &&
    (value === undefined || value.trim().length < 1)
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
          if (!isPossibleNumber(value)) {
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
        if (Number.isNaN(Number(value))) {
          error = 'errorNumber';
        }
        break;
      default:
        break;
    }
  }
  return error;
};

export const getLocaleLabel = (attribute, locale) => {
  if (attribute.label[locale] !== undefined) {
    return attribute.label[locale];
  } else if (attribute.label.all !== undefined) {
    // Special case for 'All'. We have our own local translation for it we use.
    return attribute.label.all;
  } else if (attribute.objectName !== undefined) {
    // Fallback for attributes
    return attribute.objectName;
  } else {
    // Fallback for section headers
    return '';
  }
};

export function createSearchQuery(query, nextPage) {
  const encodedQuery = {};
  Object.keys(query).forEach(queryName => {
    const queryToEncode = query[queryName];
    encodedQuery[queryName] = encodeURIComponent(queryToEncode);
  });
  return {
    query: Object.assign(encodedQuery, {
      page: nextPage !== undefined ? nextPage : 1,
    }),
  };
}
