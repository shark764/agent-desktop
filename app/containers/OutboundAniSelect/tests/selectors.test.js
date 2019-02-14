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
      selectOutboundIdentifierListsForChannel(fromJS(mockedState), {
        channelTypes: ['voice', 'sms', 'email'],
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
      getSelectedOutboundEmailIdentifier(fromJS(mockedStateSelected))
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
      getSelectedOutboundPhoneIdentifier(fromJS(mockedStateSelected))
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
