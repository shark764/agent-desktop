/*
 * Copyright © 2015-2020 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';

import { isToolbar } from 'utils/url';
import { selectCrmModule } from 'containers/AgentDesktop/selectors';
import { selectAudioPreferences } from 'containers/AgentNotificationsMenu/selectors';

import {
  selectActiveOutputRingtoneDevices,
  selectActiveOutputSpeakerDevices,
  selectActiveOutputNotificationDevices,
} from '../selectors';

import ConnectedAudioOutputMenu, { AudioOutputMenu } from '..';

jest.mock('utils/url');
isToolbar.mockImplementation(() => false);

const ringtoneDevices = [
  { id: 'default', label: 'Default', isActive: true },
  {
    id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    label: 'Built-in Audio Analog Stereo',
    isActive: true,
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
const updateActiveOutputRingtoneDevice = jest.fn();
const speakerDevices = [
  { id: 'default', label: 'Default', isActive: false },
  {
    id: 'aead4bb457d9b0aeeddb669d8e6fef68d9cf2379d25264d6948af1dbdea3259b',
    label: 'Built-in Audio Analog Stereo',
    isActive: true,
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
const updateActiveOutputSpeakerDevice = jest.fn();
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
const updateActiveOutputNotificationDevice = jest.fn();

jest.mock('containers/AgentDesktop/selectors');
selectCrmModule.mockImplementation(() => 'none');
jest.mock('containers/AgentNotificationsMenu/selectors');
selectAudioPreferences.mockImplementation(() => true);
jest.mock('../selectors');
selectActiveOutputRingtoneDevices.mockImplementation(() => ringtoneDevices);
selectActiveOutputSpeakerDevices.mockImplementation(() => speakerDevices);
selectActiveOutputNotificationDevices.mockImplementation(
  () => notificationDevices
);

describe('<AudioOutputMenu />', () => {
  const store = createStore((state) => state);
  const testProps = {
    store,
    ringtoneDevices,
    speakerDevices,
    notificationDevices,
    updateActiveOutputRingtoneDevice,
    updateActiveOutputSpeakerDevice,
    updateActiveOutputNotificationDevice,
    audioNotificationsEnabled: true,
    crmModule: 'none',
  };

  it('renders the audio output menu', () => {
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when devices lists are empty', () => {
    testProps.ringtoneDevices = [];
    testProps.speakerDevices = [];
    testProps.notificationDevices = [];
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when notifications are not enabled', () => {
    testProps.audioNotificationsEnabled = false;
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is zendesk in desktop mode', () => {
    testProps.crmModule = 'zendesk';
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is zendesk in toolbar mode', () => {
    isToolbar.mockImplementationOnce(() => true);
    testProps.crmModule = 'zendesk';
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu when crmModule is not zendesk and notifications are not enabled in toolbar mode', () => {
    isToolbar.mockImplementationOnce(() => true);
    testProps.crmModule = 'none';
    testProps.audioNotificationsEnabled = false;
    const rendered = shallow(<AudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu connected with redux', () => {
    const rendered = shallow(<ConnectedAudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu connected with redux when notifications are not available', () => {
    selectAudioPreferences.mockImplementationOnce(() => false);
    const rendered = shallow(<ConnectedAudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });

  it('renders the audio output menu connected with redux when notifications are not available in zendesk mode', () => {
    isToolbar.mockImplementationOnce(() => true);
    selectCrmModule.mockImplementationOnce(() => 'zendesk');
    selectAudioPreferences.mockImplementationOnce(() => false);
    const rendered = shallow(<ConnectedAudioOutputMenu {...testProps} />);
    expect(rendered).toMatchSnapshot();
  });
});
