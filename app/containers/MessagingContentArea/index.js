/*
 *
 * MessagingContentArea
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';
import { FormattedMessage, FormattedTime } from 'react-intl';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import LoadingText from 'components/LoadingText';

import ContentArea from 'containers/ContentArea';

import messages from './messages';

export class MessagingContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messageText: '',
    };
    this.setMessageText = this.setMessageText.bind(this);
    this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
      return false;
    } else {
      return true;
    }
  }

  sendMessage() {
    if (this.state.messageText.trim() !== '') {
      SDK.interactions.messaging.sendMessage({
        interactionId: this.props.selectedInteraction.interactionId,
        message: this.state.messageText,
      });
      this.setMessageText('');
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
    messageTextareaContainer: {
      flex: '0 1 36px',
    },
    messageTextarea: {
      padding: '4px',
      resize: 'none',
      borderRadius: '3px 0  0 3px',
      borderTop: '1px solid #23CEF5',
      borderBottom: '1px solid #23CEF5',
      borderLeft: '1px solid #23CEF5',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.07)',
      height: '36px',
      width: 'calc(100% - 50px)',
    },
    messageButton: {
      height: '36px',
      width: '50px',
      verticalAlign: 'top',
      fontSize: '11px',
      padding: 0,
      borderRadius: '0 3px 3px 0',
    },
  };

  render() {
    const isAccepting = this.props.selectedInteraction.status === 'work-accepting';

    const from = this.props.selectedInteraction.contact !== undefined ? this.props.selectedInteraction.contact.attributes.name : this.props.selectedInteraction.messageHistory[0].from;

    let details;
    if (this.props.selectedInteraction.customFields) {
      details = this.props.selectedInteraction.customFields.map((customField) =>
        <div key={customField.label + customField.value} style={this.styles.customField}>
          <div style={this.styles.customFieldLabel}>
            {customField.label}
          </div>
          <div style={this.styles.customFieldValue}>
            {customField.value}
          </div>
        </div>
      );
    } else {
      details = '';
    }

    const buttons = (
      <Button
        id={this.props.selectedInteraction.status === 'wrapup' ? 'wrapup-button' : 'end-chat-button'}
        type="primaryBlue"
        text={this.props.selectedInteraction.status === 'wrapup' ? messages.endWrapup : messages.endChat}
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
      const messageHistory = this.props.selectedInteraction.messageHistory.map((message) => {
        let messageFrom;
        if ((message.type === 'customer' || message.type === 'message') && this.props.selectedInteraction.contact !== undefined) {
          messageFrom = this.props.selectedInteraction.contact.attributes.name;
        } else {
          messageFrom = message.from;
        }
        return (
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
            }
          </div>
        );
      });

      content = (
        <div style={this.styles.messagingContainer}>
          <div id="message-history" style={this.styles.messageHistory}>
            {messageHistory}
          </div>
          <div style={this.styles.messageTextareaContainer}>
            <textarea
              id="messageTextarea"
              disabled={this.props.selectedInteraction.status === 'wrapup'}
              style={this.styles.messageTextarea}
              value={this.state.messageText}
              onChange={(e) => this.setMessageText(e.target.value)}
              onKeyPress={this.sendMessageOnEnter}
            />
            <Button id="sendMessageButton" disabled={this.props.selectedInteraction.status === 'wrapup'} onClick={this.sendMessage} type="secondary" style={this.styles.messageButton}>
              <FormattedMessage {...messages.send} />
            </Button>
          </div>
        </div>
      );
    }

    return <ContentArea interaction={this.props.selectedInteraction} from={from} buttons={buttons} details={details} content={content} />;
  }
}

MessagingContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
};

export default Radium(MessagingContentArea);
