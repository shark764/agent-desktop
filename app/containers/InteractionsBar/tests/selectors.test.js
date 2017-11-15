/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { selectShowCurrentCrmItemHistoryButton } from '../selectors';

let mockedState;

describe('selectShowCurrentCrmItemHistoryButton', () => {
  beforeEach(() => {
    mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'test-interaction-id',
          },
        ],
        zendeskActiveTab: { id: 123, type: 'user' },
        selectedInteractionId: 'test-interaction-id',
        currentCrmItemHistoryPanel: {
          interactionId: 'current-crm-item-history',
        },
        newInteractionPanel: {},
        noInteractionContactPanel: {},
      },
    });
  });
  it('shows when interaction has no assigned contact', () => {
    expect(selectShowCurrentCrmItemHistoryButton(mockedState)).toEqual(true);
  });
  it('shows when interaction assigned contact is not active tab', () => {
    mockedState = mockedState.setIn(
      ['agentDesktop', 'interactions', 0, 'contact'],
      fromJS({ id: 123, type: 'ticket' })
    );
    expect(selectShowCurrentCrmItemHistoryButton(mockedState)).toEqual(true);
  });
  it('shows when interaction assigned contact is the same as the active tab', () => {
    mockedState = mockedState.setIn(
      ['agentDesktop', 'interactions', 0, 'contact'],
      fromJS({ id: 123, type: 'user' })
    );
    expect(selectShowCurrentCrmItemHistoryButton(mockedState)).toEqual(false);
  });
  it('not shown when no zendeskActiveTab', () => {
    mockedState = mockedState.deleteIn(['agentDesktop', 'zendeskActiveTab']);
    expect(selectShowCurrentCrmItemHistoryButton(mockedState)).toEqual(false);
  });
  it('not shown when selectedInteraction is current-crm-item-history', () => {
    mockedState = mockedState.setIn(
      ['agentDesktop', 'selectedInteractionId'],
      'current-crm-item-history'
    );
    expect(selectShowCurrentCrmItemHistoryButton(mockedState)).toEqual(false);
  });
});
