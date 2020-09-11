/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';

import StyledDeviceOption, { DeviceOption } from '../DeviceOption';

const device = {
  id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
  label: 'USG PnIXAu20o  Analog Stereo',
  isActive: true,
};

describe('<DeviceOption />', () => {
  describe('output device is passed in', () => {
    const handleClick = jest.fn();
    const rendered = shallow(
      <DeviceOption
        device={device}
        handleClick={handleClick}
        disabled={false}
      />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
    it('calls setDeviceAsActive when clicked', () => {
      rendered
        .find(
          '#audiooutput-DeviceOption-807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957'
        )
        .simulate('click');
      expect(handleClick).toBeCalledWith(
        '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957'
      );
    });
  });
  describe('output device is disabled', () => {
    const handleClick = jest.fn();
    const rendered = shallow(
      <DeviceOption device={device} handleClick={handleClick} disabled />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
    it('should avoid calling setDeviceAsActive when disabled', () => {
      rendered
        .find(
          '#audiooutput-DeviceOption-807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957'
        )
        .simulate('click');
      expect(handleClick).toHaveBeenCalledTimes(0);
    });
  });
  describe('output device is not active', () => {
    const handleClick = jest.fn();
    const rendered = shallow(
      <DeviceOption
        device={{ ...device, isActive: false }}
        handleClick={handleClick}
        disabled={false}
      />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
    it('should fire a call to setDeviceAsActive when is not active', () => {
      rendered
        .find(
          '#audiooutput-DeviceOption-807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957'
        )
        .simulate('click');
      expect(handleClick).toBeCalledWith(
        '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957'
      );
    });
  });
  describe('empty data of device is passed in', () => {
    const rendered = shallow(
      <DeviceOption device={{}} handleClick={() => {}} disabled={false} />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
  describe('renders output device when is not disabled', () => {
    const handleClick = jest.fn();
    const rendered = mount(
      <StyledDeviceOption
        device={device}
        handleClick={handleClick}
        disabled={false}
      />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
  describe('renders output device when is disabled', () => {
    const handleClick = jest.fn();
    const rendered = mount(
      <StyledDeviceOption device={device} handleClick={handleClick} disabled />
    );
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
  });
});
