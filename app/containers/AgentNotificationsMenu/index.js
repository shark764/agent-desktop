import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import { isIeEleven } from 'utils/browser';

import Icon from 'components/Icon';

import { selectAudioPreferences, selectVisualPreferences } from './selectors';
import {
  toggleAudioNotificationsPreference,
  toggleVisualNotificationsPreference,
} from './actions';
import messages from './messages';

const styles = {
  notificationOption: {
    padding: '5px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#DEF8FE',
    },
  },
  checkStatus: {
    float: 'right',
  },
};

export function AgentNotificationsMenu(props) {
  return (
    <Fragment>
      <div
        id="audioNotificationOption"
        key="audioNotificationOption"
        onClick={props.toggleAudioNotificationsPreference}
        style={styles.notificationOption}
      >
        <FormattedMessage {...messages.audio} />
        {props.audioNotificationsEnabled && (
          <Icon name="checkStatus" style={styles.checkStatus} />
        )}
      </div>
      {!isIeEleven() &&
        window.parent === window && (
        <div
          id="visualNotificationOption"
          key="visualNotificationOption"
          onClick={props.toggleVisualNotificationsPreference}
          style={styles.notificationOption}
        >
          <FormattedMessage {...messages.visual} />
          {props.visualNotificationsEnabled && (
            <Icon name="checkStatus" style={styles.checkStatus} />
          )}
        </div>
      )}
    </Fragment>
  );
}

function mapStateToProps(state, props) {
  return {
    audioNotificationsEnabled: selectAudioPreferences(state, props),
    visualNotificationsEnabled: selectVisualPreferences(state, props),
  };
}

const actions = {
  toggleAudioNotificationsPreference,
  toggleVisualNotificationsPreference,
};

AgentNotificationsMenu.propTypes = {
  audioNotificationsEnabled: PropTypes.bool,
  visualNotificationsEnabled: PropTypes.bool,
  toggleAudioNotificationsPreference: PropTypes.func.isRequired,
  toggleVisualNotificationsPreference: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  actions
)(Radium(AgentNotificationsMenu));
