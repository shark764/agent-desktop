/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import TimeStat from '../index';

describe('<TimeStat />', () => {
  describe('when given required props, intl, and unit', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <TimeStat.WrappedComponent
          id="mockTimeStatId"
          intl={getIntlContext()}
          time={10}
          unit="millis"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when given required props, intl, and unit. Time in hours, minutes and seconds.', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <TimeStat.WrappedComponent
          id="mockTimeStatId"
          intl={getIntlContext()}
          time={1593031011}
          unit="millis"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when given required props, intl, and unit. Time in hours and minutes.', () => {
    it('should render correctly', () => {
      const rendered = shallow(
        <TimeStat.WrappedComponent
          id="mockTimeStatId"
          intl={getIntlContext()}
          time={90061}
          unit="millis"
        />
      );
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('when passed a unit not millis', () => {
    it('should throw an error', () => {
      let error;
      try {
        shallow(
          <TimeStat.WrappedComponent
            id="mockTimeStatId"
            intl={getIntlContext()}
            time={1}
            unit="other"
          />
        );
      } catch (e) {
        error = e;
      }
      expect(error.message).toEqual('Not handling time not in millis');
    });
  });
});
