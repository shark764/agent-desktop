/*
 *
 * Toolbar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectToolbar from './selectors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

export class Toolbar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      backgroundColor: this.props.readyState ? '#072931' : '#FE4565',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignContent: 'stretch',
      alignItems: 'flex-start',
    },
    agentButton: {
      order: '0',
      flex: '0 1 auto',
      alignSelf: 'auto',
      borderRight: '1px solid rgba(6, 30, 36, 1.0)',
      width: '277px',
      height: '54px',
    },
    stats: {
      order: '0',
      flex: '1 1 auto',
      alignSelf: 'auto',
    },
    config: {
      order: '0',
      flex: '0 1 45px',
      alignSelf: 'auto',
      backgroundColor: 'rgba(59, 59, 59, 1.0)',
      height: '54px',
      width: '50px',
    },
    agentState: {
      fontSize: '16px',
      lineHeight: '19px',
      color: '#FFFFFF',
      display: 'block',
      marginLeft: '22px',
      marginTop: '6px',
      fontWeight: 'lighter',
    },
    agentTimer: {
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '19px',
      color: '#FFFFFF',
      marginLeft: '22px',
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        <div id="toolbar-container" style={[this.styles.container]}>
          <span id="agent-button" style={[this.styles.agentButton]}>
            <span id="agent-state" style={[this.styles.agentState]}>
              {
                this.props.readyState
                ? <FormattedMessage {...messages.ready} />
                : <FormattedMessage {...messages.notReady} />
              }
            </span>
            <span id="agent-timer" style={[this.styles.agentTimer]}>
              00:00:00
            </span>
          </span>
          <span id="agent-stats" style={[this.styles.stats]} />
          <span id="agent-config" style={[this.styles.config]}>
          Gear
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = selectToolbar();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

Toolbar.propTypes = {
  style: PropTypes.array,
  readyState: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Toolbar));
