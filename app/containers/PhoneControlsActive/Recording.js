/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Toggle from 'react-toggle';
import 'assets/css/react-toggle-style.css';

import messages from './messages';

const styles = {
  recordingContainerToolbar: {
    position: 'absolute',
    right: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  recordingContainer: {
    padding: '0 12px 14px',
  },
  recordingText: {
    fontSize: '14px',
  },
  recordingToggleContainer: {
    float: 'right',
    verticalAlign: 'top',
    height: 20,
    marginTop: 2,
  },
  toggleRecordingLabel: {
    fontSize: '12px',
    verticalAlign: 'top',
    lineHeight: '21px',
    marginRight: '3px',
  },
};

export default class Recording extends React.PureComponent {
  setRecording = () => {
    if (this.props.isRecording) {
      CxEngage.interactions.voice.stopRecording({
        interactionId: this.props.interactionId,
      });
    } else {
      CxEngage.interactions.voice.startRecording({
        interactionId: this.props.interactionId,
      });
    }
  };

  render() {
    if (
      this.props.agentRecordingEnabled &&
      !this.props.preventAgentRecordingUpdate
    ) {
      const toggle = (
        <Toggle
          id="toggleRecording"
          icons={false}
          onChange={this.setRecording}
          checked={this.props.isRecording}
        />
      );
      if (this.context.toolbarMode) {
        return (
          <div id="recordingContainer" style={styles.recordingContainerToolbar}>
            <div>
              <FormattedMessage {...messages.rec} />
            </div>
            {toggle}
          </div>
        );
      } else {
        return (
          <div id="recordingContainer" style={styles.recordingContainer}>
            <span style={styles.recordingText}>
              <FormattedMessage {...messages.recording} />
            </span>
            <span style={styles.recordingToggleContainer}>
              <label
                htmlFor="toggleRecording"
                style={styles.toggleRecordingLabel}
              >
                {this.props.isRecording ? (
                  <FormattedMessage {...messages.on} />
                ) : (
                  <FormattedMessage {...messages.off} />
                )}
              </label>
              {toggle}
            </span>
          </div>
        );
      }
    }
    return null;
  }
}

Recording.propTypes = {
  interactionId: PropTypes.string.isRequired,
  isRecording: PropTypes.bool.isRequired,
  agentRecordingEnabled: PropTypes.bool.isRequired,
  preventAgentRecordingUpdate: PropTypes.bool.isRequired,
};

Recording.contextTypes = {
  toolbarMode: PropTypes.bool,
};
