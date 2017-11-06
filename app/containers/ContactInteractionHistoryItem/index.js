/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContactInteractionHistoryItem
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import moment from 'moment';

import ErrorBoundary from 'components/ErrorBoundary';

import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

import { getSelectedInteractionId } from 'containers/ContactInteractionHistory/selectors';
import { setContactHistoryInteractionDetailsLoading } from 'containers/AgentDesktop/actions';

import messages from './messages';

const styles = {
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
    marginTop: '12px',
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
    fontStyle: 'italic',
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
    lineHeight: '1.5em',
  },
  transcript: {
    borderTop: '1px solid #D0D0D0',
    margin: '20px 0 15px 0',
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
  messageFrom: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: '12px',
    marginLeft: '7px',
  },
  messageText: {
    fontSize: '16px',
    lineHeight: '20px',
    whiteSpace: 'pre-wrap',
  },
};

export class ContactInteractionHistoryItem extends React.Component {
  getInteractionHistoryDetails = (contactHistoryInteractionId) => {
    this.props.setContactHistoryInteractionDetailsLoading(
      this.props.selectedInteractionId,
      contactHistoryInteractionId
    );
    CxEngage.reporting.getInteraction({
      interactionId: contactHistoryInteractionId,
    });
  };

  addControlsListAttribute = (element) => {
    if (element) {
      element.setAttribute('controlslist', 'nodownload'); // controlslist attribute not currently supported in React!
    }
  };

  interactionBody = (interactionDetails) => {
    let transcript;
    let transcriptItems;
    const audioRecordings = (recordings) => {
      if (recordings.length === 0) {
        return <FormattedMessage {...messages.noRecordings} />;
      }
      return recordings.map((recordingUrl) =>
        (<audio
          key={recordingUrl}
          src={recordingUrl}
          ref={this.addControlsListAttribute}
          style={styles.audio}
          controls
          onContextMenu={(event) => event.preventDefault()}
        />)
      );
    };
    switch (interactionDetails.channelType) {
      case 'voice':
        transcript = (
          <div style={styles.transcript}>
            <div style={styles.transcriptTitle}>
              <FormattedMessage {...messages.audioRecording} />
            </div>
            <div>
              {interactionDetails.audioRecordings !== undefined
                ? audioRecordings(interactionDetails.audioRecordings)
                : <div style={styles.loadingInteractionDetails}>
                  <IconSVG
                    id="loadingRecordings"
                    name="loading"
                    width="50px"
                  />
                </div>}
            </div>
          </div>
        );
        break;
      case 'sms':
      case 'messaging':
        transcriptItems =
          typeof interactionDetails.transcript === 'undefined'
            ? (<div style={styles.loadingInteractionDetails}>
              <IconSVG id="loadingTranscripts" name="loading" width="50px" />
            </div>)
            : interactionDetails.transcript &&
              interactionDetails.transcript.map &&
              interactionDetails.transcript.map((transcriptItem, index) => {
                const messageType =
                  (transcriptItem.payload.metadata &&
                    transcriptItem.payload.metadata.type) ||
                  transcriptItem.payload.type;
                let messageFrom = transcriptItem.payload.from;
                if (messageType === 'agent') {
                  interactionDetails.agents.forEach((agent) => {
                    if (agent.resourceId === transcriptItem.payload.from) {
                      messageFrom = agent.agentName;
                    }
                  });
                } else if (
                  interactionDetails.customer === transcriptItem.payload.from
                ) {
                  messageFrom = this.props.contactName;
                } else if (
                  transcriptItem.payload.metadata &&
                  transcriptItem.payload.metadata.name
                ) {
                  messageFrom = transcriptItem.payload.metadata.name;
                }
                return (
                  <div
                    key={`${transcriptItem.payload.id}-${index}`}
                    id={`transcriptItem${index}`}
                    style={styles.transcriptItem}
                  >
                    <span style={styles.messageFrom}>
                      {messageFrom}
                    </span>
                    <span style={styles.messageTime}>
                      <FormattedTime
                        value={new Date(Number(transcriptItem.timestamp))}
                      />
                    </span>
                    <div style={styles.messageText}>
                      {transcriptItem.payload.body.text}
                    </div>
                  </div>
                );
              });
        transcript = (
          <div style={styles.transcript}>
            <div style={styles.transcriptTitle}>
              <FormattedMessage {...messages.transcript} />
            </div>
            <div style={styles.segmentMessage}>
              {Array.isArray(transcriptItems) && transcriptItems.length === 0
                ? <FormattedMessage {...messages.noTranscript} />
                : transcriptItems}
            </div>
          </div>
        );
        break;
      default:
        break;
    }
    return transcript;
  };

  render() {
    const interaction = this.props.interaction;
    let interactionDetails;
    const expandedView = this.props.interactionIndex === undefined;
    if (interaction.interactionDetails === 'loading') {
      interactionDetails = (
        <div style={styles.loadingInteractionDetails}>
          <IconSVG id="loadingContactHistoryIcon" name="loading" width="50px" />
        </div>
      );
    } else if (interaction.interactionDetails !== undefined) {
      let icon;
      if (interaction.interactionDetails.channelType === 'voice') {
        icon = 'voice_dark';
      } else if (
        interaction.interactionDetails.channelType === 'sms' ||
        interaction.interactionDetails.channelType === 'messaging'
      ) {
        icon = 'message_dark';
      } else if (interaction.interactionDetails.channelType === 'email') {
        icon = 'email_dark';
      } else if (interaction.interactionDetails.channelType === 'work-item') {
        icon = 'work_item_dark';
      } else {
        console.error(
          `Invalid channelType: ${interaction.interactionDetails.channelType}`
        );
      }
      const segmentData =
        interaction.interactionDetails.agents &&
        interaction.interactionDetails.agents.map((segment) => {
          let duration;
          const hasNotes = segment.noteTitle !== null;
          const notes =
            segment.note !== undefined
              ? segment.note.body
              : (<div style={styles.loadingInteractionDetails}>
                <IconSVG id="loadingNote" name="loading" width="50px" />
              </div>);
          if (
            segment.conversationStartTimestamp &&
            segment.conversationEndTimestamp
          ) {
            duration = moment(segment.conversationEndTimestamp).diff(
              moment(segment.conversationStartTimestamp),
              'minutes'
            );
            if (duration > 0) {
              duration = (
                <span>
                  {duration}&nbsp;<FormattedMessage {...messages.minutes} />
                </span>
              );
            } else {
              duration = (
                <span>
                  {moment(segment.conversationEndTimestamp).diff(
                    moment(segment.conversationStartTimestamp),
                    'seconds'
                  )}&nbsp;<FormattedMessage {...messages.seconds} />
                </span>
              );
            }
          }
          return (
            <div
              className="segment"
              key={`${segment.resourceId}-${segment.conversationStartTimestamp}`}
              style={styles.segment}
            >
              <Icon name={icon} style={styles.segmentChannelIcon} />
              <div style={styles.segmentContent}>
                <div
                  id="noteTitle"
                  className="noteTitle"
                  style={styles.segmentTitle}
                >
                  {segment.noteTitle}
                </div>
                <div id="agentName" className="agentName">
                  {segment.agentName}
                </div>
                <div id="duration" className="duration">
                  {duration}
                </div>
                {segment.dispositionName !== null &&
                  <span
                    id="dispositionName"
                    className="dispositionName"
                    style={styles.disposition}
                    title="Disposition"
                  >
                    {segment.dispositionName}
                  </span>}
                {expandedView &&
                  <div
                    id="notesBody"
                    className="notesBody"
                    style={styles.segmentMessage}
                  >
                    {hasNotes && notes}
                  </div>}
              </div>
            </div>
          );
        });
      interactionDetails = (
        <div>
          {segmentData}
          {expandedView
            ? <div style={styles.interactionBody}>
              {this.interactionBody(interaction.interactionDetails)}
            </div>
            : <div
              className="expand"
              style={styles.expand}
              onClick={() =>
                  this.props.selectInteraction(this.props.interactionIndex)}
            >
                &#9679;&#9679;&#9679;
              </div>}
        </div>
      );
    }
    return (
      <div
        id={`contactHistoryInteraction-${interaction.interactionId}`}
        className="contactHistoryInteraction"
        style={[
          styles.interaction,
          styles.interactionListItem,
          interactionDetails === undefined && styles.pointer,
        ]}
        onClick={
          interactionDetails === undefined
            ? () => this.getInteractionHistoryDetails(interaction.interactionId)
            : undefined
        }
      >
        <div style={styles.interactionHeader}>
          {expandedView
            ? <Icon
              name="close"
              style={styles.closeIcon}
              onclick={() => this.props.selectInteraction(undefined)}
            />
            : <div style={styles.interactionDaysAgo}>
              {moment(interaction.startTimestamp).fromNow()}
            </div>}
          <div>
            {interaction.directionName}
          </div>
          <div>
            {interaction.lastQueueName}
          </div>
          {interaction.csat &&
            <div>
              <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{interaction.csat}
            </div>}
          {interaction.lastDispositionName &&
            <div
              style={[
                styles.disposition,
                {
                  float: 'right',
                  backgroundColor: '#FFFFFF',
                  marginTop: '2px',
                  marginBottom: '2px',
                },
              ]}
            >
              {interaction.lastDispositionName}
            </div>}
          <div>
            {moment(interaction.startTimestamp).format('LLL')}
          </div>
        </div>
        {interactionDetails &&
          <div className="interactionDetails" style={styles.interactionDetails}>
            {interactionDetails}
          </div>}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    selectedInteractionId: getSelectedInteractionId(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setContactHistoryInteractionDetailsLoading: (
      interactionId,
      contactHistoryInteractionId
    ) =>
      dispatch(
        setContactHistoryInteractionDetailsLoading(
          interactionId,
          contactHistoryInteractionId
        )
      ),
  };
}

ContactInteractionHistoryItem.propTypes = {
  interaction: PropTypes.object.isRequired,
  interactionIndex: PropTypes.number,
  contactName: PropTypes.string.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  setContactHistoryInteractionDetailsLoading: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(
    Radium(ContactInteractionHistoryItem)
  )
);
