/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import TimerMinutes from '../index';

const renderWithSeconds = (seconds) =>
  shallow(
    <TimerMinutes
      id="mockId"
      seconds={seconds}
    />
  );

describe('<TimerMinutes />', () => {
  describe('if seconds less than minute', () => {
    it('should render correctly', () => {
      expect(renderWithSeconds(1)).toMatchSnapshot();
    });
  });
  describe('if seconds equal minute', () => {
    it('should render correctly', () => {
      expect(renderWithSeconds(60)).toMatchSnapshot();
    });
  });
  describe('if seconds equal hour', () => {
    it('should render correctly', () => {
      expect(renderWithSeconds(3600)).toMatchSnapshot();
    });
  });
});
