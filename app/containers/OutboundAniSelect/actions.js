/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved. 
 */
import * as ACTIONS from './constants';

export function setOutboundIdentification(response) {
  return {
    type: ACTIONS.SET_OUTBOUND_IDENTIFICATION_LISTS,
    response,
  };
}

export function selectOutboundIdentification(response, valor) {
  return {
    type: ACTIONS.SELECT_OUTBOUND_IDENTIFICATION,
    response,
    valor,
  };
}

export function fetchOutboundIdentifierLists() {
  return {
    type: ACTIONS.FETCH_OUTBOUND_IDENTIFIER_LISTS,
  };
}
