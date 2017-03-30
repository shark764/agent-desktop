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

import { setContactInteractionHistory, setContactHistoryInteractionDetailsLoading, addNotesToContactInteractionHistory, loadHistoricalInteractionBody } from 'containers/AgentDesktop/actions';

import messages from './messages';
import { getSelectedInteractionId, selectContactId, selectContactHistory } from './selectors';

export class ContactInteractionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedInteractionIndex: undefined,
    };
  }

  refreshContactInteractionHistory() {
    this.props.setContactInteractionHistory({ contactId: this.props.contactId, results: undefined });
    SDK.reporting.getContactHistory({ entityId: this.props.contactId });
  }

  getInteractionHistoryDetails(contactHistoryInteractionId) {
    this.props.setContactHistoryInteractionDetailsLoading(this.props.selectedInteractionId, contactHistoryInteractionId);
    SDK.reporting.getContactInteraction({ entityId: contactHistoryInteractionId });
  }

  selectInteraction(selectedInteractionIndex) {
    if (selectedInteractionIndex !== undefined) {
      const interaction = this.props.contactInteractionHistory[selectedInteractionIndex];
      const needsNotes = interaction.interactionDetails.agents.findIndex((agent) =>
        agent.noteTitle !== null && agent.note === undefined
      ) !== -1;
      if (needsNotes) {
        SDK.interactions.getAllNotes({ interactionId: interaction.interactionId }, (error, topic, response) => {
          console.log('[ContactInteractionHistory] SDK.subscribe()', topic, response);
          this.props.addNotesToContactInteractionHistory(interaction.interactionId, response);
        });
      }
      const needsBody = (interaction.interactionDetails.recordings === undefined && interaction.interactionDetails.transcript === undefined);
      if (needsBody) {
        switch (interaction.channelType) {
          case 'voice':
            this.props.loadHistoricalInteractionBody(interaction.interactionId, 'recordings');
            break;
          case 'sms':
          case 'messaging':
            this.props.loadHistoricalInteractionBody(interaction.interactionId, 'transcript');
            break;
          default:
            break;
        }
      }
    }
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
    interactionsSinceContainer: {
      fontSize: '15px',
      marginBottom: '19px',
    },
    interactionsSince: {
      display: 'inline-block',
    },
    refresh: {
      display: 'inline-block',
      float: 'right',
      fontSize: '22px',
      marginTop: '-4px',
      cursor: 'pointer',
    },
    interaction: {
      border: '1px solid #E4E4E4',
      borderRadius: '3px',
    },
    interactionHeader: {
      backgroundColor: '#F3F3F3',
      padding: '16px 40px 20px',
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
      display: 'flex',
    },
    interactionBody: {
      marginLeft: '44px',
      marginRight: '44px',
      display: 'flex',
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
      flexGrow: '0',
    },
    segmentContent: {
      marginRight: '44px',
      flexGrow: '1',
    },
    segmentMessage: {
      fontSize: '16px',
      whiteSpace: 'pre-wrap',
      marginTop: '8px',
    },
    disposition: {
      fontSize: '12px',
      backgroundColor: '#F3F3F3',
      padding: '6px',
      display: 'inline-block',
      marginTop: '6px',
    },
    expand: {
      display: 'inline-block',
      padding: '2px 7px 0px 7px',
      fontSize: '8px',
      border: '1px solid #979797',
      borderRadius: '3px',
      color: '#979797',
      marginTop: '10px',
      marginLeft: '48px',
      cursor: 'pointer',
    },
    transcript: {
      borderTop: '1px solid #D0D0D0',
      marginTop: '20px',
      flexGrow: '1',
    },
    transcriptTitle: {
      fontSize: '16px',
      color: '#7E7E7E',
      margin: '20px 0 15px 0',
    },
    transcriptItem: {
      marginBottom: '20px',
    },
    transcriptItemName: {
      fontWeight: 'bold',
    },
    audio: {
      width: '100%',
      marginBottom: '5px',
    },
  }

  interactionBody(interactionDetails) {
    let transcript;
    // UNCOMMENT WHEN MESSAGING TRANSCRIPTS API READY
    // let transcriptItems;
    const audioRecordings = (recordings) => {
      if (recordings.length === 0) {
        return <FormattedMessage {...messages.noRecordings} />;
      }
      return recordings.map(
        (recordingUrl) =>
          <audio controls key={recordingUrl} src={recordingUrl} style={this.styles.audio} />
      );
    };
    switch (interactionDetails.channelType) {
      case 'voice':
        transcript = (
          <div style={this.styles.transcript}>
            <div style={this.styles.transcriptTitle}>
              <FormattedMessage {...messages.audioRecording} />
            </div>
            <div>
              { interactionDetails.audioRecordings !== undefined
                ? audioRecordings(interactionDetails.audioRecordings)
                : <IconSVG id="loadingRecordings" name="loading" style={this.styles.loadingInteractionDetails} />
              }
            </div>
          </div>
        );
        break;
      // UNCOMMENT WHEN MESSAGING TRANSCRIPTS API READY
      // case 'sms':
      // case 'messaging':
      //   transcriptItems = segment.transcript.map((transcriptItem, index) =>
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
      //   break;
      default:
        break;
    }
    return transcript;
  }

  contactHistoryInteraction(interaction, interactionIndex) {
    let interactionDetails;
    const expandedView = (interactionIndex === undefined);
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
        let duration;
        const hasNotes = segment.noteTitle !== null;
        const notes = (segment.note !== undefined)
          ? segment.note.body
          : <IconSVG id="loadingNote" name="loading" style={this.styles.loadingInteractionDetails} />;
        if (segment.conversationStartTimestamp && segment.conversationEndTimestamp) {
          duration = moment(segment.conversationEndTimestamp).diff(moment(segment.conversationStartTimestamp), 'minutes');
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
                ? <span className="dispositionName" style={this.styles.disposition} title="Disposition">
                  { segment.dispositionName }
                </span>
                : undefined
              }
              {
                expandedView
                ? <div style={this.styles.segmentMessage}>
                  { hasNotes
                    ? notes
                    : undefined
                  }
                </div>
                : undefined
              }
            </div>
          </div>
        );
      });
      interactionDetails = (
        <div>
          { segmentData }
          {
            !expandedView
            ? <div className="expand" style={this.styles.expand} onClick={() => this.selectInteraction(interactionIndex)}>
              &#9679;&#9679;&#9679;
            </div>
            : undefined
          }
          {
            expandedView
            ? <div style={[this.styles.interactionBody]}>
              { this.interactionBody(interaction.interactionDetails) }
            </div>
            : undefined
          }
        </div>
      );
    }
    return (
      <div
        key={interaction.interactionId}
        id={`contactHistoryInteraction-${interaction.interactionId}`}
        className="contactHistoryInteraction"
        style={[this.styles.interaction, this.styles.interactionListItem, interactionDetails === undefined ? this.styles.pointer : '']}
        onClick={interactionDetails === undefined ? () => this.getInteractionHistoryDetails(interaction.interactionId) : ''}
      >
        <div style={this.styles.interactionHeader}>
          {
            expandedView
            ? <Icon name="close" style={this.styles.closeIcon} onclick={() => this.selectInteraction(undefined)} />
            : <div style={this.styles.interactionDaysAgo}>
              { moment(interaction.startTimestamp).fromNow() }
            </div>
          }
          <div>
            {interaction.directionName},&nbsp;{interaction.lastQueueName}
          </div>
          {
            interaction.lastDispositionName
            ? <div style={[this.styles.disposition, { float: 'right', backgroundColor: '#FFFFFF', marginTop: '2px', marginBottom: '2px' }]}>
              {interaction.lastDispositionName}
            </div>
            : undefined
          }
          {
            interaction.csat !== null
            ? <div>
              <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{ interaction.csat }
            </div>
            : undefined
          }
          <div>
            { moment(interaction.startTimestamp).format('LLL') }
          </div>
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
  }

  getInteractionHistoryList() {
    if (this.props.contactInteractionHistory === undefined) {
      return <IconSVG id="loadingContactHistoryIcon" name="loading" style={this.styles.loading} />;
    } else {
      const interactions = this.props.contactInteractionHistory.map((interaction, interactionIndex) =>
        this.contactHistoryInteraction(interaction, interactionIndex)
      );
      return (
        <div>
          <div style={this.styles.interactionsSinceContainer}>
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
            <div id="refreshContactInteractionHistory" onClick={() => this.refreshContactInteractionHistory()} style={this.styles.refresh}>
              &#8635;
            </div>
          </div>
          { interactions }
        </div>
      );
    }
  }

  render() {
    let content;
    if (this.state.selectedInteractionIndex === undefined) {
      content = this.getInteractionHistoryList();
    } else {
      content = this.contactHistoryInteraction(this.props.contactInteractionHistory[this.state.selectedInteractionIndex]);
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
    contactId: selectContactId(state, props),
    contactInteractionHistory: selectContactHistory(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setContactInteractionHistory: (response) => dispatch(setContactInteractionHistory(response)),
    setContactHistoryInteractionDetailsLoading: (interactionId, contactHistoryInteractionId) => dispatch(setContactHistoryInteractionDetailsLoading(interactionId, contactHistoryInteractionId)),
    addNotesToContactInteractionHistory: (contactHistoryInteractionId, response) => dispatch(addNotesToContactInteractionHistory(contactHistoryInteractionId, response)),
    loadHistoricalInteractionBody: (interactionId, bodyType) => dispatch(loadHistoricalInteractionBody(interactionId, bodyType)),
    dispatch,
  };
}

ContactInteractionHistory.propTypes = {
  selectedInteractionId: React.PropTypes.string,
  contactId: React.PropTypes.string.isRequired,
  contactInteractionHistory: React.PropTypes.array,
  setContactInteractionHistory: React.PropTypes.func.isRequired,
  setContactHistoryInteractionDetailsLoading: React.PropTypes.func.isRequired,
  addNotesToContactInteractionHistory: React.PropTypes.func.isRequired,
  loadHistoricalInteractionBody: React.PropTypes.func.isRequired,
  style: React.PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(ContactInteractionHistory));
