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
    agentButtonContainer: {
      order: '0',
      flex: '0 1 auto',
      alignSelf: 'auto',
      borderRight: '1px solid rgba(6, 30, 36, 1.0)',
      width: '277px',
      height: '54px',
    },
    agentButton: {
      cursor: 'pointer',
      marginLeft: '11px',
      marginTop: '5px',
      display: 'inline-grid',
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '3px',
      paddingBottom: '4px',
      ':hover': {
        borderRadius: '2px',
        boxShadow: '0 0 2px 1px rgba(0,0,0,0.29)',
        backgroundColor: '#C93952',
      },
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
      fontWeight: 'lighter',
    },
    agentTimer: {
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '19px',
      color: '#FFFFFF',
    },
  }

  render() {
    return (
      <div style={[this.styles.base, this.props.style]}>
        <div id="toolbar-container" style={[this.styles.container]}>
          <div id="agent-button-container" style={[this.styles.agentButtonContainer]}>
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
          </div>
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
