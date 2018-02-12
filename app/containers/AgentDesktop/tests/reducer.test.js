/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';

import Message from 'models/Message/Message';
import ResponseMessage from 'models/Message/ResponseMessage';

import {
  SET_CRM_ACTIVE_TAB,
  SET_INTERACTION_STATUS,
  SET_ACTIVE_RESOURCES,
  SET_NEW_INTERACTION_PANEL_FORM_INPUT,
  START_OUTBOUND_INTERACTION,
  INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
  ADD_INTERACTION,
  WORK_INITIATED,
  SET_MESSAGE_HISTORY,
  UPDATE_MESSAGE_HISTORY_AGENT_NAME,
  ADD_MESSAGE,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  REMOVE_INTERACTION,
  REMOVE_INTERACTION_HARD,
  SET_ASSIGNED_CONTACT,
  UNASSIGN_CONTACT,
  DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
  DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
  TOGGLE_CUSTOM_FIELDS,
  UPDATE_CONTACT,
  REMOVE_CONTACT,
  UPDATE_RESOURCE_NAME,
  OPEN_NEW_INTERACTION_PANEL,
  CLOSE_NEW_INTERACTION_PANEL,
  CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  SAVE_MESSAGE_STATE,
  DISMISS_INTERACTION_NOTIFICATION,
} from '../constants';
import agentDesktopReducer from '../reducer';

describe('agentDesktopReducer', () => {
  // Override so snapshots stay the same
  Date.now = jest.fn(() => 0);
  Math.random = jest.fn(() => 0);

  it('returns the correct initial state', () => {
    expect(agentDesktopReducer(undefined, {})).toMatchSnapshot();
  });

  let action;
  let initialState;

  const runReducerAndExpectSnapshot = () => {
    expect(agentDesktopReducer(fromJS(initialState), action)).toMatchSnapshot();
  };

  describe('SET_CRM_ACTIVE_TAB', () => {
    beforeEach(() => {
      initialState = {};
      action = {
        type: SET_CRM_ACTIVE_TAB,
        id: 123,
        tabType: 'user',
        name: 'test-name',
      };
    });
    it('sets the zendeskActiveTab correctly', () => {
      runReducerAndExpectSnapshot();
    });
    describe('when the id and type match the already stored value', () => {
      beforeEach(() => {
        initialState.zendeskActiveTab = {
          id: 123,
          type: 'user',
          attributes: { name: 'previous-name' },
          interactionHistory: 'history stuff here',
        };
      });
      it('only updates the name', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_INTERACTION_STATUS', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        selectedInteractionId: undefined,
      };
      action = {
        type: SET_INTERACTION_STATUS,
        interactionId: 'test-interaction-id',
        newStatus: undefined,
      };
    });
    describe('if setting a new status', () => {
      beforeEach(() => {
        action.newStatus = 'new status';
      });
      describe('if there are multiple interactions', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'old status',
            },
            {
              interactionId: 'other-interaction-id',
              status: 'other-status-id',
            },
          ];
        });
        it("updates the correct interaction's status", () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('if there the interaction does not exist', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'other-interaction-id',
              status: 'other-status-id',
            },
          ];
        });
        it('makes no change', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('if accepting an interaction', () => {
      beforeEach(() => {
        action.newStatus = 'work-accepting';
      });
      describe('if no interaction is currently selected', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'work-offer',
            },
          ];
          initialState.selectedInteractionId = undefined;
        });
        it('selects the interaction', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('if interaction is "isScriptOnly"', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'work-offer',
              isScriptOnly: true,
              script: { id: 'mock-script-id' },
            },
          ];
          initialState.interactions[0].channelType = 'voice';
        });
        it('deletes "isScriptOnly"', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('if interaction is channel type voice', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'work-offer',
              channelType: 'voice',
            },
          ];
          action.response = {};
        });
        it('adds a timestamp for timeAccepted', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe("if setting an interaction's status to wrapup", () => {
      beforeEach(() => {
        action.newStatus = 'wrapup';
      });
      describe('if the interaction has wrapupDetails', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'work-accepted',
              timeout: -86400000,
              wrapupDetails: {
                wrapupTime: 30,
              },
            },
          ];
        });
        it('updates the timeout and sets wrapupStarted', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe("if interaction is of channelType 'voice' and action contains a response object", () => {
      beforeEach(() => {
        initialState.interactions = [
          {
            interactionId: 'test-interaction-id',
            status: 'status',
            channelType: 'voice',
          },
        ];
        action.response = {
          customerOnHold: true,
          recording: false,
        };
      });
      it('sets onHold and recording parameters', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_ACTIVE_RESOURCES', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'interaction-id',
          },
          {
            interactionId: 'a-different-interaction',
          },
        ],
      };
      action = {
        type: SET_ACTIVE_RESOURCES,
        interactionId: 'interaction-id',
        activeResources: [
          {
            id: 'external-resource-id',
            externalResource: true,
            extension: 'external-resource',
          },
          {
            id: 'internal-resource-id',
          },
        ],
      };
    });
    describe('if interaction no longer exists', () => {
      beforeEach(() => {
        initialState.interactions.shift();
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if interaction exists', () => {
      it('sets the active resources', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_NEW_INTERACTION_PANEL_FORM_INPUT', () => {
    beforeEach(() => {
      initialState = {
        newInteractionPanel: {
          newInteractionFormInput: '',
        },
      };
      action = {
        type: SET_NEW_INTERACTION_PANEL_FORM_INPUT,
        input: 'new input',
      };
    });
    it('sets the input in newInteractionPanel', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('OPEN_NEW_INTERACTION_PANEL', () => {
    beforeEach(() => {
      initialState = { newInteractionPanel: {} };
      action = {
        type: OPEN_NEW_INTERACTION_PANEL,
        isSidePanelCollapsed: true,
      };
    });
    it('Opens the new interaction panel with text from a click to dial', () => {
      initialState.newInteractionPanel.newInteractionFormInput = '';
      action.optionalInput = 'new input yo';
      runReducerAndExpectSnapshot();
    });
    it('Opens the new interaction panel allowing the default param to set value to null', () => {
      initialState.newInteractionPanel.newInteractionFormInput = 'old input yo';
      action.optionalInput = '';
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_MESSAGE_STATE', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          { interactionId: 'a', currentMessage: 'hello' },
          { interactionId: 'b' },
        ],
      };
    });
    it('set the current message on the first interaction with an existing message', () => {
      const next = agentDesktopReducer(fromJS(initialState), {
        type: SAVE_MESSAGE_STATE,
        interactionId: 'a',
        message: 'hey',
      });
      expect(next.toJS().interactions[0].currentMessage).toEqual('hey');
      expect(next.toJS().interactions[1].currentMessage).toEqual(undefined);
    });
    it('set the current message on the second interaction with no existing message', () => {
      const next = agentDesktopReducer(fromJS(initialState), {
        type: SAVE_MESSAGE_STATE,
        interactionId: 'b',
        message: 'hey',
      });
      expect(next.toJS().interactions[0].currentMessage).toEqual('hello');
      expect(next.toJS().interactions[1].currentMessage).toEqual('hey');
    });
  });

  describe('START_OUTBOUND_INTERACTION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        selectedInteractionId: undefined,
      };
    });
    describe('sms', () => {
      beforeEach(() => {
        action = {
          type: START_OUTBOUND_INTERACTION,
          channelType: 'sms',
          customer: '+15064701234',
          contact: {
            id: 'test-contact-id',
            attributes: {
              name: 'Josh Clowater',
              email: 'jclowater@serenova.com',
            },
          },
        };
      });
      it('adds a new outbound interaction with a generated interactionId, channelType, customer, and contact', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('voice', () => {
      beforeEach(() => {
        action = {
          type: START_OUTBOUND_INTERACTION,
          channelType: 'voice',
          addedByNewInteractionPanel: true,
          customer: '+15064701234',
          contact: {
            id: 'test-contact-id',
            attributes: {
              name: 'Josh Clowater',
              email: 'jclowater@serenova.com',
            },
          },
        };
      });
      it('adds a new outbound interaction with a generated interactionId, channelType, customer, hideNewInteractionPanelOnWorkAccepted, and initiatedByCurrentAgent', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            messageHistory: [],
            interactionId: 'outbound-sms-+15064702497',
            status: 'connecting-to-outbound',
          },
        ],
        selectedInteractionId: 'outbound-sms-+15064702497',
      };
      action = {
        type: INITIALIZE_OUTBOUND_SMS_FOR_AGENT_DESKTOP,
        placeholderInteractionId: 'outbound-sms-+15064702497',
        interactionId: 'newInteractionId',
        message: 'new message!',
      };
    });
    it('sets the interactionId, updates the selectedInteractionId, updates the status, and adds the message', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('ADD_INTERACTION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        selectedInteractionId: undefined,
      };
      action = {
        type: ADD_INTERACTION,
        response: {
          interactionId: 'test-interaction-id',
        },
      };
    });
    describe('adding an inbound interaction', () => {
      beforeEach(() => {
        action.response.channelType = 'voice';
        action.response.direction = 'inbound';
      });
      it('adds it', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('adding an inbound interaction when outbound interactions exist', () => {
      beforeEach(() => {
        action.response.channelType = 'email';
        action.response.direction = 'inbound';
        initialState.interactions = [
          {
            interactionId: 'other-interaction-id',
            channelType: 'email',
            direction: 'outbound',
            contact: { id: 'test-contact-id' },
            contactMode: 'view',
            isSidePanelCollapsed: false,
          },
        ];
      });
      it("adds it. doesn't affect outbound interaction.", () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('adding an outbound voice interaction with new attributes', () => {
      beforeEach(() => {
        action.response.channelType = 'voice';
        action.response.direction = 'outbound';
        action.response.recording = true;
      });
      describe('when the interaction is present', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              channelType: 'voice',
              direction: 'outbound',
              status: 'connecting-to-outbound',
              contact: { id: 'test-contact-id' },
              contactMode: 'view',
              isSidePanelCollapsed: false,
            },
          ];
        });
        it('updates the interaction', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('adding an outbound sms interaction', () => {
      beforeEach(() => {
        action.response.channelType = 'sms';
        action.response.direction = 'outbound';
        action.response.recording = true;
      });
      it('is ignored', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('adding an outbound email interaction', () => {
      beforeEach(() => {
        action.response.channelType = 'email';
        action.response.direction = 'outbound';
        action.response.recording = true;
      });
      it('is ignored', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('WORK_INITIATED', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'voice-interaction-id',
            channelType: 'voice',
          },
          {
            interactionId: 'sms-interaction-id',
            channelType: 'sms',
          },
          {
            interactionId: 'email-interaction-id',
            channelType: 'email',
          },
        ],
      };
      action = {
        type: WORK_INITIATED,
        response: {
          customer: 'new-customer',
        },
      };
    });
    describe('initializing voice interaction', () => {
      beforeEach(() => {
        action.response.interactionId = 'voice-interaction-id';
      });
      it('sets status to work-initiated and number to customer', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('initializing sms interaction', () => {
      beforeEach(() => {
        action.response.interactionId = 'sms-interaction-id';
      });
      it('sets status to work-initiated and customer with plus', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('initializing neither voice nor sms interaction', () => {
      beforeEach(() => {
        action.response.interactionId = 'email-interaction-id';
      });
      it('sets status to work-initiated', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_MESSAGE_HISTORY', () => {
    global.console.warn = jest.fn();
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'interaction-id',
            messageHistory: [],
          },
        ],
      };
      action = {
        type: SET_MESSAGE_HISTORY,
        response: [
          {
            to: 'interaction-id',
            id: 'message-id',
            type: 'agent',
            from: 'Agent Name',
            body: {
              text: 'new message',
            },
            timestamp: new Date(0).toISOString(),
          },
        ],
      };
    });
    it('adds the message to the history', () => {
      runReducerAndExpectSnapshot();
    });
    describe('when there is no matching interaction id', () => {
      beforeEach(() => {
        action.response[0].to = 'non-matching-interaction-id';
      });
      it('console.warns and does nothing', () => {
        runReducerAndExpectSnapshot();
        expect(console.warn.mock.calls[0]).toEqual([
          'Interaction history could not get assigned to an interaction. No matching interactionId.',
        ]);
      });
    });
    describe('when a message already exists with the same id as the one being added', () => {
      beforeEach(() => {
        initialState.interactions[0].messageHistory = [
          {
            to: 'interaction-id',
            id: 'message-id',
            type: 'agent',
            from: 'Agent Name',
            text: 'previous message',
          },
        ];
      });
      it('does not add it', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('when a message exists with an id of "no-id"', () => {
      beforeEach(() => {
        initialState.interactions[0].messageHistory = [
          {
            to: 'interaction-id',
            id: 'no-id',
            type: 'agent',
            from: 'Agent Name',
          },
        ];
      });
      it('the message with id "no-id" is removed', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('UPDATE_MESSAGE_HISTORY_AGENT_NAME', () => {
    beforeEach(() => {
      const messageHistory = [
        {
          type: 'agent',
          from: '123',
        },
        {
          type: 'agent',
          from: 'non-matching-from',
        },
        {
          type: 'customer',
          from: '123',
        },
      ];
      initialState = {
        interactions: [
          {
            interactionId: 'interaction-id',
            messageHistory,
          },
          {
            interactionId: 'non-matching-interaction-id',
            messageHistory,
          },
        ],
      };
      action = {
        type: UPDATE_MESSAGE_HISTORY_AGENT_NAME,
        interactionId: 'interaction-id',
        user: {
          id: '123',
          firstName: 'First',
          lastName: 'Last',
        },
      };
    });
    it('only updates the name of the agent with matching id in the interaction', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('ADD_MESSAGE', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
            direction: 'inbound',
            channelType: 'sms',
            messageHistory: [],
          },
        ],
      };
      action = {
        type: ADD_MESSAGE,
      };
    });
    describe('Message', () => {
      beforeEach(() => {
        action.message = new Message({
          type: 'agent',
          from: 'Agent',
          text: 'test message',
          timestamp: new Date(0).toISOString(),
        });
      });
      it('is added', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('ResponseMessage', () => {
      beforeEach(() => {
        action.message = new ResponseMessage({
          to: 'test-interaction-id',
          type: 'customer',
          from: 'Josh Clowater',
          body: {
            text: 'test messasge',
          },
          timestamp: new Date(0).toISOString(),
        });
      });
      it('is added', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('not type Message', () => {
      beforeEach(() => {
        action.message = 'String is not type Message';
      });
      it('errors, with correct message', () => {
        let error;
        try {
          agentDesktopReducer(fromJS(initialState), action);
        } catch (e) {
          error = e;
        }
        expect(error.message).toEqual(
          'ADD_MESSAGE message must be of type Message'
        );
      });
    });
  });

  describe('ADD_SCRIPT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
          },
        ],
      };
      action = {
        type: ADD_SCRIPT,
        interactionId: 'test-interaction-id',
        script: { scriptItem: 'something', id: 'garbage-useless-id' },
        scriptId: 'actual-script-id',
      };
    });
    describe('interaction is there', () => {
      beforeEach(() => {
        initialState.interactions[0].channelType = 'messaging';
      });
      it('adds the script and replaces the id', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('interaction is not there', () => {
      beforeEach(() => {
        initialState.selectedInteractionId = 'test-interaction-id';
        action.interactionId = 'new-interaction-id';
      });
      it('adds a "script-only" interaction', () => {
        runReducerAndExpectSnapshot();
      });
      describe('no existing/selected interactions', () => {
        beforeEach(() => {
          initialState = { interactions: [] };
        });
        it('adds also selects the interaction', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
  });

  describe('REMOVE_SCRIPT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
            script: { scriptItem: 'something' },
          },
        ],
      };
      action = {
        type: REMOVE_SCRIPT,
        interactionId: 'test-interaction-id',
      };
    });
    describe('interaction is there', () => {
      it('removes the script', () => {
        runReducerAndExpectSnapshot();
      });
      describe('the interaction has isScriptOnly', () => {
        beforeEach(() => {
          initialState.interactions[0].isScriptOnly = true;
          initialState.selectedInteractionId = 'test-interaction-id';
        });
        it('removes the script, removes isScriptOnly, and selects the next interaction', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('the interaction has status of "work-ended-pending-script"', () => {
        beforeEach(() => {
          initialState.interactions[0].status = 'work-ended-pending-script';
        });
        it('removes the interaction', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('interaction is not there', () => {
      beforeEach(() => {
        action.interactionId = 'not-the-right-id';
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('REMOVE_INTERACTION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
          },
        ],
      };
      action = {
        type: REMOVE_INTERACTION,
        interactionId: 'test-interaction-id',
      };
    });
    describe('interaction without a script', () => {
      describe('interaction is the selected interaction', () => {
        beforeEach(() => {
          initialState.selectedInteractionId = 'test-interaction-id';
        });
        describe('voice interaction exists', () => {
          beforeEach(() => {
            initialState.interactions.push({
              interactionId: 'sms-interaction-id',
              channelType: 'sms',
            });
            initialState.interactions.push({
              interactionId: 'voice-interaction-id',
              channelType: 'voice',
            });
          });
          it('selects the voice interaction', () => {
            runReducerAndExpectSnapshot();
          });
        });
        describe('only non-voice interactions exist', () => {
          beforeEach(() => {
            initialState.interactions.push({
              interactionId: 'first-interaction-id',
              channelType: 'sms',
            });
            initialState.interactions.push({
              interactionId: 'second-interaction-id',
              channelType: 'email',
            });
          });
          it('selects the first non-voice interaction', () => {
            runReducerAndExpectSnapshot();
          });
        });
      });
      describe('only pending interaction exist', () => {
        beforeEach(() => {
          initialState.interactions.push({
            interactionId: 'first-interaction-id',
            channelType: 'sms',
          });
        });
        it('selects nothing', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('interaction is not the selected interaction', () => {
        beforeEach(() => {
          initialState.selectedInteractionId = 'other-interaction-id';
          initialState.interactions.push({
            interactionId: 'other-interaction-id',
          });
        });
        it('keeps the selectedInteractionId the same', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('interaction with a script', () => {
      beforeEach(() => {
        initialState.interactions[0].script = { scriptItem: 'something' };
      });
      it('sets the status to "work-ended-pending-script"', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('interaction is not there', () => {
      beforeEach(() => {
        action.interactionId = 'not-the-right-id';
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('REMOVE_INTERACTION_HARD', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
          },
        ],
      };
      action = {
        type: REMOVE_INTERACTION_HARD,
        interactionId: 'test-interaction-id',
      };
    });
    describe('interaction is the selected interaction', () => {
      beforeEach(() => {
        initialState.selectedInteractionId = 'test-interaction-id';
        initialState.interactions.push({
          interactionId: 'first-interaction-id',
          channelType: 'sms',
        });
        initialState.interactions.push({
          interactionId: 'second-interaction-id',
          channelType: 'email',
        });
      });
      it('removes the interaction and selectes the next one', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('interaction is not there', () => {
      beforeEach(() => {
        action.interactionId = 'not-the-right-id';
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_ASSIGNED_CONTACT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [{ interactionId: 'mockInteraction1' }],
      };
      action = {
        type: SET_ASSIGNED_CONTACT,
        interactionId: 'mockInteraction1',
        contact: {
          id: 'mockContactId',
          attributes: { name: 'mockContactName' },
        },
      };
    });
    describe('no crmModule (Desktop)', () => {
      it('adds the contact and sets contactMode to view', () => {
        initialState.crmModule = 'none';
        runReducerAndExpectSnapshot();
      });
    });
    describe('zendesk crmModule', () => {
      it('adds the contact and sets contactAssignedNotification', () => {
        initialState.crmModule = 'zendesk';
        runReducerAndExpectSnapshot();
      });
    });
    describe('salesforce-classic crmModule', () => {
      it('adds the contact and sets contactAssignedNotification', () => {
        initialState.crmModule = 'salesforce-classic';
        runReducerAndExpectSnapshot();
      });
    });
    describe('salesforce-lightning crmModule', () => {
      it('adds the contact and sets contactAssignedNotification', () => {
        initialState.crmModule = 'salesforce-lightning';
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('UNASSIGN_CONTACT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'mockInteraction1',
            contact: { id: 'mockContactId' },
          },
        ],
      };
      action = {
        type: UNASSIGN_CONTACT,
        interactionId: 'mockInteraction1',
      };
    });
    it('removes contact and sets contactAssignedNotification', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'mockInteraction1',
            contactAssignedNotification: 'contactWasAssigned',
          },
        ],
      };
      action = {
        type: DISMISS_CONTACT_WAS_ASSIGNED_NOTIFICATION,
        interactionId: 'mockInteraction1',
      };
    });
    it('sets contactAssignedNotification to false', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'mockInteraction1',
            contactAssignedNotification: 'contactWasUnassigned',
          },
        ],
      };
      action = {
        type: DISMISS_CONTACT_WAS_UNASSIGNED_NOTIFICATION,
        interactionId: 'mockInteraction1',
      };
    });
    it('removes contactAssignedNotification', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_CUSTOM_FIELDS', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          { interactionId: 'mockInteraction1', customFieldsCollapsed: false },
          { interactionId: 'mockInteraction2', customFieldsCollapsed: false },
        ],
      };
      action = {
        type: TOGGLE_CUSTOM_FIELDS,
        interactionId: 'mockInteraction2',
      };
    });
    it('should toggle customFieldsCollapsed on the appropriate interaction', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('UPDATE_RESOURCE_NAME', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            warmTransfers: [{ id: 'resource-id-1' }, { id: 'resource-id-2' }],
          },
          {
            warmTransfers: [{ id: 'resource-id-2' }],
          },
        ],
      };
      action = {
        type: UPDATE_RESOURCE_NAME,
        response: {
          result: {
            id: 'resource-id-2',
            email: 'tester@testingson.com',
          },
        },
      };
    });
    describe('if resource is not present on interactions', () => {
      beforeEach(() => {
        action.response.result.id = 'not-there';
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if resource is present on interactions', () => {
      describe('if resource has no name properties', () => {
        it("sets the name of the resource to be the resource's email", () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('if resource has name properties', () => {
        beforeEach(() => {
          action.response.result.firstName = 'Tester';
          action.response.result.lastName = 'Testingson';
        });
        it('sets the name of the resource', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
  });

  describe('UPDATE_CONTACT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        newInteractionPanel: {},
        noInteractionContactPanel: {},
      };
      action = {
        type: UPDATE_CONTACT,
        updatedContact: {
          id: 'test-contact-id',
          name: 'new name',
        },
      };
    });
    describe('there is the same contact in all interactions', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              contact: { id: 'test-contact-id' },
            },
          ],
          newInteractionPanel: { contact: { id: 'test-contact-id' } },
          noInteractionContactPanel: { contact: { id: 'test-contact-id' } },
        };
      });
      it('adds the new contact attributes to the contacts', () => {
        runReducerAndExpectSnapshot();
      });
      describe("the contact id doesn't match", () => {
        beforeEach(() => {
          action.updatedContact.id = 'mismatch-contact-id';
        });
        it('does nothing', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('there is the same contact id, with different type in interactions', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              contact: {
                id: 123,
                type: 'user',
              },
            },
            {
              contact: {
                id: 123,
                type: 'ticket',
              },
            },
          ],
          zendeskActiveTab: {
            contact: {
              id: 123,
              type: 'user',
            },
          },
        };
        action.updatedContact.id = 123;
        action.contactType = 'user';
      });
      it('updates the contact in interactions and zendeskActiveTab with the matching', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('REMOVE_CONTACT', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        newInteractionPanel: {},
        noInteractionContactPanel: {},
      };
      action = {
        type: REMOVE_CONTACT,
        contactId: 'test-contact-id',
      };
    });
    describe('if a contact is deleted when there are no interactions present', () => {
      it('nothing happens', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if an interaction is in progress, and no contact is assigned to that interaction, when one of the contacts is removed', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'test-interaction-id',
            },
          ],
          newInteractionPanel: {},
          noInteractionContactPanel: {},
        };
      });
      it('will remove the targeted contact as normal', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if one or more interactions are in progress, and one of the contacts is removed', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'test-interaction-id-1',
              contact: { id: 'test-contact-id' },
            },
          ],
          newInteractionPanel: {},
          noInteractionContactPanel: {},
        };
      });
      describe('if one interaction is in progress, and the assigned contact is removed', () => {
        it('will remove the targeted contact as normal', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('if multiple interactions are in progress, and the assigned contact is removed', () => {
        beforeEach(() => {
          initialState.interactions.push({
            interactionId: 'test-interaction-id-2',
            contact: { id: 'test-contact-id-2' },
          });
        });
        it('will remove the targeted contact as normal', () => {
          runReducerAndExpectSnapshot();
        });
      });
    });
    describe('if an interaction is in progress and the new interaction panel is open', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'test-interaction-id-1',
            },
          ],
          newInteractionPanel: {
            contact: { id: 'test-contact-id' },
          },
          noInteractionContactPanel: {},
        };
      });
      it('will delete as normal', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if an interaction is in progress and no interaction panel is open', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'test-interaction-id-',
            },
          ],
          noInteractionContactPanel: {
            contact: { id: 'test-contact-id' },
          },
          newInteractionPanel: {},
        };
      });
      it('will delete as normal', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('CLOSE_NEW_INTERACTION_PANEL', () => {
    beforeEach(() => {
      initialState = {
        newInteractionPanel: 'initialState',
        selectedInteractionId: 'creating-new-interaction',
        interactions: [],
      };
      action = {
        type: CLOSE_NEW_INTERACTION_PANEL,
      };
    });
    it('resets newInteractionPanel and selects the next interactionId', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL', () => {
    beforeEach(() => {
      initialState = {
        currentCrmItemHistoryPanel: 'initialState',
        selectedInteractionId: 'current-crm-item-history',
        interactions: [],
      };
      action = {
        type: CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
      };
    });
    it('resets currentCrmItemHistoryPanel and selects the next interactionId', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('DISMISS_INTERACTION_NOTIFICATION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
            notifications: [
              {
                id: 'a',
              },
              {
                id: 'b',
              },
            ],
          },
          {
            interactionId: 2,
            notifications: [
              {
                id: 'a',
              },
              {
                id: 'b',
              },
            ],
          },
        ],
      };
      action = {
        type: DISMISS_INTERACTION_NOTIFICATION,
        interactionId: 2,
        notificationId: 'b',
      };
    });
    it('removes the correct notification from the specified interaction', () => {
      runReducerAndExpectSnapshot();
    });
  });
});
