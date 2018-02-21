/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectAgentId } from 'containers/AgentDesktop/selectors';

import CircleIconButton from 'components/CircleIconButton';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class Mute extends React.PureComponent {
  setMute = () => {
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
          active={this.props.isMuted}
          onClick={this.setMute}
          style={styles.circleIconButtonRow}
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
};

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
});

export default connect(mapStateToProps)(Mute);
