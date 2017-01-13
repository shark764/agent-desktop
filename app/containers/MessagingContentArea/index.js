/*
 *
 * MessagingContentArea
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';

import messages from './messages';
import { FormattedTime } from 'react-intl';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import LoadingText from 'components/LoadingText';

import ContentArea from 'containers/ContentArea';

export class MessagingContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
    };
    this.setMessageText = this.setMessageText.bind(this);
    this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
  }

  componentDidUpdate() {
    // Scroll to bottom of message history
    const messsageHistoryDiv = document.getElementById('message-history');
    if (messsageHistoryDiv) {
      messsageHistoryDiv.scrollTop = messsageHistoryDiv.scrollHeight;
    }
  }

  setMessageText(messageText) {
    this.setState({ messageText });
  }

  sendMessageOnEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      SDK.Agent.Session.Messaging.sendMessage({
        message: this.state.messageText,
        interactionId: this.props.selectedInteraction.interactionId,
      });
      this.setMessageText('');
      return false;
    } else {
      return true;
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
    },
    messageTextarea: {
      flex: '0 1 36px',
      minHeight: '36px',
      resize: 'none',
      borderRadius: '3px',
      border: '1px solid #23CEF5',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)',
    },
  };

  render() {
    const isAccepting = this.props.selectedInteraction.status === 'work-accepting';

    const from = this.props.selectedInteraction.messageHistory[0].from;

    const details = this.props.selectedInteraction.customFields.map((customField) =>
      <div key={customField.label + customField.value} style={this.styles.customField}>
        <div style={this.styles.customFieldLabel}>
          {customField.label}
        </div>
        <div style={this.styles.customFieldValue}>
          {customField.value}
        </div>
      </div>
    );

    const buttons = (
      <Button
        type="primaryBlue"
        text={messages.endChat}
        onClick={this.props.endInteraction}
        disabled={isAccepting}
      />
    );

    let content;
    if (isAccepting) {
      content = (
        <div>
          <LoadingText withSquare />
          <LoadingText />
        </div>
      );
    } else {
      const messageHistory = this.props.selectedInteraction.messageHistory.map((message) =>
        <div key={message.from + message.timestamp} style={this.styles.messageHistoryItem}>
          {
            message.type === 'system'
            ? <span style={this.styles.systemMessage}>
              {message.text}
            </span>
            : <div>
              <div style={this.styles.avatarContainer}>
                <Avatar customerAvatarIndex={message.type === 'agent' ? undefined : this.props.selectedInteraction.customerAvatarIndex} />
              </div>
              <div style={this.styles.messageContainer}>
                <span style={this.styles.messageFrom}>
                  {message.from}
                </span>
                <span style={this.styles.messageTime}>
                  <FormattedTime value={new Date(message.timestamp)} />
                </span>
                <div style={this.styles.messageText}>
                  {message.text}
                </div>
              </div>
            </div>
          }
        </div>
      );

      content = (
        <div style={this.styles.messagingContainer}>
          <div id="message-history" style={this.styles.messageHistory}>
            {messageHistory}
          </div>
          <textarea
            style={this.styles.messageTextarea}
            value={this.state.messageText}
            onChange={(e) => this.setMessageText(e.target.value)}
            onKeyPress={this.sendMessageOnEnter}
          />
        </div>
      );
    }

    return <ContentArea from={from} buttons={buttons} details={details} content={content} />;
  }
}


MessagingContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
};

export default Radium(MessagingContentArea);
