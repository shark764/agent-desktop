/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setInteractionConfirmation } from 'containers/AgentDesktop/actions';

import CircleIconButton from 'components/CircleIconButton';
import messages from './messages';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export class EndCall extends React.PureComponent {
  confirmEndInteraction = () => {
    if (this.props.interactionStatusIsFatal) {
      CxEngage.interactions.end({
        interactionId: this.props.interactionId,
      });
    } else {
      this.props.setInteractionConfirmation(this.props.interactionId, true);
    }
  };

  render() {
    return (
      <CircleIconButton
        id="endCallButton"
        name="endCall"
        title={messages.endCall}
        onClick={this.confirmEndInteraction}
        style={styles.circleIconButtonRow}
      />
    );
  }
}

EndCall.propTypes = {
  interactionId: PropTypes.string.isRequired,
  interactionStatusIsFatal: PropTypes.bool.isRequired,
  setInteractionConfirmation: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setInteractionConfirmation: (interactionId, status) =>
      dispatch(setInteractionConfirmation(interactionId, status)),
    dispatch,
  };
}

export default connect(
  null,
  mapDispatchToProps
)(EndCall);
