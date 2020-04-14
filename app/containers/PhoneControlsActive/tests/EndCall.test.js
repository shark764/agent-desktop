/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { EndCall } from '../EndCall';

describe('<EndCall />', () => {
  it('renders correctly', () => {
    const rendered = shallow(
      <EndCall
        interactionId="mock-interaction-id"
        interactionStatusIsFatal
        setInteractionConfirmation={() => {}}
      />
    );
    expect(rendered).toMatchSnapshot();
  });

  describe('when interactionStatusIsFatal', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          end: jest.fn(),
        },
      };
    });
    const rendered = shallow(
      <EndCall
        interactionId="mock-interaction-id"
        interactionStatusIsFatal
        setInteractionConfirmation={() => {}}
      />
    );
    it('calls CxEngage.interactions.end when clicking on icon', () => {
      rendered.find('#endCallButton').simulate('click');
      expect(global.CxEngage.interactions.end.mock.calls.length).toBe(1);
      expect(global.CxEngage.interactions.end.mock.calls[0][0]).toEqual({
        interactionId: 'mock-interaction-id',
      });
    });
  });

  describe('when interactionStatusIsFatal is false', () => {
    const setInteractionConfirmation = jest.fn();
    const selectInteraction = jest.fn();
    const rendered = shallow(
      <EndCall
        interactionId="mock-interaction-id"
        interactionStatusIsFatal={false}
        setInteractionConfirmation={setInteractionConfirmation}
        selectInteraction={selectInteraction}
      />
    );
    it('calls setInteractionConfirmation when clicking on icon', () => {
      rendered.find('#endCallButton').simulate('click');
      expect(selectInteraction.mock.calls[0][0]).toBe('mock-interaction-id');
      expect(setInteractionConfirmation.mock.calls.length).toBe(1);
      expect(setInteractionConfirmation.mock.calls[0][0]).toBe(
        'mock-interaction-id'
      );
      expect(setInteractionConfirmation.mock.calls[0][1]).toBe(true);
    });
  });
});
