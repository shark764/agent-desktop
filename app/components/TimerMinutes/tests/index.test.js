/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { TimerMinutes } from '../index';

const renderWithTimeSince = (timeSince) =>
  shallow(<TimerMinutes timer={{ timestamp: 0 }} timeSince={timeSince} />);

describe('<TimerMinutes />', () => {
  Date.now = jest.fn(() => 0);

  describe('timeSince difference less than a minute', () => {
    const timerMinutes = renderWithTimeSince(-1);
    it('should render "Just now"', () => {
      expect(timerMinutes).toMatchSnapshot();
    });
  });
  describe('timeSince difference less than an hour', () => {
    const timerMinutes = renderWithTimeSince(-120000);
    it('should render in minutes "m"', () => {
      expect(timerMinutes).toMatchSnapshot();
    });
  });
  describe('timeSince difference greater than an hour', () => {
    const timerMinutes = renderWithTimeSince(-7200000);
    it('should render in hours "h"', () => {
      expect(timerMinutes).toMatchSnapshot();
    });
  });
});
