/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * CancelButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';

import Button from 'components/Button';

import { cancelClickToDial } from 'containers/AgentDesktop/actions';

import messages from './messages';

const styles = {
  cancelInteractionBtn: {
    margin: '10px 0 0 auto',
    padding: '.25em .5em',
    maxWidth: '65px',
    pointerEvents: 'auto',
  },
};

export class CancelButton extends React.Component {
  cancelInteraction = (e) => {
    // adding this to prevent other events from bubbling up - namely the
    // event to start the interaction which sits on the same div as the button
    e.stopPropagation();
    this.props.cancelClickToDial(this.props.interaction.interactionId);
  };

  render() {
    if (
      this.props.interaction.direction === 'outbound' &&
      this.props.interaction.channelType === 'voice' &&
      this.props.interaction.status === 'work-initiated' &&
      this.props.interaction.initiatedByCurrentAgent
    ) {
      return (
        <Button
          id="cancelInteractionBeforeActive"
          type="primaryRed"
          text={messages.cancelInteraction}
          onClick={this.cancelInteraction}
          style={[styles.cancelInteractionBtn, this.props.style]}
        />
      );
    } else {
      return null;
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    cancelClickToDial: (input) => dispatch(cancelClickToDial(input)),
    dispatch,
  };
}

CancelButton.propTypes = {
  interaction: PropTypes.shape({
    interactionId: PropTypes.string,
    direction: PropTypes.string,
    channelType: PropTypes.string,
    status: PropTypes.string,
    initiatedByCurrentAgent: PropTypes.bool,
  }).isRequired,
  style: PropTypes.object,
  cancelClickToDial: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(CancelButton));
