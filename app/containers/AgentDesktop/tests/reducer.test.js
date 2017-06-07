
import { fromJS } from 'immutable';

import Message from 'models/Message/Message';
import ResponseMessage from 'models/Message/ResponseMessage';

import {
  SET_INTERACTION_STATUS,
  START_OUTBOUND_INTERACTION,
  INITIALIZE_OUTBOUND_SMS,
  ADD_INTERACTION,
  ADD_MESSAGE,
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
        it('updates the correct interaction\'s status', () => {
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
    });
    describe('if setting an interaction\'s status to wrapup', () => {
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
    describe('if response includes conference details', () => {
      beforeEach(() => {
        action.newStatus = 'work-accepting';
        action.response = {
          customerOnHold: true,
          recording: true,
          activeResources: [
            {
              id: 'resource-id-2',
              muted: true,
              onHold: true,
            },
          ],
        };
      });
      describe('if the interaction has is a voice interaction with existing different conference details', () => {
        beforeEach(() => {
          initialState.interactions = [
            {
              interactionId: 'test-interaction-id',
              status: 'work-offer',
              channelType: 'voice',
              // These will be updated
              onHold: false,
              recording: false,
              warmTransfers: [
                {
                  // Action does not include 'resource-id-1'. It will be removed.
                  targetResource: 'resource-id-1',
                  muted: false,
                  onHold: false,
                }, {
                  targetResource: 'resource-id-2',
                  // These will be updated
                  muted: false,
                  onHold: false,
                },
              ],
            },
          ];
        });
        it('updates the conference participants and details', () => {
          runReducerAndExpectSnapshot();
        });
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
          timestamp: (new Date(0)).toISOString(),
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
          timestamp: (new Date(0)).toISOString(),
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
        expect(error.message).toEqual('ADD_MESSAGE message must be of type Message');
      });
    });
  });
});
