/*
 *
 * SidePanel
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectSidePanel from './selectors';
import Radium from 'radium';

export class SidePanel extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      // styles
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
      </div>
    );
  }
}

const mapStateToProps = selectSidePanel();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

SidePanel.propTypes = {
  style: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(SidePanel));
