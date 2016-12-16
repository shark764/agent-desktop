/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectInteractionsBar from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

export class InteractionsBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      backgroundColor: '#072931',
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
