/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import {
  selectOutboundIdentifierListsForChannel,
  getSelectedOutboundIdentifier,
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
                channelType: 'voice',
                flowId: '1aa',
                value: '+111',
                active: false,
                id: '1bb',
              },
              {
                name: 'test2',
                channelType: 'email',
                flowId: '1aa',
                value: '+111',
                active: true,
                id: '1bb',
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
        ],
      },
    },
  });

  it('if outbound identifier list exist', () => {
    expect(
      selectOutboundIdentifierListsForChannel(fromJS(mockedState), {
        channelTypes: ['voice'],
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
    ).toEqual([]);
  });
});

describe('getSelectedOutboundIdentifier', () => {
  it('if selected outbound ANI', () => {
    const mockedStateSelected = fromJS({
      outboundAniSelect: {
        selectedOutboundIdentifier: {
          mockField: 'mock-value',
        },
      },
    });
    expect(
      getSelectedOutboundIdentifier(fromJS(mockedStateSelected))
    ).toMatchSnapshot();
  });

  it('if does not selected outbound ANI', () => {
    expect(
      getSelectedOutboundIdentifier(
        fromJS({
          outboundAniSelect: {},
        })
      )
    ).toBe(null);
  });
});
