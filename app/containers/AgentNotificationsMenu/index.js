import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import CheckedIconSVG from 'components/CheckedIconSVG';

import { selectAudioPreferences, selectVisualPreferences } from './selectors';
import {
  toggleAudioNotificationsPreference,
  toggleVisualNotificationsPreference,
} from './thunks';
import messages from './messages';

const NotificationOption = styled.div`
  padding: 5px;
  cursor: pointer;
  text-overflow: ellipsis;
  &:not([disabled]):hover {
    background-color: #def8fe;
  }
`;

const CheckStatus = styled(CheckedIconSVG)`
  float: right;
`;

export function AgentNotificationsMenu() {
  const audioNotificationsEnabled = useSelector(selectAudioPreferences);
  const visualNotificationsEnabled = useSelector(selectVisualPreferences);
  const dispatch = useDispatch();

  return (
    <>
      <NotificationOption
        id="audioNotificationOption"
        key="audioNotificationOption"
        onClick={() => dispatch(toggleAudioNotificationsPreference())}
      >
        <FormattedMessage {...messages.audio} />
        {audioNotificationsEnabled && (
          <CheckStatus size={17} alt="selected" fillColor="black" />
        )}
      </NotificationOption>
      {window.parent === window && (
        <NotificationOption
          id="visualNotificationOption"
          key="visualNotificationOption"
          onClick={() => dispatch(toggleVisualNotificationsPreference())}
        >
          <FormattedMessage {...messages.visual} />
          {visualNotificationsEnabled && (
            <CheckStatus size={17} alt="selected" fillColor="black" />
          )}
        </NotificationOption>
      )}
    </>
  );
}

export default AgentNotificationsMenu;
