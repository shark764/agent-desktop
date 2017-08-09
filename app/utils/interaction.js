/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

export const lastMessageFromInteraction = (interaction) => {
  if (
    interaction.channelType === 'messaging' ||
    interaction.channelType === 'sms'
  ) {
    if (interaction.messageHistory) {
      for (let i = interaction.messageHistory.length - 1; i >= 0; i -= 1) {
        // use the last non-system message
        if (interaction.messageHistory[i].type !== 'system') {
          return interaction.messageHistory[i];
        }
      }
    }
  }
  return undefined;
};
