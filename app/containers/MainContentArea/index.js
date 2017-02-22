/*
 *
 * MainContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectSelectedInteraction } from './selectors';
import Radium from 'radium';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';

import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';
import VoiceContentArea from 'containers/VoiceContentArea';
import messages from './messages';

export class MainContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.endInteraction = this.endInteraction.bind(this);
  }

  componentDidMount() {
    this.getStats();
  }

  setHandleTime(data) {
    this.setState({avgHandleTime: data.results.avg + ' ' + data.results.unit}); // eslint-disable-line
  }

  setCSAT(data) {
    this.setState({csat: data.results.percent + '%'}); // eslint-disable-line
  }

  setInteractionCount(data) {
    this.setState({interactionCount: data.results.count}); // eslint-disable-line
  }

  styles = {
    base: {
      backgroundColor: '#072931',
      color: '#4B4B4B',
    },
    welcome: {
      boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.34)',
      fontFamily: 'ProximaNova-Regular',
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

  endInteraction() {
    SDK.interactions.end({ interactionId: this.props.selectedInteraction.interactionId });
  }

  getStats() {
    let host = document.location.hostname;
    if (host === 'localhost' || host === 'dev-desktop.cxengagelabs.net') {
      host = 'https://dev-api.cxengagelabs.net';
    } else if (host === 'qe-desktop.cxengagelabs.net') {
      host = 'https://qe-api.cxengagelabs.net';
    } else {
      // TODO: Handle Prod
    }

    axios({
      method: 'get',
      url: host + '/v1/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/resource-handle-time', // eslint-disable-line
      auth: {
        username: 'jclowater@liveopscloud.com', // TODO: REMOVE BEFORE v1!!!!!!!
        password: 'Password1!', // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setHandleTime(res.data));

    axios({
      method: 'get',
      url: host + '/v1/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/customer-satisfaction-score', // eslint-disable-line
      auth: {
        username: 'jclowater@liveopscloud.com', // TODO: REMOVE BEFORE v1!!!!!!!
        password: 'Password1!', // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setCSAT(res.data));

    axios({
      method: 'get',
      url: host + '/v1/tenants/'+ this.props.tenant.id +'/users/'+ this.props.agent.userId +'/realtime-statistics/work-accepted-count', // eslint-disable-line
      auth: {
        username: 'jclowater@liveopscloud.com', // TODO: REMOVE BEFORE v1!!!!!!!
        password: 'Password1!', // TODO: REMOVE BEFORE v1!!!!!!!
      },
    }).then((res) => this.setInteractionCount(res.data));
  }

  render() {
    const selectedInteraction = this.props.selectedInteraction;

    let content = null;
    if (selectedInteraction) {
      if (selectedInteraction.channelType === 'messaging' || selectedInteraction.channelType === 'sms') {
        content = <MessagingContentArea selectedInteraction={selectedInteraction} endInteraction={this.endInteraction} />;
      } else if (selectedInteraction.channelType === 'email') {
        content = <EmailContentArea selectedInteraction={selectedInteraction} emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} />;
      } else if (selectedInteraction.channelType === 'voice') {
        content = <VoiceContentArea selectedInteraction={selectedInteraction} endInteraction={this.endInteraction} />;
      } else {
        throw new Error(`Unknown selected channelType: ${selectedInteraction.channelType}`);
      }
    }

    return (
      <div style={[this.styles.base, this.props.style]}>
        {
          content !== null
          ? content
          : <div style={this.styles.welcome}>
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
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: selectSelectedInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

MainContentArea.propTypes = {
  style: PropTypes.array,
  selectedInteraction: PropTypes.object,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  agent: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
