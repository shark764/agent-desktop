import { fromJS } from 'immutable';
import {
  selectActiveExtensionIsNotPstn,
  isCustomerNotConnected,
} from '../selectors';

const state = fromJS({
  agentDesktop: {
    interactions: [
      {
        channelType: 'voice',
        status: 'work-accepted',
        direction: 'inbound',
        isCallbackInteraction: true,
        customerConnected: false,
      },
    ],
    activeExtension: { type: 'webrtc' },
  },
});

describe('PhoneControlsActive', () => {
  describe('selectActiveExtensionIsNotPstn', () => {
    it('checks whether active extension is pstn or not', () => {
      expect(selectActiveExtensionIsNotPstn(state)).toEqual(true);
    });
  });
  describe('isCustomerNotConnected', () => {
    it('checks if customer end is not connected for callback interactions', () => {
      expect(isCustomerNotConnected(state)).toEqual(true);
    });
    it('checks if customer end is not connected for outbound voice interactions', () => {
      const updatedState = state.updateIn(
        ['agentDesktop', 'interactions', 0],
        (interaction) =>
          interaction
            .set('direction', 'outbound')
            .set('status', 'work-initiated')
      );
      expect(isCustomerNotConnected(updatedState)).toEqual(true);
    });
    it('checks if customer end is not connected for agent-initiated voice interactions', () => {
      const updatedState = state.updateIn(
        ['agentDesktop', 'interactions', 0],
        (interaction) =>
          interaction
            .set('direction', 'agent-initiated')
            .set('status', 'work-initiated')
            .set('customerConnected', true)
      );
      expect(isCustomerNotConnected(updatedState)).toEqual(false);
    });
    it('checks if customer end is not connected for non-voice interactions', () => {
      const updatedState = state.updateIn(
        ['agentDesktop', 'interactions', 0],
        (interaction) =>
          interaction.set('channelType', 'sms').delete('isCallbackInteraction')
      );
      expect(isCustomerNotConnected(updatedState)).toEqual(undefined);
    });
  });
});
