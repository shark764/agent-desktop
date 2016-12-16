/*
 *
 * MainContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectMainContentArea from './selectors';
import Radium from 'radium';

export class MainContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.3)',
      backgroundColor: '#051E24',
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
      </div>
    );
  }
}

const mapStateToProps = selectMainContentArea();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

MainContentArea.propTypes = {
  style: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
