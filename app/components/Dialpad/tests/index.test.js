/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Dialpad } from '../index';
jest.mock('utils/url', () => ({
  isBeta: jest.fn(() => true),
}));

describe('<Dialpad />', () => {
  describe('when given required props', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Dialpad
          id="mockId"
          dialpadText="mockDialpadText"
          setDialpadText={() => {}}
          transfer={false}
          active={false}
          selectOutboundPhoneIdentification={() => {}}
          outboundPhoneIdentifier={{
            mockValue: 'mock-value',
          }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when inCall prop set to true', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <Dialpad
          id="mockId"
          dialpadText="mockDialpadText"
          setDialpadText={() => {}}
          inCall
          transfer={false}
          active={false}
          selectOutboundPhoneIdentification={() => {}}
          outboundPhoneIdentifier={{
            mockValue: 'mock-value',
          }}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when interactionId is set', () => {
    it('should render everything except the Outbound ANI selector', () => {
      const rendered = shallow(
        <Dialpad
          interactionId="mock-value"
          id="mockId"
          dialpadText="mockDialpadText"
          setDialpadText={() => {}}
          inCall
          transfer={false}
          active={false}
          selectOutboundPhoneIdentification={() => {}}
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
