/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import {
  selectActiveNonVoiceInteractions,
  selectActiveVoiceInteraction,
  selectShowCurrentCrmItemHistoryButton,
} from '../selectors';

describe('selectActiveNonVoiceInteractions', () => {
  describe('voice interactions', () => {
    let mockedState;
    beforeEach(() => {
      mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'voice',
              status: 'work-ended-pending-script',
            },
            {
              channelType: 'voice',
              status: 'work-accepted',
            },
          ],
        },
      });
    });
    it('select with status of work-ended-pending-script', () => {
      expect(selectActiveNonVoiceInteractions(mockedState)).toMatchSnapshot();
    });
  });

  describe('non voice interactions', () => {
    let mockedState;
    beforeEach(() => {
      mockedState = fromJS({
        agentDesktop: {
          interactions: [
            // Selected:
            {
              status: 'work-accepting',
            },
            {
              status: 'work-accepted',
            },
            {
              status: 'wrapup',
            },
            {
              status: 'work-ended-pending-script',
            },
            {
              status: 'creating-new-interaction',
            },
            {
              status: 'connecting-to-outbound',
            },
            {
              status: 'initializing-outbound',
            },
            {
              status: 'initialized-outbound',
            },
            {
              isScriptOnly: true,
            },
            // Filtered:
            {
              status: 'non-active-status',
            },
            {
              isScriptOnly: false,
            },
          ],
        },
      });
    });
    it('select "active" statuses', () => {
      expect(selectActiveNonVoiceInteractions(mockedState)).toMatchSnapshot();
    });
  });

  describe('non voice interactions and voice interactions', () => {
    let mockedState;
    beforeEach(() => {
      mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'sms',
              status: 'work-accepted',
            },
            {
              channelType: 'voice',
              status: 'work-ended-pending-script',
            },
          ],
        },
      });
    });
    it('puts voice interactions at beginning of list', () => {
      expect(selectActiveNonVoiceInteractions(mockedState)).toMatchSnapshot();
    });
  });
});

describe('selectActiveVoiceInteraction', () => {
  describe('active voice interactions', () => {
    describe('work-accepting', () => {
      const mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'voice',
              status: 'work-accepting',
            },
          ],
        },
      });
      it('selects', () => {
        expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
      });
    });

    describe('work-accepted', () => {
      const mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'voice',
              status: 'work-accepted',
            },
          ],
        },
      });
      it('selects', () => {
        expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
      });
    });

    describe('wrapup', () => {
      const mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'voice',
              status: 'wrapup',
            },
          ],
        },
      });
      it('selects', () => {
        expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
      });
    });
  });

  describe('non active voice interactions', () => {
    let mockedState;
    beforeEach(() => {
      mockedState = fromJS({
        agentDesktop: {
          interactions: [
            {
              channelType: 'voice',
              status: 'non-active-status',
            },
            {
              status: 'work-accepted',
            },
          ],
        },
      });
    });
    it("doesn't select", () => {
      expect(selectActiveVoiceInteraction(mockedState)).toEqual(undefined);
    });
  });
});

describe('selectShowCurrentCrmItemHistoryButton', () => {
  let mockedState;
  beforeEach(() => {
    mockedState = fromJS({
      agentDesktop: {
        interactions: [
          {
            interactionId: 'test-interaction-id',
          },
        ],
        crmActiveTab: { contact: { id: 123, type: 'user' } },
        crmModule: 'zendesk',
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
  it('not shown when no crmActiveTab', () => {
    mockedState = mockedState.deleteIn(['agentDesktop', 'crmActiveTab']);
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
