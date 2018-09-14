import { fromJS } from 'immutable';

import { selectAgents } from '../selectors';

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
