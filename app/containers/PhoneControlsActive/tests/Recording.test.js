/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Recording } from '../Recording';

describe('<Recording />', () => {
  describe('with agentRecordingEnabled and false preventAgentRecordingUpdate', () => {
    describe('not in toolbarMode', () => {
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording={false}
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
          isTogglingRecording={false}
          toggleIsRecording={() => {}}
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
          isTogglingRecording={false}
          toggleIsRecording={() => {}}
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
      const mockToggleIsRecording = jest.fn();
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
          toggleIsRecording={mockToggleIsRecording}
          isTogglingRecording={false}
        />
      );
      it('calls toggleIsRecording with the interactionId and true as parameters', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(mockToggleIsRecording).toMatchSnapshot();
      });
      it('Calls CxEngage.interactions.voice.stopRecording with the interactionId', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(CxEngage.interactions.voice.stopRecording).toMatchSnapshot();
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
      const mockToggleIsRecording = jest.fn();
      const rendered = shallow(
        <Recording
          interactionId="mock-interaction-id"
          isRecording={false}
          agentRecordingEnabled
          preventAgentRecordingUpdate={false}
          toggleIsRecording={mockToggleIsRecording}
          isTogglingRecording={false}
        />
      );
      it('calls toggleIsRecording with the interactionId and true as parameters', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(mockToggleIsRecording).toMatchSnapshot();
      });
      it('calls CxEngage.interactions.voice.startRecording with the interactionId', () => {
        rendered.find('#toggleRecording').simulate('change');
        expect(CxEngage.interactions.voice.startRecording).toMatchSnapshot();
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
        isTogglingRecording={false}
        toggleIsRecording={() => {}}
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
        isTogglingRecording={false}
        toggleIsRecording={() => {}}
      />
    );
    it('renders nothing', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('with isTogglingRecording', () => {
    const rendered = shallow(
      <Recording
        interactionId="mock-interaction-id"
        isRecording={false}
        agentRecordingEnabled
        isTogglingRecording
        toggleIsRecording={() => {}}
        preventAgentRecordingUpdate={false}
      />
    );
    it('renders a loading icon', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
