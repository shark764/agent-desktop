/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Recording from '../Recording';

describe('<Recording />', () => {
  describe('with agentRecordingEnabled and false preventAgentRecordingUpdate', () => {
    describe('not in toolbarMode', () => {
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording={false}
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
        />
      );
      it('renders correctly', () => {
        expect(rendered).toMatchSnapshot();
      });
    });
    describe('in toolbarMode', () => {
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording={false}
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
        />,
        {
          context: { toolbarMode: true },
        }
      );
      it('renders correctly', () => {
        expect(rendered).toMatchSnapshot();
      });
    });

    describe('with isRecording', () => {
      beforeEach(() => {
        global.CxEngage = {
          interactions: {
            voice: {
              stopRecording: jest.fn(),
            },
          },
        };
      });
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
        />
      );
      it('calls CxEngage.interactions.voice.stopRecording with the interactionId', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(
          global.CxEngage.interactions.voice.stopRecording.mock.calls.length
        ).toBe(1);
        expect(
          global.CxEngage.interactions.voice.stopRecording.mock.calls[0][0]
        ).toEqual({ interactionId: 'mock-interaction-id' });
      });
    });
    describe('with false isRecording', () => {
      beforeEach(() => {
        global.CxEngage = {
          interactions: {
            voice: {
              startRecording: jest.fn(),
            },
          },
        };
      });
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording={false}
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
        />
      );
      it('calls CxEngage.interactions.voice.startRecording with the interactionId', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(
          global.CxEngage.interactions.voice.startRecording.mock.calls.length
        ).toBe(1);
        expect(
          global.CxEngage.interactions.voice.startRecording.mock.calls[0][0]
        ).toEqual({ interactionId: 'mock-interaction-id' });
      });
    });
  });

  describe('with agentRecordingEnabled false', () => {
    const rendered = shallow(
      <Recording
        interactionId="mock-interaction-id"
        isRecording={false}
        agentRecordingEnabled={false}
        preventAgentRecordingUpdate={false}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with preventAgentRecordingUpdate', () => {
    const rendered = shallow(
      <Recording
        interactionId="mock-interaction-id"
        isRecording={false}
        agentRecordingEnabled
        preventAgentRecordingUpdate
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
