/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { Map, List } from 'immutable';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import { VoiceInteractionNotifications } from '../index';

describe('<VoiceInteractionNotifications />', () => {
  describe('with notification', () => {
    const notifications = new List([
      new Map({
        id: 'callbackRequest-id',
        messageKey: 'callbackRequest',
        messageValues: new Map({
          callbackNumber: '+15061234567',
          waitingFor: '10s',
        }),
        isDimissable: true,
      }),
    ]);
    it('renders correctly', () => {
      expect(
        shallow(
          <VoiceInteractionNotifications
            intl={getIntlContext()}
            interactionId="mockInteractionId"
            notifications={notifications}
            dismissInteractionNotification={() =>
              console.log('dismissInteractionNotification()')
            }
          />
        )
      ).toMatchSnapshot();
    });
  });
  describe('with no notifications', () => {
    it('renders nothing', () => {
      expect(
        shallow(
          <VoiceInteractionNotifications
            intl={getIntlContext()}
            dismissInteractionNotification={() =>
              console.log('dismissInteractionNotification()')
            }
          />
        )
      ).toMatchSnapshot();
    });
  });
});
