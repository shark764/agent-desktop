/*
 *
 * WelcomeStats
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';
import axios from 'axios';

export class WelcomeStats extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    welcome: {
      boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.34)',
      fontSize: '24px',
      color: '#50686E',
      lineHeight: '23px',
      position: 'relative',
      top: '25vh',
      height: '300px',
      width: 'calc(80vw - 300px)',
      marginLeft: 'calc(50% - (calc(calc(80vw - 300px) / 2)))',
      padding: '1em',
      borderRadius: '10px',
    },
    agentName: {
      display: 'block',
      position: 'relative',
      top: '0.5em',
      left: '1em',
    },
    statContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      width: '90%',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      top: '3em',
      lineHeight: '1.15em',
    },
    stat: {
      position: 'relative',
      top: '2em',
      left: '1em',
      fontSize: 'medium',
    },
    statVal: {
      position: 'relative',
      top: '1em',
    },
    statLeft: {
      order: '1',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statMid: {
      order: '3',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statRight: {
      order: '2',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statTitle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);
    this.state = { avgHandleTime: '-', csat: '-', interactionCount: '-' };
  }

  componentDidMount() {
    this.getStats();
  }

  setHandleTime(data) {
    if (data.results.unit === 'millis') {
      const avgHandleTimeInMinutes = (data.results.avg / 60000).toFixed(1);
      this.setState({ avgHandleTime: `${avgHandleTimeInMinutes} minutes` });
    } else {
      throw new Error('Not handling avgHandleTime not in millis');
    }
  }

  setCSAT(data) {
    this.setState({csat: data.results.percent + '%'}); // eslint-disable-line
  }

  setInteractionCount(data) {
    this.setState({interactionCount: data.results.count}); // eslint-disable-line
  }

  getStats() {
    const storage = window.localStorage;

    let host;
    if (typeof window.ADconf !== 'undefined') {
      host = 'https://' + window.ADconf.api; // eslint-disable-line
    } else {
      host = 'https://dev-api.cxengagelabs.net/v1';
    }

    axios({
      method: 'get',
      url: host + '/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/resource-handle-time', // eslint-disable-line
      auth: {
        username: storage.getItem('email1'), // TODO: REMOVE BEFORE v1!!!!!!!
        password: storage.getItem('pass1'), // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setHandleTime(res.data));

    axios({
      method: 'get',
      url: host + '/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/customer-satisfaction-score', // eslint-disable-line
      auth: {
        username: storage.getItem('email1'), // TODO: REMOVE BEFORE v1!!!!!!!
        password: storage.getItem('pass1'), // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setCSAT(res.data));

    axios({
      method: 'get',
      url: host + '/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/work-accepted-count', // eslint-disable-line
      auth: {
        username: storage.getItem('email1'), // TODO: REMOVE BEFORE v1!!!!!!!
        password: storage.getItem('pass1'), // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setInteractionCount(res.data));
  }

  render() {
    return (
      <div style={this.styles.welcome}>
        <span style={this.styles.statTitle}><FormattedMessage {...messages.welcome} /></span><span style={this.styles.agentName}>{this.props.agent.firstName} {this.props.agent.lastName}</span>
        <div id="statContainer" style={this.styles.statContainer}>
          <div style={this.styles.statLeft}>
            <div style={this.styles.statTitle}><FormattedMessage {...messages.avgHandleTime} /></div>
            <div style={this.styles.statVal}>{this.state.avgHandleTime}</div>
          </div>
          <div style={this.styles.statMid}>
            <div style={this.styles.statTitle}><FormattedMessage {...messages.csat} /></div>
            <div style={this.styles.statVal}>{this.state.csat}</div>
          </div>
          <div style={this.styles.statRight}>
            <div style={this.styles.statTitle}><FormattedMessage {...messages.interactionsCount} /></div>
            <div style={this.styles.statVal}>{this.state.interactionCount}</div>
          </div>
        </div>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

WelcomeStats.propTypes = {
  agent: PropTypes.object.isRequired,
  tenant: PropTypes.object.isRequired,
};

export default connect(null, mapDispatchToProps)(Radium(WelcomeStats));
