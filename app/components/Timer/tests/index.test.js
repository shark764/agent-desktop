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

  describe('timeSince is not defined', () => {
    const timer = shallow(<Timer timer={{ tick: 5 }} />);
    it('uses the tick from the timer', () => {
      expect(timer).toMatchSnapshot();
    });
  });

  describe('format and style passed in', () => {
    const timer = shallow(
      <Timer format="mm:ss" timer={{ tick: 5 }} style={{ float: 'right' }} />
    );
    it('is used to format the time and style the component', () => {
      expect(timer).toMatchSnapshot();
    });
  });
});
