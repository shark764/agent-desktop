/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { Timer } from '../index';

describe('<Timer />', () => {
  describe('timeSince is defined', () => {
    const timer = shallow(
      <Timer timeSince={-60000} timer={{ timestamp: 0 }} />
    );
    it('uses the difference of the timer', () => {
      expect(timer).toMatchSnapshot();
    });
  });

  describe('format and style passed in', () => {
    const timer = shallow(
      <Timer
        timeSince={1000}
        format="mm:ss"
        timer={{ timestamp: 1000 }}
        style={{ float: 'right' }}
      />
    );
    it('is used to format the time and style the component', () => {
      expect(timer).toMatchSnapshot();
    });
  });
});
