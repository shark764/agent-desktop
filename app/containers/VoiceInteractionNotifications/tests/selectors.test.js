import { Map, List } from 'immutable';
import {
  selectActiveVoiceInteraction,
  selectActiveVoiceInteractionId,
  selectActiveVoiceInteractionNotifications,
} from 'containers/VoiceInteractionNotifications/selectors';

describe('selectActiveVoiceInteraction', () => {
  describe('there are voice and non-voice interactions', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            channelType: 'voice',
            status: 'work-initiated',
          }),
          new Map({
            channelType: 'sms',
            status: 'work-initiated',
          }),
        ]),
      }),
    });
    it('returns the voice interaction', () => {
      expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
    });
  });
  describe('voice interaction is work-accepting', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            channelType: 'voice',
            status: 'work-accepting',
          }),
        ]),
      }),
    });
    it('returns the voice interaction', () => {
      expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
    });
  });
  describe('voice interaction is work-accepted', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            channelType: 'voice',
            status: 'work-accepted',
          }),
        ]),
      }),
    });
    it('returns the voice interaction', () => {
      expect(selectActiveVoiceInteraction(mockedState)).toMatchSnapshot();
    });
  });
  describe('voice interaction is not an active status', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            channelType: 'voice',
            status: 'wrapup',
          }),
        ]),
      }),
    });
    it('returns nothing', () => {
      expect(selectActiveVoiceInteraction(mockedState)).toEqual(undefined);
    });
  });
});

describe('selectActiveVoiceInteractionId', () => {
  describe('there is a voice interaction', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            interactionId: 'mock-interaction-id',
            channelType: 'voice',
            status: 'work-initiated',
          }),
        ]),
      }),
    });
    it('returns the interaction id', () => {
      expect(selectActiveVoiceInteractionId(mockedState)).toEqual(
        'mock-interaction-id'
      );
    });
  });
  describe('there are no voice interactions', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List(),
      }),
    });
    it('returns the undefined', () => {
      expect(selectActiveVoiceInteractionId(mockedState)).toEqual(undefined);
    });
  });
});

describe('selectActiveVoiceInteractionNotifications', () => {
  describe('there is a voice interaction', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List([
          new Map({
            notifications: 'mock-notifications',
            channelType: 'voice',
            status: 'work-initiated',
          }),
        ]),
      }),
    });
    it('returns the interaction id', () => {
      expect(selectActiveVoiceInteractionNotifications(mockedState)).toEqual(
        'mock-notifications'
      );
    });
  });
  describe('there are no voice interactions', () => {
    const mockedState = new Map({
      agentDesktop: new Map({
        interactions: new List(),
      }),
    });
    it('returns the undefined', () => {
      expect(selectActiveVoiceInteractionNotifications(mockedState)).toEqual(
        undefined
      );
    });
  });
});
