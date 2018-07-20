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
import LoadingText from 'components/LoadingText';
import CustomFields from 'containers/CustomFields';

import ContentArea from 'containers/ContentArea';

import { selectAgent } from 'containers/Login/selectors';
import { selectIsEndWrapupDisabled } from 'containers/AgentDesktop/selectors';

import { selectWrapupBtnTooltipText } from 'containers/ContentAreaTop/selectors';

import MessagingTextArea from './MessagingTextArea';
import { copyChatTranscript } from './actions';
import { isMessagingInteractionCopied } from './selectors';
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

  copy = () => {
    this.props.copyChatTranscript(this.props.selectedInteraction);
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
      details = <CustomFields />;
    } else {
      details = '';
    }

    const wrappingUp = this.props.selectedInteraction.status === 'wrapup';

    const buttonConfig = [
      {
        id: 'copy-chat-transcript',
        type: 'secondary',
        text: this.props.isCopied ? messages.copied : messages.copy,
        title: this.props.isCopied
          ? messages.copiedTranscript
          : messages.copyTranscript,
        onClick: this.copy,
      },
      {
        id: wrappingUp ? 'wrapup-button' : 'end-chat-button',
        type: 'primaryBlue',
        text: wrappingUp ? messages.endWrapup : messages.endChat,
        onClick: this.props.endInteraction,
        disabled: this.props.isEndWrapupDisabled,
        tooltipText: this.props.wrapupBtnTooltipText,
      },
    ];

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
          } else if (
            message.type === 'agent' &&
            message.from === this.props.agentId
          ) {
            messageFrom = 'Agent';
          } else {
            messageFrom = message.from;
          }
          return (
            <div
              key={message.from + message.timestamp}
              style={this.styles.messageHistoryItem}
            >
              {message.type === 'system' ? (
                <span style={this.styles.systemMessage}>
                  {message.text}
                </span>
              ) : (
                <div>
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
                </div>
              )}
            </div>
          );
        }
      );

      content = (
        <div style={this.styles.messagingContainer}>
          <div id="message-history" style={this.styles.messageHistory}>
            {messageHistory}
          </div>
          {this.props.selectedInteraction.status !== 'wrapup' &&
            this.props.selectedInteraction.status !==
              'work-ended-pending-script' && (
            <MessagingTextArea
              selectedInteraction={this.props.selectedInteraction}
              messageTemplates={this.props.messageTemplates}
            />
          )}
        </div>
      );
    }

    return (
      <ContentArea
        interaction={this.props.selectedInteraction}
        from={from}
        buttonConfig={buttonConfig}
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
  agentId: PropTypes.string.isRequired,
  isEndWrapupDisabled: PropTypes.bool.isRequired,
  wrapupBtnTooltipText: PropTypes.object.isRequired,
  copyChatTranscript: PropTypes.func.isRequired,
  isCopied: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  agentId: selectAgent(state, props).userId,
  isEndWrapupDisabled: selectIsEndWrapupDisabled(state, props),
  wrapupBtnTooltipText: selectWrapupBtnTooltipText(state, props),
  isCopied: isMessagingInteractionCopied(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    copyChatTranscript: (interaction) =>
      dispatch(copyChatTranscript(interaction)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(MessagingContentArea))
);
