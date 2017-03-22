/*
 *
 * ContactInteractionHistory
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import moment from 'moment';

import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

import { setContactHistoryInteractionDetailsLoading } from 'containers/AgentDesktop/actions';

import messages from './messages';
import { getSelectedInteractionId, selectContactHistory } from './selectors';

export class ContactInteractionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.selectInteraction = this.selectInteraction.bind(this);
    this.getInteractionHistoryList = this.getInteractionHistoryList.bind(this);
    this.getCurrentInteractionDisplay = this.getCurrentInteractionDisplay.bind(this);

    this.state = {
      selectedInteractionIndex: undefined,
    };
  }

  getInteractionHistoryDetails(contactHistoryInteractionId) {
    this.props.setContactHistoryInteractionDetailsLoading(this.props.selectedInteractionId, contactHistoryInteractionId);
    SDK.reporting.getContactInteraction({ entityId: contactHistoryInteractionId });
  }

  selectInteraction(selectedInteractionIndex) {
    this.setState({ selectedInteractionIndex });
  }

  styles = {
    loading: {
      margin: '0 auto',
      display: 'block',
    },
    base: {
      padding: '28px 26px 26px 0',
      fontSize: '14px',
      height: '100%',
      overflowY: 'auto',
    },
    interactionsSince: {
      fontSize: '15px',
      marginBottom: '19px',
    },
    interaction: {
      border: '1px solid #E4E4E4',
      borderRadius: '3px',
    },
    interactionHeader: {
      backgroundColor: '#F3F3F3',
      padding: '16px 40px',
    },
    interactionListItem: {
      marginBottom: '14px',
    },
    pointer: {
      cursor: 'pointer',
    },
    interactionDaysAgo: {
      float: 'right',
      color: '#979797',
    },
    closeIcon: {
      float: 'right',
      marginTop: '5px',
    },
    loadingInteractionDetails: {
      margin: '0 auto',
      display: 'block',
      marginTop: '12px',
      height: '40px',
    },
    interactionDetails: {
      borderTop: '1px solid #E4E4E4',
      paddingBottom: '12px',
    },
    segment: {
      marginTop: '12px',
    },
    segmentData: {
      borderTop: '1px solid #E4E4E4',
      padding: '16px 40px 0 0',
      maxHeight: 'calc(100vh - 270px)',
      overflowY: 'auto',
    },
    segmentTitle: {
      fontSize: '16px',
      fontWeight: 600,
    },
    segmentChannelIcon: {
      verticalAlign: 'top',
      margin: '5px 14px 0 14px',
      cursor: 'default',
    },
    segmentContent: {
      width: 'calc(100% - 50px)',
      display: 'inline-block',
    },
    segmentMessage: {
      fontSize: '16px',
    },
    disposition: {
      fontSize: '12px',
      backgroundColor: '#F3F3F3',
      padding: '6px',
      display: 'inline-block',
      marginTop: '6px',
    },
    transcript: {
      borderTop: '1px solid #D0D0D0',
      marginTop: '20px',
    },
    transcriptTitle: {
      fontSize: '16px',
      color: '#7E7E7E',
      margin: '20px 0',
    },
    transcriptItem: {
      marginBottom: '20px',
    },
    transcriptItemName: {
      fontWeight: 'bold',
    },
  }

  getInteractionHistoryList() {
    if (this.props.contactInteractionHistory === undefined) {
      return <IconSVG id="loadingContactHistoryIcon" name="loading" style={this.styles.loading} />;
    } else {
      const interactions = this.props.contactInteractionHistory.map((interaction) => {
        let interactionDetails;
        if (interaction.interactionDetails === 'loading') {
          interactionDetails = <IconSVG id="loadingContactHistoryIcon" name="loading" style={this.styles.loadingInteractionDetails} />;
        } else if (interaction.interactionDetails !== undefined) {
          let icon;
          if (interaction.interactionDetails.channelType === 'voice') {
            icon = 'voice_dark';
          } else if (interaction.interactionDetails.channelType === 'sms' || interaction.interactionDetails.channelType === 'messaging') {
            icon = 'message_dark';
          } else if (interaction.interactionDetails.channelType === 'email') {
            icon = 'email_dark';
          }
          const segmentData = interaction.interactionDetails.agents && interaction.interactionDetails.agents.map((segment) => {
            let duration = moment(segment.conversationEndTimestamp).diff(moment(segment.conversationStartTimestamp), 'minutes');
            if (duration > 0) {
              duration = (
                <span>
                  {duration}&nbsp;<FormattedMessage {...messages.minutes} />
                </span>
              );
            } else {
              duration = (
                <span>
                  {moment(segment.conversationEndTimestamp).diff(moment(segment.conversationStartTimestamp), 'seconds')}&nbsp;<FormattedMessage {...messages.seconds} />
                </span>
              );
            }
            return (
              <div className="segment" key={`${segment.resourceId}-${segment.conversationStartTimestamp}`} style={this.styles.segment} >
                <Icon name={icon} style={this.styles.segmentChannelIcon} />
                <div style={this.styles.segmentContent}>
                  <div className="noteTitle" style={this.styles.segmentTitle}>
                    { segment.noteTitle }
                  </div>
                  <div className="agentName">
                    { segment.agentName }
                  </div>
                  <div className="duration">
                    { duration }
                  </div>
                  {
                    segment.dispositionName !== null
                    ? <span className="dispositionName" style={this.styles.disposition}>
                      { segment.dispositionName }
                    </span>
                    : undefined
                  }
                </div>
              </div>
            );
          });
          interactionDetails = segmentData;
        }
        return (
          <div
            key={interaction.interactionId}
            id={`contactHistoryInteraction-${interaction.interactionId}`}
            className="contactHistoryInteraction"
            style={[this.styles.interaction, this.styles.interactionListItem, interactionDetails === undefined ? this.styles.pointer : '']}
            onClick={() => this.getInteractionHistoryDetails(interaction.interactionId)}
          >
            <div style={this.styles.interactionHeader}>
              <div style={this.styles.interactionDaysAgo}>
                { moment(interaction.startTimestamp).fromNow() }
              </div>
              <div>
                {interaction.directionName},&nbsp;{interaction.lastQueueName}
              </div>
              <div>
                { moment(interaction.startTimestamp).format('LLL') }
              </div>
              {
                interaction.csat !== null
                ? <div>
                  <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{ interaction.csat }
                </div>
                : undefined
              }
            </div>
            {
              interactionDetails
              ? <div className="interactionDetails" style={this.styles.interactionDetails}>
                { interactionDetails }
              </div>
              : undefined
            }
          </div>
        );
      });
      return (
        <div>
          <div id="interactionsSince" style={this.styles.interactionsSince}>
            { this.props.contactInteractionHistory.length > 0
              ? <div>
                { this.props.contactInteractionHistory.length }
                &nbsp;
                {
                  this.props.contactInteractionHistory.length > 1
                  ? <FormattedMessage {...messages.interactionsSince} />
                  : <FormattedMessage {...messages.interaction} />
                }
                &nbsp;
                { moment(this.props.contactInteractionHistory[this.props.contactInteractionHistory.length - 1].startTimestamp).format('LL') }
              </div>
              : <FormattedMessage {...messages.noPastInteractions} />
            }
          </div>
          { interactions }
        </div>
      );
    }
  }

  // TODO combine with above code when artifacts (transcripts, recordings, notes) are available from the SDK
  getCurrentInteractionDisplay() {
    const selectedInteractionHistoryItem = this.props.contactInteractionHistory[this.state.selectedInteractionIndex];
    // let transcript;
    // if (segment.channelType === 'voice') {
    //   transcript = (
    //     <div style={this.styles.transcript}>
    //       <div style={this.styles.transcriptTitle}>
    //         <FormattedMessage {...messages.audioRecording} />
    //       </div>
    //       <div>
    //         <audio controls src={segment.audioRecording} />
    //       </div>
    //     </div>
    //   );
    // } else {
    //   const transcriptItems = segment.transcript.map((transcriptItem, index) =>
    //     <div key={`${segment.id}`} id={`transcriptItem${index}`} style={this.styles.transcriptItem}>
    //       <span style={this.styles.transcriptItemName}>
    //         {transcriptItem.name}:&nbsp;
    //       </span>
    //       <span>
    //         {transcriptItem.message}
    //       </span>
    //     </div>
    //   );
    //   transcript = (
    //     <div style={this.styles.transcript}>
    //       <div style={this.styles.transcriptTitle}>
    //         <FormattedMessage {...messages.transcript} />
    //       </div>
    //       <div style={this.styles.segmentMessage}>
    //         {transcriptItems}
    //       </div>
    //     </div>
    //   );
    // }
    // const segmentData = (
    //   <div>
    //     <div style={this.styles.segmentMessage}>
    //       { segment.note }
    //     </div>
    //     { /* transcript */ }
    //   </div>
    // );
    return (
      <div id="selectedInteractionHistoryItem" style={this.styles.interaction}>
        <div style={this.styles.interactionHeader}>
          <Icon name="close" style={this.styles.closeIcon} onclick={() => this.selectInteraction(undefined)} />
          <div>
            {selectedInteractionHistoryItem.directionName},&nbsp;{selectedInteractionHistoryItem.lastQueueName}
          </div>
          <div>
            { moment(selectedInteractionHistoryItem.startTimestamp).format('LLL') }
          </div>
          {
            selectedInteractionHistoryItem.csat !== null
            ? <div>
              <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{ selectedInteractionHistoryItem.csat }
            </div>
            : undefined
          }
        </div>
        <div style={this.styles.segmentData} >
          { /* segmentData */ }
        </div>
      </div>
    );
  }

  render() {
    let content;
    if (this.state.selectedInteractionIndex === undefined) {
      content = this.getInteractionHistoryList();
    } else {
      content = this.getCurrentInteractionDisplay();
    }
    return (
      <div style={[this.styles.base, this.props.style]}>
        { content }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
    contactInteractionHistory: selectContactHistory(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setContactHistoryInteractionDetailsLoading: (interactionId, contactHistoryInteractionId) => dispatch(setContactHistoryInteractionDetailsLoading(interactionId, contactHistoryInteractionId)),
    dispatch,
  };
}

ContactInteractionHistory.propTypes = {
  selectedInteractionId: React.PropTypes.string,
  contactInteractionHistory: React.PropTypes.array,
  setContactHistoryInteractionDetailsLoading: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactInteractionHistory));
