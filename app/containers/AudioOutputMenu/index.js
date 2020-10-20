import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

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

export const AudioOutputMenu = () => {
  const ringtoneDevices = useSelector(selectActiveOutputRingtoneDevices);
  const speakerDevices = useSelector(selectActiveOutputSpeakerDevices);
  const notificationDevices = useSelector(
    selectActiveOutputNotificationDevices
  );
  const audioNotificationsEnabled = useSelector(selectAudioPreferences);
  const crmModule = useSelector(selectCrmModule);
  const dispatch = useDispatch();

  return (
    <>
      {(audioNotificationsEnabled ||
        !isToolbar() ||
        crmModule === 'zendesk') && (
        <DeviceMenu
          audio="media"
          label={messages.media}
          devices={notificationDevices}
          setDeviceAsActive={(id) =>
            dispatch(updateActiveOutputNotificationDevice(id))}
        />
      )}

      <DeviceMenu
        audio="ringtone"
        label={messages.ringtone}
        devices={ringtoneDevices}
        setDeviceAsActive={(id) =>
          dispatch(updateActiveOutputRingtoneDevice(id))}
      />

      <DeviceMenu
        audio="voice"
        label={messages.voice}
        devices={speakerDevices}
        setDeviceAsActive={(id) =>
          dispatch(updateActiveOutputSpeakerDevice(id))}
      />
    </>
  );
};

export default AudioOutputMenu;
