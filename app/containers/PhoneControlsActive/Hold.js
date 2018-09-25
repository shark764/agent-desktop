/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectAgentId } from 'containers/AgentDesktop/selectors';
import { toggleInteractionIsHolding } from 'containers/AgentDesktop/actions';

import CircleIconButton from 'components/CircleIconButton';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class Hold extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (prevProps.isOnHold !== this.props.isOnHold) {
      clearTimeout(this.timer);
    }
  }

  setHold = () => {
    this.props.toggleInteractionIsHolding(this.props.interactionId, true);
    // timer is for if flow doesn't send us a 'customer-hold/resume-received', we reset so the user can try again
    this.timer = setTimeout(
      () =>
        this.props.toggleInteractionIsHolding(this.props.interactionId, false),
      15000
    );
    if (this.props.isOnHold) {
      CxEngage.interactions.voice.customerResume({
        interactionId: this.props.interactionId,
      });
    } else {
      CxEngage.interactions.voice.customerHold({
        interactionId: this.props.interactionId,
      });
    }
  };

  render() {
    if (this.props.canUpdateHold) {
      return (
        <CircleIconButton
          id="holdButton"
          name="hold"
          active={this.props.isOnHold}
          onClick={this.setHold}
          style={styles.circleIconButtonRow}
          loading={this.props.isHolding}
        />
      );
    }
    return null;
  }
}

Hold.propTypes = {
  interactionId: PropTypes.string.isRequired,
  isOnHold: PropTypes.bool.isRequired,
  canUpdateHold: PropTypes.bool.isRequired,
  toggleInteractionIsHolding: PropTypes.func.isRequired,
  isHolding: PropTypes.bool.isRequired,
};
function mapDispatchToProps(dispatch) {
  return {
    toggleInteractionIsHolding: (interactionId, isHolding) =>
      dispatch(toggleInteractionIsHolding(interactionId, isHolding)),
    dispatch,
  };
}

const mapStateToProps = (state, props) => ({
  agentId: selectAgentId(state, props),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hold);
