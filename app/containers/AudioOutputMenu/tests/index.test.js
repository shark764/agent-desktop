/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import { isToolbar } from 'utils/url';
import * as ADSelectors from 'containers/AgentDesktop/selectors';
import * as ANSelectors from 'containers/AgentNotificationsMenu/selectors';
import * as Selectors from '../selectors';
import * as Thunks from '../thunks';

import { AudioOutputMenu } from '..';

jest.mock('utils/url');
isToolbar.mockImplementation(() => false);

const ringtoneDevices = [
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
const speakerDevices = [
  { id: 'default', label: 'Default', isActive: false },
  {
    id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    label: 'Built-in Audio Analog Stereo',
    isActive: false,
  },
  {
    id: '6d4096a33f2ba164d976a9929c3936b2956644e0581085c8870c4272782db9fb',
    label: 'Plantronics C320 Analog Stereo',
    isActive: true,
  },
  {
    id: '807fbf9ab5fd57290d125721e10edaab372b2c52569513de20934e0a14971957',
    label: 'USG PnIXAu20o  Analog Stereo',
    isActive: false,
  },
];
const notificationDevices = [
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

jest.mock('react-redux', () => ({
  useSelector: jest.fn((fn) => fn()),
  useDispatch: () => jest.fn(),
}));

jest
  .spyOn(Selectors, 'selectActiveOutputRingtoneDevices')
  .mockReturnValue(ringtoneDevices);
jest.spyOn(Thunks, 'updateActiveOutputRingtoneDevice');
jest
  .spyOn(Selectors, 'selectActiveOutputSpeakerDevices')
  .mockReturnValue(speakerDevices);
jest.spyOn(Thunks, 'updateActiveOutputSpeakerDevice');
jest
  .spyOn(Selectors, 'selectActiveOutputNotificationDevices')
  .mockReturnValue(notificationDevices);
jest.spyOn(Thunks, 'updateActiveOutputNotificationDevice');

jest.spyOn(ADSelectors, 'selectCrmModule').mockReturnValue('none');
jest.spyOn(ANSelectors, 'selectAudioPreferences').mockReturnValue(true);

describe('<AudioOutputMenu />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders the audio output menu', () => {
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when devices lists are empty', () => {
    jest
      .spyOn(Selectors, 'selectActiveOutputRingtoneDevices')
      .mockReturnValueOnce([]);
    jest
      .spyOn(Selectors, 'selectActiveOutputSpeakerDevices')
      .mockReturnValueOnce([]);
    jest
      .spyOn(Selectors, 'selectActiveOutputNotificationDevices')
      .mockReturnValueOnce([]);
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when notifications are not enabled', () => {
    jest
      .spyOn(ANSelectors, 'selectAudioPreferences')
      .mockReturnValueOnce(false);
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is zendesk in desktop mode', () => {
    jest.spyOn(ADSelectors, 'selectCrmModule').mockReturnValueOnce('zendesk');
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is zendesk in toolbar mode', () => {
    isToolbar.mockImplementationOnce(() => true);
    jest.spyOn(ADSelectors, 'selectCrmModule').mockReturnValueOnce('zendesk');
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is not zendesk and notifications are not enabled in toolbar mode', () => {
    isToolbar.mockImplementationOnce(() => true);
    jest.spyOn(ADSelectors, 'selectCrmModule').mockReturnValueOnce('none');
    jest
      .spyOn(ANSelectors, 'selectAudioPreferences')
      .mockReturnValueOnce(false);
    const rendered = shallow(<AudioOutputMenu />);
    expect(rendered).toMatchSnapshot();
  });
});
