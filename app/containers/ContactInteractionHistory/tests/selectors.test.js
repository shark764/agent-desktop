/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { selectContact } from '../selectors';

let mockedState;

describe('selectContact', () => {
  beforeEach(() => {
    mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'test-interaction-id',
            contact: { id: 'interaction-contact-id' },
          },
        ],
        zendeskActiveTab: { contact: { id: 'zendeskActiveTab-contact-id' } },
        selectedInteractionId: 'test-interaction-id',
        currentCrmItemHistoryPanel: {
          interactionId: 'current-crm-item-history',
        },
        newInteractionPanel: {},
        noInteractionContactPanel: {},
      },
    });
  });
  it('selects the contact of the selected interaction', () => {
    expect(selectContact(mockedState).id).toEqual('interaction-contact-id');
  });
  it('selects zendeskActiveTab when ', () => {
    mockedState = mockedState.setIn(
      ['agentDesktop', 'selectedInteractionId'],
      'current-crm-item-history'
    );
    expect(selectContact(mockedState).id).toEqual(
      'zendeskActiveTab-contact-id'
    );
  });
});
