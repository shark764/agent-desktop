/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { WrapUpToggle } from '../index';

describe('<WrapUpToggle />', () => {
  it('should render correctly', () => {
    const rendered = shallow(
      <WrapUpToggle
        interaction={{
          interactionId: 'aaa',
          status: 'work-accepted',
          wrapupDetails: {},
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  describe('with interaction.wrapupDetails.wrapupEnabled', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          disableWrapup: jest.fn(),
        },
      };
    });
    const interaction = {
      interactionId: 'aaa',
      status: 'work-accepted',
      wrapupDetails: {
        wrapupEnabled: true,
      },
    };
    const mockUpdateWrapupDetails = jest.fn();
    const rendered = shallow(
      <WrapUpToggle
        interaction={interaction}
        updateWrapupDetails={mockUpdateWrapupDetails}
      />
    );
    it('calls updateWrapupDetails with loadingWrapupStatusUpdate equals to true', () => {
      rendered.find('#wrapUpToggle').simulate('change');
      expect(mockUpdateWrapupDetails).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.disableWrapup with the interactionId', () => {
      rendered.find('#wrapUpToggle').simulate('change');
      expect(CxEngage.interactions.disableWrapup).toMatchSnapshot();
    });
  });
  describe('with interaction.wrapupDetails.wrapupEnabled false', () => {
    beforeEach(() => {
      global.CxEngage = {
        interactions: {
          enableWrapup: jest.fn(),
        },
      };
    });
    const interaction = {
      interactionId: 'aaa',
      status: 'work-accepted',
      wrapupDetails: {
        wrapupEnabled: false,
      },
    };
    const mockUpdateWrapupDetails = jest.fn();
    const rendered = shallow(
      <WrapUpToggle
        interaction={interaction}
        updateWrapupDetails={mockUpdateWrapupDetails}
      />
    );
    it('calls updateWrapupDetails with loadingWrapupStatusUpdate equals to true', () => {
      rendered.find('#wrapUpToggle').simulate('change');
      expect(mockUpdateWrapupDetails).toMatchSnapshot();
    });
    it('calls CxEngage.interactions.enableWrapup with the interactionId', () => {
      rendered.find('#wrapUpToggle').simulate('change');
      expect(CxEngage.interactions.enableWrapup).toMatchSnapshot();
    });
  });
  it('with interaction.isWrappingUp should render a loading icon', () => {
    const rendered = shallow(
      <WrapUpToggle
        interaction={{
          interactionId: 'aaa',
          status: 'work-accepted',
          wrapupDetails: {},
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
});
