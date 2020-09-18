import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isToolbar } from 'utils/url';
import { selectCrmModule } from 'containers/AgentDesktop/selectors';
import { selectAudioPreferences } from 'containers/AgentNotificationsMenu/selectors';
import {
  selectActiveOutputRingtoneDevices,
  selectActiveOutputSpeakerDevices,
  selectActiveOutputNotificationDevices,
} from './selectors';
import {
  updateActiveOutputRingtoneDevice,
  updateActiveOutputSpeakerDevice,
  updateActiveOutputNotificationDevice,
} from './thunks';
import messages from './messages';
import DeviceMenu from './DeviceMenu';

/**
 * **********************************
 * Twilio.Device.audio
 * https://www.twilio.com/docs/voice/client/javascript/device#audio
 * **********************************
 *
 * Available Devices:
 *    https://www.twilio.com/docs/voice/client/javascript/device#audioavailableoutputdevices
 *
 *    A Map containing the MediaDeviceInfo object of all available input devices (hardware devices
 *    capable of providing an input audio stream), indexed by deviceId.
 *
 * Media/Notification:
 *    https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
 *
 *    The Audio() constructor creates and returns a new HTMLAudioElement which can be either
 *    attached to a document for the user to interact with and/or listen to,
 *    or can be used offscreen to manage and play audio.
 *
 * Ringtone:
 *    https://www.twilio.com/docs/voice/client/javascript/device#twiliodeviceaudioringtonedevices
 *
 *    ringtoneDevices is an AudioOutputCollection that controls which output devices are used to
 *    play the ringing sound when receiving an incoming call.
 *
 * voice:
 *    https://www.twilio.com/docs/voice/client/javascript/device#twiliodeviceaudiospeakerdevices
 *
 *    speakerDevices is an AudioOutputCollection that controls which output devices are used to
 *    play standard speaker sounds.
 */

export const AudioOutputMenu = (props) => (
  <Fragment>
    {(props.audioNotificationsEnabled ||
      !isToolbar() ||
      props.crmModule === 'zendesk') && (
      <DeviceMenu
        audio="media"
        label={messages.media}
        devices={props.notificationDevices}
        setDeviceAsActive={props.updateActiveOutputNotificationDevice}
      />
    )}

    <DeviceMenu
      audio="ringtone"
      label={messages.ringtone}
      devices={props.ringtoneDevices}
      setDeviceAsActive={props.updateActiveOutputRingtoneDevice}
    />

    <DeviceMenu
      audio="voice"
      label={messages.voice}
      devices={props.speakerDevices}
      setDeviceAsActive={props.updateActiveOutputSpeakerDevice}
    />
  </Fragment>
);

const mapStateToProps = (state, props) => ({
  ringtoneDevices: selectActiveOutputRingtoneDevices(state, props),
  speakerDevices: selectActiveOutputSpeakerDevices(state, props),
  notificationDevices: selectActiveOutputNotificationDevices(state, props),
  audioNotificationsEnabled: selectAudioPreferences(state, props),
  crmModule: selectCrmModule(state, props),
});

const actions = {
  updateActiveOutputRingtoneDevice,
  updateActiveOutputSpeakerDevice,
  updateActiveOutputNotificationDevice,
};

AudioOutputMenu.propTypes = {
  ringtoneDevices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  speakerDevices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  notificationDevices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  audioNotificationsEnabled: PropTypes.bool,
  updateActiveOutputRingtoneDevice: PropTypes.func.isRequired,
  updateActiveOutputSpeakerDevice: PropTypes.func.isRequired,
  updateActiveOutputNotificationDevice: PropTypes.func.isRequired,
  crmModule: PropTypes.string,
};

export default connect(
  mapStateToProps,
  actions
)(AudioOutputMenu);
