/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Toggle from 'react-toggle';
import IconSVG from 'components/IconSVG';
import 'assets/css/react-toggle-style.css';

import { toggleIsRecording } from 'containers/AgentDesktop/actions';

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
  loadingIcon: {
    float: 'right',
  },
};

export class Recording extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (prevProps.isRecording !== this.props.isRecording) {
      clearTimeout(this.timer);
    }
  }

  setRecording = () => {
    this.props.toggleIsRecording(this.props.interactionId, true);
    // timer is for if flow doesn't send us a 'recording-start/end-received', we reset so the user can try again
    this.timer = setTimeout(
      () => this.props.toggleIsRecording(this.props.interactionId, false),
      15000
    );
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
          disabled={this.props.isTogglingRecording}
        />
      );
      if (this.context.toolbarMode) {
        return (
          <div id="recordingContainer" style={styles.recordingContainerToolbar}>
            <div>
              <FormattedMessage {...messages.rec} />
            </div>
            {this.props.isTogglingRecording ? (
              <IconSVG id="loadingConfirm" name="loading" width="24px" />
            ) : (
              toggle
            )}
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
              {this.props.isTogglingRecording ? (
                <IconSVG
                  id="loadingConfirm"
                  name="loading"
                  width="24px"
                  style={styles.loadingIcon}
                />
              ) : (
                toggle
              )}
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
  isTogglingRecording: PropTypes.bool.isRequired,
  toggleIsRecording: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleIsRecording: (interactionId, isRecording) =>
      dispatch(toggleIsRecording(interactionId, isRecording)),
    dispatch,
  };
}

Recording.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default connect(
  null,
  mapDispatchToProps
)(Recording);
