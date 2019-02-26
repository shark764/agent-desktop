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
  UPDATE_CALL_CONTROLS,
  OPEN_NEW_INTERACTION_PANEL,
  CLOSE_NEW_INTERACTION_PANEL,
  CLOSE_CURRENT_CRM_ITEM_HISTORY_PANEL,
  SAVE_MESSAGE_STATE,
  ADD_INTERACTION_NOTIFICATION,
  REMOVE_INTERACTION_NOTIFICATION,
  SET_QUEUES_TIME,
  SET_USER_CONFIG,
  SET_DISPOSITION_DETAILS,
  TOGGLE_TRANSCRIPT_COPIED,
  SET_EMAIL_ATTACHMENT_FETCHING_URL,
  OUTBOUND_CUSTOMER_CONNECTED,
  SET_CUSTOM_FIELDS,
  EMAIL_CREATE_REPLY,
  SET_IS_COLD_TRANSFERRING,
  TOGGLE_INTERACTION_NOTIFICATION,
} from '../constants';
import agentDesktopReducer, { getNextSelectedInteractionId } from '../reducer';

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
          outboundInteractionData: {
            channelType: 'sms',
            customer: '+15064701234',
            contact: {
              id: 'test-contact-id',
              attributes: {
                name: 'Josh Clowater',
                email: 'jclowater@serenova.com',
              },
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
          outboundInteractionData: {
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
            direction: 'agent-initiated',
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
        action.response.direction = 'agent-initiated';
        action.response.recording = true;
      });
      describe('when the interaction is present', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              channelType: 'voice',
              direction: 'agent-initiated',
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
        action.response.direction = 'agent-initiated';
        action.response.recording = true;
      });
      it('is ignored', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('adding an outbound email interaction', () => {
      beforeEach(() => {
        action.response.channelType = 'email';
        action.response.direction = 'agent-initiated';
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
            isCopied: true,
          },
        ],
      };
      action = {
        type: ADD_MESSAGE,
        interactionId: 'test-interaction-id',
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
    describe('if interaction is in work-initiated', () => {
      beforeEach(() => {
        initialState.interactions = [
          {
            interactionId: 'test-interaction-id',
            status: 'work-initiated',
            isScriptOnly: true,
            script: { id: 'mock-script-id' },
          },
        ];
        initialState.interactions[0].channelType = 'email';
      });
      it('adds "isScriptOnly"', () => {
        runReducerAndExpectSnapshot();
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
            interactionId: '1',
            warmTransfers: [{ id: 'resource-id-1' }, { id: 'resource-id-2' }],
          },
          {
            interactionId: '2',
            warmTransfers: [{ id: 'resource-id-2' }],
          },
        ],
      };
      action = {
        type: UPDATE_RESOURCE_NAME,
        interactionId: '1',
        activeResourceId: 'resource-id-1',
      };
    });
    describe('if resource is not present on interactions', () => {
      beforeEach(() => {
        action.activeResourceId = 'not-there';
      });
      it('does nothing', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('if resource is present on interactions', () => {
      beforeEach(() => {
        action.activeResourceName = 'Tester Testingson';
      });
      it('sets the name of the resource', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('UPDATE_CALL_CONTROLS', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: '1',
          },
          {
            interactionId: '2',
          },
        ],
      };
      action = {
        type: UPDATE_CALL_CONTROLS,
        interactionId: '2',
        callControls: {
          callControlsKey: false,
        },
      };
    });
    it('updates the call controls on the specified interaction', () => {
      runReducerAndExpectSnapshot();
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

  describe('ADD_INTERACTION_NOTIFICATION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
            notifications: [],
          },
          {
            interactionId: 2,
            notifications: [],
          },
        ],
      };
      action = {
        type: ADD_INTERACTION_NOTIFICATION,
        interactionId: 2,
        messageKey: 'b',
      };
    });
    it('removes the correct notification from the specified interaction', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('REMOVE_INTERACTION_NOTIFICATION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
            notifications: [
              {
                messageKey: 'a',
              },
              {
                messageKey: 'b',
              },
            ],
          },
          {
            interactionId: 2,
            notifications: [
              {
                messageKey: 'a',
              },
              {
                messageKey: 'b',
              },
            ],
          },
        ],
      };
      action = {
        type: REMOVE_INTERACTION_NOTIFICATION,
        interactionId: 2,
        messageKey: 'b',
      };
    });
    it('removes the correct notification from the specified interaction', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_QUEUES_TIME', () => {
    beforeEach(() => {
      initialState = {
        queues: [
          {
            id: 'test-queue-uuid',
            queueTime: 0,
          },
        ],
      };
      action = {
        type: SET_QUEUES_TIME,
        queueData: {
          'test-queue-uuid': {
            body: {
              results: {
                avg: 32,
              },
            },
          },
        },
      };
    });
    it('updates the current queue time to reflect the new average wait time', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_USER_CONFIG', () => {
    beforeEach(() => {
      initialState = {};
      action = {
        type: SET_USER_CONFIG,
        response: {
          reasonLists: [
            {
              active: true,
              reasons: [
                {
                  name: 'f',
                  sortOrder: 6,
                  hierarchy: [],
                },
                {
                  name: 'i',
                  sortOrder: 9,
                  hierarchy: [],
                },
                {
                  name: 'c',
                  sortOrder: 3,
                  hierarchy: ['Test1'],
                },
                {
                  name: 'a',
                  sortOrder: 1,
                  hierarchy: [],
                },
                {
                  name: 'g',
                  sortOrder: 7,
                  hierarchy: [],
                },
                {
                  name: 'k',
                  sortOrder: 11,
                  hierarchy: ['Test2'],
                },
                {
                  name: 'n',
                  sortOrder: 14,
                  hierarchy: ['Test3'],
                },
                {
                  name: 'b',
                  sortOrder: 2,
                  hierarchy: [],
                },
                {
                  name: 'e',
                  sortOrder: 5,
                  hierarchy: [],
                },
                {
                  name: 'd',
                  sortOrder: 4,
                  hierarchy: ['Test1'],
                },
                {
                  name: 'l',
                  sortOrder: 12,
                  hierarchy: ['Test2'],
                },
                {
                  name: 'h',
                  sortOrder: 8,
                  hierarchy: [],
                },
                {
                  name: 'm',
                  sortOrder: 13,
                  hierarchy: ['Test3'],
                },
                {
                  name: 'j',
                  sortOrder: 10,
                  hierarchy: [],
                },
              ],
            },
            {
              active: false,
              reasons: [
                {
                  name: "doesn't matter",
                  sortOrder: 1,
                  hierarchy: [],
                },
                {
                  name: "I don't care",
                  sortOrder: 2,
                  hierarchy: [],
                },
              ],
            },
          ],
        },
      };
    });
    it('shows the presence reasons list ordered as it was ordered on the configuration', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_DISPOSITION_DETAILS', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
          },
          {
            interactionId: 2,
          },
        ],
      };
      action = {
        interactionId: 1,
        type: SET_DISPOSITION_DETAILS,
        forceSelect: 'Some random action',
        dispositions: [
          {
            name: 'f',
            sortOrder: 6,
            hierarchy: [],
          },
          {
            name: 'i',
            sortOrder: 9,
            hierarchy: [],
          },
          {
            name: 'c',
            sortOrder: 3,
            hierarchy: ['Test1'],
          },
          {
            name: 'a',
            sortOrder: 1,
            hierarchy: [],
          },
          {
            name: 'g',
            sortOrder: 7,
            hierarchy: [],
          },
          {
            name: 'k',
            sortOrder: 11,
            hierarchy: ['Test2'],
          },
          {
            name: 'n',
            sortOrder: 14,
            hierarchy: ['Test3'],
          },
          {
            name: 'b',
            sortOrder: 2,
            hierarchy: [],
          },
          {
            name: 'e',
            sortOrder: 5,
            hierarchy: [],
          },
          {
            name: 'd',
            sortOrder: 4,
            hierarchy: ['Test1'],
          },
          {
            name: 'l',
            sortOrder: 12,
            hierarchy: ['Test2'],
          },
          {
            name: 'h',
            sortOrder: 8,
            hierarchy: [],
          },
          {
            name: 'm',
            sortOrder: 13,
            hierarchy: ['Test3'],
          },
          {
            name: 'j',
            sortOrder: 10,
            hierarchy: [],
          },
        ],
      };
    });
    it('shows the dispositions list ordered as it was ordered on the configuration', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('TOGGLE_TRANSCRIPT_COPIED', () => {
    beforeEach(() => {
      action = {
        type: TOGGLE_TRANSCRIPT_COPIED,
      };
    });
    describe("Toggles interaction's isCopied attribute", () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: '1',
              isCopied: false,
            },
          ],
        };
        action.interactionId = '1';
        action.isCopied = true;
      });
      it('from false to true', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe("Toggles interaction's isCopied attribute", () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: '1',
              isCopied: true,
            },
          ],
        };
        action.interactionId = '1';
        action.isCopied = false;
      });
      it('from true to false', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_EMAIL_ATTACHMENT_FETCHING_URL', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
            emailDetails: {
              attachments: [
                {
                  artifactFileId: '123',
                  filename: 'attachment1',
                  url: 'test-url',
                },
              ],
            },
          },
        ],
      };
    });
    describe('passing in a value for fetchingAttachmentUrl', () => {
      beforeEach(() => {
        action = {
          type: SET_EMAIL_ATTACHMENT_FETCHING_URL,
          interactionId: 1,
          artifactFileId: '123',
          fetchingAttachmentUrl: true,
        };
      });
      it('sets the value in the attachment', () => {
        expect(
          agentDesktopReducer(fromJS(initialState), action).getIn([
            'interactions',
            0,
            'emailDetails',
            'attachments',
            0,
            'fetchingAttachmentUrl',
          ])
        ).toBe(true);
      });
    });
  });

  describe('OUTBOUND_CUSTOMER_CONNECTED', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
            customerConnected: false,
          },
        ],
      };
    });
    describe('Customer picks up the outbound interaction voice', () => {
      beforeEach(() => {
        action = {
          type: OUTBOUND_CUSTOMER_CONNECTED,
          interactionId: 1,
        };
      });
      it('customerConnected is set to true', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_CUSTOM_FIELDS', () => {
    describe('When customFields has already one custom field or it is an empty array', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 1,
              customFields: ['value 1'],
            },
          ],
        };
        action = {
          type: SET_CUSTOM_FIELDS,
          interactionId: 1,
          customFields: ['value 2', 'value 3'],
        };
      });
      it('it adds the ones that come from the SDK at the begginig of the list', () => {
        runReducerAndExpectSnapshot();
      });
    });

    describe('When customFields it is not set', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 1,
            },
          ],
        };
        action = {
          type: SET_CUSTOM_FIELDS,
          interactionId: 1,
          customFields: ['value 2', 'value 3'],
        };
      });
      it('customFields is set to the values that come from the SDK', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  describe('SET_IS_COLD_TRANSFERRING', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 1,
          },
        ],
      };
    });
    describe('send isColdTransferring as true', () => {
      beforeEach(() => {
        action = {
          type: SET_IS_COLD_TRANSFERRING,
          interactionId: '1',
          isColdTransferring: true,
        };
      });
      it('sets isColsTransferring flag as true in the interaction', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('send isColdTransferring as false', () => {
      beforeEach(() => {
        action = {
          type: SET_IS_COLD_TRANSFERRING,
          interactionId: '1',
          isColdTransferring: false,
        };
      });
      it('sets isColsTransferring flag as false in the interaction', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });
  describe('TOGGLE_INTERACTION_NOTIFICATION', () => {
    describe('When notification is already on the interaction', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'a',
              notifications: [
                {
                  uuid: 'mock-uuid',
                  mockValue: 'mock-value',
                  isError: true,
                },
                {
                  uuid: 'mock-uuid-2',
                  mockValue: 'mock-value-2',
                },
              ],
            },
            {
              interactionId: 'b',
              notifications: [],
            },
          ],
        };
        action = {
          type: TOGGLE_INTERACTION_NOTIFICATION,
          interactionId: 'a',
          notification: {
            uuid: 'mock-uuid',
            mockValue: 'mock-value',
            isError: true,
          },
        };
      });
      it('deletes notification on the interaction', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('When notification is not in the interaction', () => {
      beforeEach(() => {
        initialState = {
          interactions: [
            {
              interactionId: 'a',
              notifications: [
                {
                  uuid: 'mock-uuid',
                  mockValue: 'mock-value',
                  isError: true,
                },
                {
                  uuid: 'mock-uuid',
                  mockValue: 'mock-value-2',
                },
              ],
            },
            {
              interactionId: 'b',
              notifications: [],
            },
          ],
        };
        action = {
          type: TOGGLE_INTERACTION_NOTIFICATION,
          interactionId: 'a',
          notification: {
            uuid: 'mock-uuid-3',
            mockValue: 'mock-value-3',
            isError: true,
          },
        };
      });
      it('adds notification to the interaction', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });

  /* REDUCER SHARED FUNCTIONS TESTS */
  describe('getNextSelectedInteractionId() correctly sets the next selected interaction', () => {
    beforeEach(() => {
      initialState = {
        selectedInteractionId: 'test-voice-interaction-id',
        interactions: [
          {
            interactionId: 'test-voice-interaction-id',
            channelType: 'voice',
            status: 'connecting-to-outbound',
          },
          {
            interactionId: 'test-sms-interaction-id',
            channelType: 'sms',
            status: 'work-initiated',
          },
          {
            interactionId: 'test-script-interaction-id',
            status: 'script-only',
          },
        ],
      };
    });

    it('returns the voice interaction id as the next selected interactionId when there is a script', () => {
      const newSelectedInteractionId = getNextSelectedInteractionId(
        fromJS(initialState),
        'test-script-interaction-id'
      );

      expect(newSelectedInteractionId).toEqual('test-voice-interaction-id');
    });

    it('returns the sms interaction id as the next selected interaction id while a voice call is not yet connected', () => {
      const newSelectedInteractionId = getNextSelectedInteractionId(
        fromJS(initialState),
        'test-sms-interaction-id'
      );

      expect(newSelectedInteractionId).toEqual('test-voice-interaction-id');
    });

    it('returns the sms interaction id as the next selected interactionId when a voice call is connected', () => {
      initialState = {
        selectedInteractionId: 'test-sms-interaction-id',
        interactions: [
          {
            interactionId: 'test-voice-interaction-id',
            channelType: 'voice',
            status: 'connected',
          },
          {
            interactionId: 'test-sms-interaction-id',
            channelType: 'sms',
            status: 'work-initiated',
          },
        ],
      };

      const newSelectedInteractionId = getNextSelectedInteractionId(
        fromJS(initialState),
        'test-voice-interaction-id'
      );

      expect(newSelectedInteractionId).toEqual('test-sms-interaction-id');
    });
  });

  describe('ACTIONS.EMAIL_CREATE_REPLY', () => {
    it('if replyTo exist, show that email in tos', () => {
      expect(
        agentDesktopReducer(
          fromJS(
            (initialState = {
              interactions: [
                {
                  interactionId: 'test-interaction-id',
                  channelType: 'email',
                  emailDetails: {
                    from: {
                      address: 'fromtest@test.com',
                      name: 'test2',
                    },
                    cc: {
                      address: 'cctest@test.com',
                      name: 'cctest',
                    },
                    bcc: [],
                    subject: '[title test]',
                    headers: [
                      {
                        replyTo: 'replytest@test.com',
                      },
                    ],
                  },
                },
              ],
            })
          ),
          (action = {
            type: EMAIL_CREATE_REPLY,
            interactionId: 'test-interaction-id',
          })
        )
      ).toMatchSnapshot();
    });
    it('if replyTo does not exist, show the email from in tos', () => {
      expect(
        agentDesktopReducer(
          fromJS(
            (initialState = {
              interactions: [
                {
                  interactionId: 'test-interaction-id',
                  channelType: 'email',
                  emailDetails: {
                    from: {
                      address: 'fromtest@test.com',
                      name: 'test2',
                    },
                    cc: {
                      address: 'cctest@test.com',
                      name: 'cctest',
                    },
                    bcc: [],
                    subject: '[title test]',
                    headers: [],
                  },
                },
              ],
            })
          ),
          (action = {
            type: EMAIL_CREATE_REPLY,
            interactionId: 'test-interaction-id',
          })
        )
      ).toMatchSnapshot();
    });
  });
});
