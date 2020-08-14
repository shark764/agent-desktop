/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import {
  selectOutboundIdentifierListsForChannel,
  getSelectedOutboundEmailIdentifier,
  getSelectedOutboundPhoneIdentifier,
} from '../selectors';

describe('selectOutboundIdentifierListsForChannel', () => {
  const mockedState = fromJS({
    outboundAniSelect: {
      outboundIdentifierLists: {
        effective: [
          {
            name: 'test',
            active: true,
            id: '1',
            members: [
              {
                name: 'test1',
                channelType: 'voice',
                flowId: '1a',
                value: '+11',
                active: true,
                id: '1b',
              },
              {
                name: 'test2',
                channelType: 'sms',
                flowId: '1aa',
                value: '+111',
                active: true,
                id: '1bb',
              },
              {
                name: 'test3',
                channelType: 'email',
                flowId: '1aa',
                value: '+111',
                active: true,
                id: '1bb2',
              },
              {
                name: 'test4',
                channelType: 'sms',
                flowId: '1aa',
                value: '+111',
                active: false,
                id: '1bb4',
              },
            ],
          },
          {
            name: 'test',
            active: false,
            id: '1',
            members: [
              {
                name: 'test1',
                channelType: 'voice',
                flowId: '1a',
                value: '+11',
                active: true,
                id: '1b',
              },
            ],
          },
          {
            name: 'test2',
            active: true,
            id: '2',
            members: [
              {
                name: 'test1',
                channelType: 'voice',
                flowId: '1a',
                value: '+11',
                active: true,
                id: '1b',
              },
            ],
          },
        ],
      },
    },
  });
  it('if outbound identifier list exist', () => {
    expect(
      selectOutboundIdentifierListsForChannel(mockedState, {
        channelTypes: ['voice', 'sms', 'email'],
      })
    ).toMatchSnapshot();
  });
  it('Sort items from outbound lists', () => {
    const mockedStateUnsorted = fromJS({
      outboundAniSelect: {
        outboundIdentifierLists: {
          effective: [
            {
              name: 'test',
              active: true,
              id: '1',
              members: [
                {
                  name: 'Test A',
                  channelType: 'voice',
                  flowId: '1a',
                  value: '+11',
                  active: true,
                  id: '0001',
                },
                {
                  name: 'Test AA',
                  channelType: 'voice',
                  flowId: '1aa',
                  value: '+111',
                  active: true,
                  id: '0002',
                },
                {
                  name: 'Test D',
                  channelType: 'email',
                  flowId: '1aa',
                  value: '+111',
                  active: true,
                  id: '0003',
                },
                {
                  name: 'Test BZ',
                  channelType: 'sms',
                  flowId: '1aa',
                  value: '+111',
                  active: false,
                  id: '0004',
                },
                {
                  name: 'Test ABZ',
                  channelType: 'sms',
                  flowId: '1aa',
                  value: '+111',
                  active: false,
                  id: '0005',
                },
                {
                  name: 'Test 1A',
                  channelType: 'sms',
                  flowId: '1aa',
                  value: '+111',
                  active: false,
                  id: '0006',
                },
              ],
            },
            {
              name: 'test 2',
              active: false,
              id: '1',
              members: [
                {
                  name: 'Test 9A',
                  channelType: 'voice',
                  flowId: '1a',
                  value: '+11',
                  active: true,
                  id: '0007',
                },
                {
                  name: 'Test BZ',
                  channelType: 'sms',
                  flowId: '1aa',
                  value: '+111',
                  active: false,
                  id: '0004',
                },
              ],
            },
            {
              name: 'test 3',
              active: true,
              id: '2',
              members: [
                {
                  name: 'Test D12',
                  channelType: 'voice',
                  flowId: '1a',
                  value: '+11',
                  active: true,
                  id: '0008',
                },
                {
                  name: 'Test AA',
                  channelType: 'voice',
                  flowId: '1aa',
                  value: '+111',
                  active: true,
                  id: '0002',
                },
              ],
            },
          ],
        },
      },
    });

    expect(
      selectOutboundIdentifierListsForChannel(mockedStateUnsorted, {
        channelTypes: ['voice', 'sms', 'email'],
      })
    ).toMatchSnapshot();
  });

  it("if outbound identifier lists don't have items of passed channel types", () => {
    expect(
      selectOutboundIdentifierListsForChannel(mockedState, {
        channelTypes: ['work-item', 'messaging'],
      })
    ).toMatchSnapshot();
  });

  it('if outbound identifier list does not exist', () => {
    expect(
      selectOutboundIdentifierListsForChannel(
        fromJS({
          outboundAniSelect: {
            outboundIdentifierLists: undefined,
          },
        }),
        {
          channelTypes: undefined,
        }
      )
    ).toEqual(undefined);
  });
});

describe('getSelectedOutboundEmailIdentifier', () => {
  it('if selected outbound ANI', () => {
    const mockedStateSelected = fromJS({
      outboundAniSelect: {
        selectedEmailOutboundIdentifier: {
          mockField: 'mock-value',
        },
      },
    });
    expect(
      getSelectedOutboundEmailIdentifier(mockedStateSelected)
    ).toMatchSnapshot();
  });

  it('if does not selected outbound ANI', () => {
    expect(
      getSelectedOutboundEmailIdentifier(
        fromJS({
          outboundAniSelect: {},
        })
      )
    ).toBe(null);
  });
});

describe('getSelectedOutboundPhoneIdentifier', () => {
  it('if selected outbound ANI', () => {
    const mockedStateSelected = fromJS({
      outboundAniSelect: {
        selectedPhoneOutboundIdentifier: {
          mockField: 'mock-value',
        },
      },
    });
    expect(
      getSelectedOutboundPhoneIdentifier(mockedStateSelected)
    ).toMatchSnapshot();
  });

  it('if does not selected outbound ANI', () => {
    expect(
      getSelectedOutboundPhoneIdentifier(
        fromJS({
          outboundAniSelect: {},
        })
      )
    ).toBe(null);
  });
});
