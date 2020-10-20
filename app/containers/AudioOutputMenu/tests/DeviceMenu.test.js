/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import PreferenceOption from 'components/PreferenceOption';

import { DeviceMenu } from '../DeviceMenu';

const devices = [
  { id: 'default', label: 'Default', isActive: false },
  {
    id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    label: 'Built-in Audio Analog Stereo',
    isActive: false,
  },
  {
    id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    label: 'Plantronics C320 Analog Stereo',
    isActive: false,
  },
  {
    id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
    label: 'USG PnIXAu20o  Analog Stereo',
    isActive: true,
  },
];

describe('<DeviceMenu />', () => {
  let rendered;
  const setOpen = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');
  useStateSpy.mockImplementation((open) => [open, setOpen]);

  beforeEach(() => {
    rendered = shallow(
      <DeviceMenu
        devices={devices}
        setDeviceAsActive={() => {}}
        audio="media"
        label={{
          id: 'app.containers.AudioOutputMenu.media',
          defaultMessage: 'Media',
        }}
      />
    );
  });

  describe('collection of devices is passed in', () => {
    it('renders correctly', () => {
      expect(rendered).toMatchSnapshot();
    });
  });

  describe('calling header "setOpen" method', () => {
    it('should call setOpen when PreferenceOption is clicked', () => {
      rendered
        .find(PreferenceOption)
        .props()
        .setPreferenceSelected();

      expect(rendered).toMatchSnapshot();
    });

    it('renders DeviceOption list when empty collection of devices is passed in', () => {
      rendered = shallow(
        <DeviceMenu
          devices={[]}
          setDeviceAsActive={() => {}}
          audio="media"
          label={{
            id: 'app.containers.AudioOutputMenu.media',
            defaultMessage: 'Media',
          }}
        />
      );
      rendered
        .find(PreferenceOption)
        .props()
        .setPreferenceSelected();

      expect(rendered).toMatchSnapshot();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
