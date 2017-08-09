/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { lastMessageFromInteraction } from '../interaction';

describe('lastMessageFromInteraction', () => {
  it('returns undefined channelTypes that are not sms nor messaging', () => {
    const interaction = { channelType: 'voice' };
    expect(undefined).toEqual(lastMessageFromInteraction(interaction));
  });
  it('returns undefined when messageHistory is not defined', () => {
    const interaction = { channelType: 'sms' };
    expect(undefined).toEqual(lastMessageFromInteraction(interaction));
  });
  it('returns the last non-system message', () => {
    const nonSystemMessage1 = { type: 'message', text: 'first message' };
    const nonSystemMessage2 = { type: 'agent', text: 'second message' };
    const systemMessage = { type: 'system', text: 'second message' };
    const interaction = {
      channelType: 'messaging',
      messageHistory: [nonSystemMessage1, nonSystemMessage2, systemMessage],
    };
    expect(nonSystemMessage2).toEqual(lastMessageFromInteraction(interaction));
  });
});
