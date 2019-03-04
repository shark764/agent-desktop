import { fromJS } from 'immutable';

import {
  selectAgents,
  selectQueuesListVisibleState,
  selectAgentsListVisibleState,
  selectShowTransferDialpad,
  selectTransferSearchInput,
  selectTransferTabIndex,
  selectFocusedTransferItemIndex,
  selectUserAssignedTransferLists,
  selectUserAssignedTransferListsLoadingState,
  selectUserAssignedTransferListsVisibleState,
  selectVisibleStateOfAllUserAssignedTrasferLists,
} from '../selectors';

describe('selectAgents', () => {
  describe('batch requests are successful', () => {
    describe('resourceCapacityList is defined', () => {
      it('filters agents out and maps them properly', () => {
        expect(
          selectAgents(
            fromJS({
              toolbar: {
                batchRequestsAreSuccessful: true,
              },
              transferMenu: {
                resourceCapacity: [
                  {
                    direction: 'agent-initiated',
                  },
                  {
                    agentId: 'mock user id',
                  },
                  {
                    agentId: '1',
                    agentName: 'a a',
                    presence: 'ready',
                  },
                  {
                    agentId: '2',
                    agentName: 'b b',
                    presence: 'ready',
                    capacity: [
                      {
                        channels: {
                          voice: 0,
                        },
                        allocation: 'not-allocated',
                      },
                    ],
                  },
                  {
                    agentId: '3',
                    agentName: 'c c',
                    presence: 'ready',
                    capacity: [
                      {
                        channels: {
                          voice: 0,
                        },
                        allocation: 'fully-allocated',
                      },
                    ],
                  },
                  {
                    agentId: '4',
                    agentName: 'd d',
                    presence: 'not-ready',
                    capacity: [
                      {
                        channels: {
                          voice: 0,
                        },
                        allocation: 'not-allocated',
                      },
                    ],
                  },
                  {
                    agentId: '5',
                    agentName: 'e e',
                    presence: 'ready',
                    capacity: [
                      {
                        channels: {
                          email: 0,
                        },
                        allocation: 'not-allocated',
                      },
                    ],
                  },
                ],
              },
              login: {
                agent: {
                  userId: 'mock user id',
                },
              },
            })
          )
        ).toMatchSnapshot();
      });
    });
    describe('resourceCapacityList is not defined', () => {
      it('returns undefined', () => {
        expect(
          selectAgents(
            fromJS({
              toolbar: {
                batchRequestsAreSuccessful: true,
              },
              transferMenu: {
                resourceCapacity: undefined,
              },
              login: {
                agent: {
                  userId: 'mock user id',
                },
              },
            })
          )
        ).toBe(undefined);
      });
    });
  });
  describe('batch requests are not successful', () => {
    describe('users is defined', () => {
      describe('resourceCapacities is defined', () => {
        it('filters users out and maps them properly', () => {
          expect(
            selectAgents(
              fromJS({
                toolbar: {
                  batchRequestsAreSuccessful: false,
                },
                transferMenu: {
                  users: [
                    {
                      id: 'mock user id',
                    },
                    {
                      id: '10',
                      firstName: 'x',
                      lastName: 'x',
                      state: 'ready',
                    },
                    {
                      id: '11',
                      firstName: 'z',
                      lastName: 'z',
                      state: 'not-ready',
                    },
                  ],
                },
                login: {
                  agent: {
                    userId: 'mock user id',
                  },
                },
              })
            )
          ).toMatchSnapshot();
        });
      });
    });
    describe('userList is not defined', () => {
      it('returns undefined', () => {
        expect(
          selectAgents(
            fromJS({
              toolbar: {
                batchRequestsAreSuccessful: false,
              },
              transferMenu: {
                users: undefined,
              },
              login: {
                agent: {
                  userId: 'mock user id',
                },
              },
            })
          )
        ).toBe(undefined);
      });
    });
  });
});

describe('selectQueuesListVisibleState', () => {
  it('when queuesListVisibleState is defined', () => {
    const state = fromJS({
      transferMenu: {
        queuesListVisibleState: true,
      },
    });
    expect(selectQueuesListVisibleState(state)).toBe(true);
  });
});

describe('selectAgentsListVisibleState', () => {
  it('when agentsListVisibleState is defined', () => {
    const state = fromJS({
      transferMenu: {
        agentsListVisibleState: true,
      },
    });
    expect(selectAgentsListVisibleState(state)).toBe(true);
  });
});

describe('selectShowTransferDialpad', () => {
  it('when showTransferDialpad is defined', () => {
    const state = fromJS({
      transferMenu: {
        showTransferDialpad: true,
      },
    });
    expect(selectShowTransferDialpad(state)).toBe(true);
  });
});

describe('selectTransferSearchInput', () => {
  it('gets updated transferSearchInput', () => {
    const state = fromJS({
      transferMenu: {
        transferSearchInput: 'mockTransferSearchInput',
      },
    });
    expect(selectTransferSearchInput(state)).toBe('mockTransferSearchInput');
  });
});

describe('selectTransferTabIndex', () => {
  it('gets updated transferTabIndex', () => {
    const state = fromJS({
      transferMenu: {
        transferTabIndex: 1,
      },
    });
    expect(selectTransferTabIndex(state)).toBe(1);
  });
});

describe('selectFocusedTransferItemIndex', () => {
  it('gets updated focusedTransferItemIndex', () => {
    const state = fromJS({
      transferMenu: {
        focusedTransferItemIndex: 3,
      },
    });
    expect(selectFocusedTransferItemIndex(state)).toBe(3);
  });
});

describe('selectUserAssignedTransferLists', () => {
  const mockedState = fromJS({
    transferMenu: {
      transferLists: {
        userAssignedTransferLists: [
          {
            id: 'mockInteractionTransferListId',
            name: 'mocktransferListName',
            endpoints: 'mockTransferListEndPoint',
          },
        ],
        userAssignedTransferListsLoadingState: true,
        userAssignedTransferListsVisibleState: {
          mockTransferListsVisibleState: true,
        },
        visibleStateOfAllUserAssignedTransferLists: true,
      },
    },
  });
  it('should return user assigned transfer lists', () => {
    expect(selectUserAssignedTransferLists(mockedState)).toMatchSnapshot();
  });
  it('should return loading state of user assigned transfer lists', () => {
    expect(
      selectUserAssignedTransferListsLoadingState(fromJS(mockedState))
    ).toBe(true);
  });
  it('should return user assigned transfer lists visible state', () => {
    expect(
      selectUserAssignedTransferListsVisibleState(mockedState)
    ).toMatchSnapshot();
  });
  it('should return visible state of all user assigned transfer lists', () => {
    expect(selectVisibleStateOfAllUserAssignedTrasferLists(mockedState)).toBe(
      true
    );
  });
});
