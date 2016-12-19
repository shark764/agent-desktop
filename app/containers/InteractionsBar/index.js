/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectInteractionsBar from './selectors';
import Radium from 'radium';

export class InteractionsBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      backgroundColor: '#072931',
    },
  }

  render() {
    // TODO components for these
    const messagingInteractions = this.props.messagingInteractions.map((messagingInteraction) => {
      return <div key={messagingInteraction.interactionId}>{messagingInteraction.interactionId}</div>;
    });
    return (
      <div style={[this.styles.base, this.props.style]}>
        {messagingInteractions}
      </div>
    );
  }
}

const mapStateToProps = selectInteractionsBar();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

InteractionsBar.propTypes = {
  style: PropTypes.array,
  messagingInteractions: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
