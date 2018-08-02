/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import { fromJS } from 'immutable';
import { isMessagingInteractionCopied } from '../selectors';

describe('isMessagingInteractionCopied', () => {
  const mockInteractions = [
    {
      interactionId: 'a',
      isCopied: false,
    },
    {
      interactionId: 'b',
      isCopied: true,
    },
  ];

  it("should return the value of interaction's isCopied attribute (false in this case)", () => {
    const mockedState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'a',
        newInteractionPanel: {},
        noInteractionContactPanel: {},
        currentCrmItemHistoryPanel: {},
        interactions: mockInteractions,
      },
    });
    expect(isMessagingInteractionCopied(mockedState)).toEqual(false);
  });

  it("should return the value of interaction's isCopied attribute (true in this case)", () => {
    const mockedState = fromJS({
      agentDesktop: {
        selectedInteractionId: 'b',
        newInteractionPanel: {},
        noInteractionContactPanel: {},
        currentCrmItemHistoryPanel: {},
        interactions: mockInteractions,
      },
    });
    expect(isMessagingInteractionCopied(mockedState)).toEqual(true);
  });
});
