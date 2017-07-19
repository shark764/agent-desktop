/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * MessagingContentArea
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormattedTime } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import LoadingText from 'components/LoadingText';

import ContentArea from 'containers/ContentArea';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import MessagingTextArea from './MessagingTextArea';
import messages from './messages';

export class MessagingContentArea extends React.Component {
  componentDidUpdate(prevProps) {
    // Scroll to bottom of message history if there is a new message
    if (
      prevProps.selectedInteraction.messageHistory.length !==
      this.props.selectedInteraction.messageHistory.length
    ) {
      const messsageHistoryDiv = document.getElementById('message-history');
      if (messsageHistoryDiv) {
        messsageHistoryDiv.scrollTop = messsageHistoryDiv.scrollHeight;
      }
    }
  }

  styles = {
    customField: {
      display: 'inline-block',
      width: '50%',
    },
    customFieldLabel: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
    },
    customFieldValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
    },
    messageHistoryItem: {
      marginBottom: '10px',
    },
    systemMessage: {
      fontSize: '16px',
      whiteSpace: 'pre-wrap',
      textAlign: 'center',
      color: '#999',
      display: 'inline-block',
      width: '50%',
      margin: '0 25%',
    },
    avatarContainer: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '40px',
      paddingTop: '5px',
    },
    messageContainer: {
      display: 'inline-block',
      width: 'calc(100% - 40px)',
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
    messagingContainer: {
      display: 'flex',
      flexFlow: 'column',
      position: 'absolute',
      height: '100%',
      width: '100%',
      padding: '17px 17px 9px',
    },
    messageHistory: {
      flex: '1 1 auto',
      overflowY: 'auto',
      marginBottom: '1px',
      borderRadius: '3px',
    },
  };

  render() {
    const isLoading =
      this.props.selectedInteraction.status === 'work-accepting' ||
      this.props.selectedInteraction.status === 'initializing-outbound';

    let from;
    if (
      this.props.selectedInteraction.contact &&
      this.props.selectedInteraction.contact.id !== undefined
    ) {
      from = this.props.selectedInteraction.contact.attributes.name;
    } else if (this.props.selectedInteraction.channelType === 'sms') {
      from = this.props.selectedInteraction.customer;
    } else {
      from = this.props.selectedInteraction.messageHistory[0]
        ? this.props.selectedInteraction.messageHistory[0].from
        : '';
    }

    let details;
    if (this.props.selectedInteraction.customFields) {
      details = this.props.selectedInteraction.customFields.map((customField) =>
        (<div
          key={customField.label + customField.value}
          style={this.styles.customField}
        >
          <div style={this.styles.customFieldLabel}>
            {customField.label}
          </div>
          <div style={this.styles.customFieldValue}>
            {customField.value}
          </div>
        </div>)
      );
    } else {
      details = '';
    }

    const wrappingUp = this.props.selectedInteraction.status === 'wrapup';

    const buttons = (
      <Button
        id={wrappingUp ? 'wrapup-button' : 'end-chat-button'}
        key={wrappingUp ? 'wrapup-button' : 'end-chat-button'}
        type="primaryBlue"
        text={wrappingUp ? messages.endWrapup : messages.endChat}
        onClick={this.props.endInteraction}
        disabled={isLoading || this.props.awaitingDisposition}
      />
    );

    let content;
    if (isLoading) {
      content = (
        <div>
          <LoadingText withSquare />
          <LoadingText />
        </div>
      );
    } else {
      const messageHistory = this.props.selectedInteraction.messageHistory.map(
        (message) => {
          let messageFrom;
          if (
            (message.type === 'customer' || message.type === 'message') &&
            (this.props.selectedInteraction.contact !== undefined &&
              this.props.selectedInteraction.contact.id !== undefined)
          ) {
            messageFrom = this.props.selectedInteraction.contact.attributes
              .name;
          } else {
            messageFrom = message.from;
          }
          return (
            <div
              key={message.from + message.timestamp}
              style={this.styles.messageHistoryItem}
            >
              {message.type === 'system'
                ? <span style={this.styles.systemMessage}>
                  {message.text}
                </span>
                : <div>
                  <div style={this.styles.avatarContainer}>
                    <Avatar
                      customerAvatarIndex={
                          message.type === 'agent'
                            ? undefined
                            : this.props.selectedInteraction.customerAvatarIndex
                        }
                    />
                  </div>
                  <div style={this.styles.messageContainer}>
                    <span style={this.styles.messageFrom}>
                      {messageFrom}
                    </span>
                    <span style={this.styles.messageTime}>
                      <FormattedTime value={new Date(message.timestamp)} />
                    </span>
                    <div style={this.styles.messageText}>
                      {message.text}
                    </div>
                  </div>
                </div>}
            </div>
          );
        }
      );

      content = (
        <div style={this.styles.messagingContainer}>
          <div id="message-history" style={this.styles.messageHistory}>
            {messageHistory}
          </div>
          {this.props.selectedInteraction.status !==
            'work-ended-pending-script' &&
            <MessagingTextArea
              selectedInteraction={this.props.selectedInteraction}
              messageTemplates={this.props.messageTemplates}
            />}
        </div>
      );
    }

    return (
      <ContentArea
        interaction={this.props.selectedInteraction}
        from={from}
        buttons={buttons}
        details={details}
        content={content}
      />
    );
  }
}

MessagingContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  messageTemplates: PropTypes.array.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(MessagingContentArea))
);
