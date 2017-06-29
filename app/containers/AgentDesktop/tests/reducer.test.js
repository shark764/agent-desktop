/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';

import Message from 'models/Message/Message';
import ResponseMessage from 'models/Message/ResponseMessage';

import {
  SET_INTERACTION_STATUS,
  SET_ACTIVE_RESOURCES,
  START_OUTBOUND_INTERACTION,
  INITIALIZE_OUTBOUND_SMS,
  ADD_INTERACTION,
  ADD_MESSAGE,
  ADD_SCRIPT,
  REMOVE_SCRIPT,
  REMOVE_INTERACTION,
  REMOVE_INTERACTION_HARD,
  UPDATE_RESOURCE_NAME,
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
        });
        describe('if interaction is voice', () => {
          beforeEach(() => {
            initialState.interactions[0].channelType = 'voice';
          });
          it('deletes "isScriptOnly"', () => {
            runReducerAndExpectSnapshot();
          });
        });
        describe('if interaction is not voice', () => {
          beforeEach(() => {
            initialState.interactions[0].channelType = 'sms';
          });
          it('deletes "isScriptOnly" and focuses script tab', () => {
            runReducerAndExpectSnapshot();
          });
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
        it('updates the timeout', () => {
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

  describe('START_OUTBOUND_INTERACTION', () => {
    beforeEach(() => {
      initialState = {
        interactions: [],
        selectedInteractionId: undefined,
      };
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

  describe('INITIALIZE_OUTBOUND_SMS', () => {
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
        type: INITIALIZE_OUTBOUND_SMS,
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
              // Missing recording
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
          unread: false,
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
        script: { scriptItem: 'something' },
      };
    });
    describe('interaction is there', () => {
      describe('interaction is voice', () => {
        beforeEach(() => {
          initialState.interactions[0].channelType = 'voice';
        });
        it('adds the script', () => {
          runReducerAndExpectSnapshot();
        });
      });
      describe('interaction is not voice', () => {
        beforeEach(() => {
          initialState.interactions[0].channelType = 'messaging';
        });
        it('adds the script and sets focus to the script tab', () => {
          runReducerAndExpectSnapshot();
        });
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
      describe('interaction is not the selected interaction', () => {
        beforeEach(() => {
          initialState.selectedInteractionId = 'other-interaction-id';
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
});
