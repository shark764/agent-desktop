/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

/**
 * Splitting reducer test into two parts, due to errors being thrown when
 * running test on big files.
 * Jest throws maximum-call-stack-size-exceeded error when attempting to add
 * more tests to original reducer.test file.
 */

import { fromJS } from 'immutable';
import * as ACTIONS from '../constants';
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
        type: ACTIONS.SET_DISPOSITION_DETAILS,
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
        type: ACTIONS.TOGGLE_TRANSCRIPT_COPIED,
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
          type: ACTIONS.SET_EMAIL_ATTACHMENT_FETCHING_URL,
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
          type:
            ACTIONS.SET_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTSOUTBOUND_CUSTOMER_CONNECTED,
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
          type: ACTIONS.SET_CUSTOM_FIELDS,
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
          type: ACTIONS.SET_CUSTOM_FIELDS,
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
          type: ACTIONS.SET_IS_COLD_TRANSFERRING,
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
          type: ACTIONS.SET_IS_COLD_TRANSFERRING,
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
          type: ACTIONS.TOGGLE_INTERACTION_NOTIFICATION,
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
          type: ACTIONS.TOGGLE_INTERACTION_NOTIFICATION,
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

  describe('SET_TRANSFERRING_IN_CONFERENCE', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: '1',
          },
        ],
      };
    });
    describe('send transferringInConference as true', () => {
      beforeEach(() => {
        action = {
          type: ACTIONS.SET_TRANSFERRING_IN_CONFERENCE,
          interactionId: '1',
          transferringInConference: true,
        };
      });
      it('sets transferringInConference flag as true in the interaction', () => {
        runReducerAndExpectSnapshot();
      });
    });
    describe('send transferringInConference as false', () => {
      beforeEach(() => {
        action = {
          type: ACTIONS.SET_TRANSFERRING_IN_CONFERENCE,
          interactionId: '1',
          transferringInConference: false,
        };
      });
      it('sets transferringInConference flag as false in the interaction', () => {
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
                    replyTo: [
                      {
                        address: 'replytest@test.com',
                        name: 'reply-test',
                      },
                    ],
                  },
                },
              ],
            })
          ),
          (action = {
            type: ACTIONS.EMAIL_CREATE_REPLY,
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
            type: ACTIONS.EMAIL_CREATE_REPLY,
            interactionId: 'test-interaction-id',
          })
        )
      ).toMatchSnapshot();
    });
  });

  describe('SET_TRANSFER_LISTS_FROM_FLOW', () => {
    beforeEach(() => {
      action = {
        type: ACTIONS.SET_TRANSFER_LISTS_FROM_FLOW,
        interactionId: 'mockInteractionId',
        transferListsFromFlow: [
          { type: 'id', value: 'mockTransferList3' },
          { type: 'name', value: 'mockTransferList4' },
        ],
      };
    });
    it('sets transfer lists from flow', () => {
      initialState = {
        interactions: [{ interactionId: 'mockInteractionId' }],
      };
      runReducerAndExpectSnapshot();
    });
    it('updates transfer lists from flow', () => {
      initialState = {
        interactions: [
          {
            interactionId: 'mockInteractionId',
            transferlists: {
              transferListsFromFlow: [
                { type: 'id', value: 'mockTransferList1' },
                { type: 'name', value: 'mockTransferList2' },
              ],
            },
          },
        ],
      };
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_INTERACTION_TRANSFER_LISTS', () => {
    beforeEach(() => {
      initialState = {
        interactions: [{ interactionId: 'mockInteractionId' }],
      };
      action = {
        type: ACTIONS.SET_INTERACTION_TRANSFER_LISTS,
        interactionId: 'mockInteractionId',
        interactionTransferLists: [
          {
            id: 'mockTransferListId',
            name: 'mockTransferListName',
            endpoints: 'mockEndPoint',
          },
        ],
      };
    });
    it('sets interaction transfer lists', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_INTERACTION_TRANSFER_LISTS_VISIBLE_STATE', () => {
    beforeEach(() => {
      initialState = {};
      action = {
        type: ACTIONS.SET_INTERACTION_TRANSFER_LISTS_VISIBLE_STATE,
        interactionTransferListsVisibleState: {
          'mockTransferListId1-InteractionId': true,
          'mockTransferListId2-InteractionId': false,
        },
      };
    });
    it('sets visible state of interaction transfer lists', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('SET_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS', () => {
    beforeEach(() => {
      initialState = {};
      action = {
        type: ACTIONS.SET_VISIBLE_STATE_OF_ALL_INTERACTION_TRANSFER_LISTS,
        visibleStateofAllInteractionTrasferLists: true,
      };
    });
    it('sets visible state of all interaction transfer lists', () => {
      runReducerAndExpectSnapshot();
    });
  });

  describe('ADD_SMOOCH_MESSAGE', () => {
    beforeEach(() => {
      initialState = {
        interactions: [
          {
            interactionId: 'test-interaction-id',
            direction: 'inbound',
            channelType: 'sms',
            messageHistory: [
              {
                agentMessageId: '1',
                type: 'agent',
                from: 'Agent',
                text: 'test message',
                timestamp: new Date(0).toISOString(),
                pending: true,
              },
            ],
            isCopied: true,
          },
        ],
      };
      action = {
        type: ACTIONS.ADD_SMOOCH_MESSAGE,
        interactionId: 'test-interaction-id',
      };
    });
    describe('agent message with matching agentMessageId', () => {
      beforeEach(() => {
        action.message = {
          id: 'mock-id',
          type: 'agent',
          from: 'Agent',
          text: 'test message',
          agentMessageId: '1',
          timestamp: new Date(0).toISOString(),
        };
      });
      it('is replaced', () => {
        runReducerAndExpectSnapshot();
      });
    });

    describe('agent message with non-matching agentMessageId', () => {
      beforeEach(() => {
        action.message = {
          id: 'mock-id',
          type: 'agent',
          from: 'Agent',
          text: 'test message',
          agentMessageId: 'not matching',
          timestamp: new Date(0).toISOString(),
        };
      });
      it('is added', () => {
        runReducerAndExpectSnapshot();
      });
    });

    describe('message without agentMessageId', () => {
      beforeEach(() => {
        action.message = {
          id: 'mock-id',
          to: 'test-interaction-id',
          type: 'customer',
          from: 'Irvin Sandoval',
          body: {
            text: 'test message',
          },
          timestamp: new Date(0).toISOString(),
        };
      });
      it('is added', () => {
        runReducerAndExpectSnapshot();
      });
    });
  });
});
