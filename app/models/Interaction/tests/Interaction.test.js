import { List } from 'immutable';
import * as uuid from 'utils/uuid';
import Interaction from '../Interaction';

Date.now = jest.fn(() => 0);
Math.random = jest.fn(() => 0.99);
uuid.generateUUID = jest.fn(() => 'mock-uuid');

describe('Interaction', () => {
  describe('with all the params', () => {
    const interaction = new Interaction({
      interactionId: 'mock-interaction-id',
      channelType: 'mock-channel-type',
      autoAnswer: true,
      direction: 'mock-direction',
      timeout: 0,
      status: 'mock-status',
      contact: {
        id: 'mock-contact-id',
      },
      hideNewInteractionPanelOnWorkAccepted: true,
      initiatedByCurrentAgent: true,
      contactMode: 'mock-contact-mode',
      isSidePanelCollapsed: false,
      subject: 'mock-subject',
      toolbarMode: true,
      timeAccepted: 'mock-time-accepted',
      callbackRequest: {
        callbackNumber: 'mock-callback-number',
        callbackRequestedTime: 0,
      },
    });
    it('adds the params to the object', () => {
      expect(interaction).toMatchSnapshot();
    });
  });

  describe('with no params', () => {
    const interaction = new Interaction({});
    it('sets defaults, ignores appropriate undefineds', () => {
      expect(interaction).toMatchSnapshot();
    });
  });

  describe('voice', () => {
    const interaction = new Interaction({
      channelType: 'voice',
      toolbarFeatures: {
        recordingUpdate: true,
      },
    });
    it('sets muted to false', () => {
      expect(interaction.muted).toEqual(false);
    });
    it('sets agentRecordingEnabled to value passed in', () => {
      expect(interaction.agentRecordingEnabled).toEqual(true);
    });
  });

  describe('sms', () => {
    const interaction = new Interaction({
      channelType: 'sms',
      customer: 'mock-customer',
    });
    it('sets customerAvatarIndex to a random value between 0 and 16', () => {
      expect(interaction.customerAvatarIndex).toEqual(16);
    });
    it('sets messageHistory to an empty list', () => {
      expect(interaction.messageHistory).toEqual(new List());
    });
    it('sets customer to the value passed in', () => {
      expect(interaction.customer).toEqual('mock-customer');
    });
    it('sets currentMessage to ""', () => {
      expect(interaction.currentMessage).toEqual('');
    });
  });

  describe('messaging', () => {
    const interaction = new Interaction({
      channelType: 'messaging',
    });
    it('sets customerAvatarIndex to a random value between 0 and 16', () => {
      expect(interaction.customerAvatarIndex).toEqual(16);
    });
    it('sets messageHistory to an empty list', () => {
      expect(interaction.messageHistory).toEqual(new List());
    });
    it('sets currentMessage to ""', () => {
      expect(interaction.currentMessage).toEqual('');
    });
  });

  describe('email', () => {
    const interaction = new Interaction({
      channelType: 'email',
      customer: 'mock-customer',
    });
    it('sets customer to the value passed in', () => {
      expect(interaction.customer).toEqual('mock-customer');
    });
  });

  describe('outbound email', () => {
    const interaction = new Interaction({
      channelType: 'email',
      direction: 'outbound',
    });
    it('sets emailReply', () => {
      expect(interaction.emailReply).toMatchSnapshot();
    });
  });
});