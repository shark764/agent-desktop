/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';

import CircleIconButton from 'components/CircleIconButton';

const styles = {
  circleIconButtonRow: {
    padding: '0 1.5px',
  },
};

export default class Hold extends React.PureComponent {
  setHold = () => {
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
};
