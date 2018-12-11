/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectAgentId } from 'containers/AgentDesktop/selectors';
import { toggleInteractionIsMuting } from 'containers/AgentDesktop/actions';

import CircleIconButton from 'components/CircleIconButton';
import messages from './messages';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class Mute extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (prevProps.isMuted !== this.props.isMuted) {
      clearTimeout(this.timer);
    }
  }

  setMute = () => {
    this.props.toggleInteractionIsMuting(this.props.interactionId, true);
    // timer is for if flow doesn't send us a 'resource-mute/unmute-received', we reset so the user can try again
    this.timer = setTimeout(
      () =>
        this.props.toggleInteractionIsMuting(this.props.interactionId, false),
      15000
    );
    if (this.props.isMuted) {
      CxEngage.interactions.voice.unmute({
        interactionId: this.props.interactionId,
        targetResourceId: this.props.agentId,
      });
    } else {
      CxEngage.interactions.voice.mute({
        interactionId: this.props.interactionId,
        targetResourceId: this.props.agentId,
      });
    }
  };

  render() {
    if (!this.props.meOnHold) {
      return (
        <CircleIconButton
          id="muteButton"
          name="mute"
          title={!this.props.isMuted ? messages.mute : messages.unMute}
          active={this.props.isMuted}
          onClick={this.setMute}
          style={styles.circleIconButtonRow}
          loading={this.props.isMuting}
        />
      );
    }
    return null;
  }
}

Mute.propTypes = {
  interactionId: PropTypes.string.isRequired,
  isMuted: PropTypes.bool.isRequired,
  meOnHold: PropTypes.bool,
  agentId: PropTypes.string.isRequired,
  toggleInteractionIsMuting: PropTypes.func.isRequired,
  isMuting: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    toggleInteractionIsMuting: (interactionId, isMuting) =>
      dispatch(toggleInteractionIsMuting(interactionId, isMuting)),
    dispatch,
  };
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mute);
