/*
 *
 * MessagingContentArea
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedTime } from 'react-intl';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Icon from 'components/Icon';
import LoadingText from 'components/LoadingText';

import ContentArea from 'containers/ContentArea';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class MessagingContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessageTemplateMenu: false,
      selectedMessageTemplateIndex: 0,
      messageText: '',
    };
    this.toggleMessageTemplateMenu = this.toggleMessageTemplateMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addMessageTemplate = this.addMessageTemplate.bind(this);
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

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  toggleMessageTemplateMenu() {
    if (!this.state.showMessageTemplateMenu) {
      document.addEventListener('keydown', this.handleKeyDown);
    } else {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    this.setState({ showMessageTemplateMenu: !this.state.showMessageTemplateMenu });
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      this.setState({ selectedMessageTemplateIndex: this.state.selectedMessageTemplateIndex > 0 ? this.state.selectedMessageTemplateIndex - 1 : 0 });
    } else if (e.key === 'ArrowDown') {
      this.setState({ selectedMessageTemplateIndex: this.state.selectedMessageTemplateIndex < this.props.messageTemplates.length - 1 ? this.state.selectedMessageTemplateIndex + 1 : this.state.selectedMessageTemplateIndex });
    } else if (e.key === 'Enter') {
      this.addMessageTemplate();
    } else if (e.key === 'Escape') {
      this.setState({ showMessageTemplateMenu: false });
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  selectMessageTemplateIndex(selectedMessageTemplateIndex) {
    this.setState({ selectedMessageTemplateIndex });
  }

  addMessageTemplate() {
    this.messageTextarea.focus();
    this.setState({
      messageText: `${this.state.messageText}${this.props.messageTemplates[this.state.selectedMessageTemplateIndex].template}`,
      showMessageTemplateMenu: false,
    });
  }

  setMessageText(messageText) {
    this.setState({ messageText });
  }

  sendMessageOnEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!this.state.showMessageTemplateMenu) {
        this.sendMessage();
      }
      return false;
    } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.state.showMessageTemplateMenu) {
      e.preventDefault();
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
    messageTemplatesContainer: {
      position: 'absolute',
      bottom: '52px',
      left: '56px',
      width: 'calc(100% - 122px)',
      maxHeight: 'calc(100% - 68px)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E4E4E4',
      borderRight: '1px solid #E4E4E4',
      borderLeft: '1px solid #E4E4E4',
      borderRadius: '3px 3px 0 0',
      boxShadow: '0 0 6px 0 rgba(0,0,0,0.1)',
    },
    messageTemplatesHeader: {
      backgroundColor: '#E4E4E4',
      fontSize: '12px',
      padding: '10px 13px',
    },
    bold: {
      fontWeight: 'bold',
    },
    right: {
      float: 'right',
    },
    messageTemplates: {
      fontSize: '14px',
      padding: '8px',
      height: 'calc(100% - 38px)',
      overflowY: 'auto',
    },
    messageTemplate: {
      padding: '8px 12px',
      borderRadius: '3px',
      cursor: 'pointer',
    },
    selectedMessageTemplate: {
      backgroundColor: '#DEF8FE',
    },
    messageTextareaContainer: {
      flex: '0 1 36px',
    },
    templateMenuButton: {
      height: '36px',
      width: '40px',
      verticalAlign: 'top',
      fontSize: '24px',
      padding: 0,
      borderRadius: '3px 0 0 3px',
    },
    messageTextarea: {
      padding: '4px',
      resize: 'none',
      borderRadius: this.props.messageTemplates && this.props.messageTemplates.length > 0 ? '0' : '3px 0 0 3px',
      borderTop: '1px solid #23CEF5',
      borderBottom: '1px solid #23CEF5',
      borderLeft: this.props.messageTemplates && this.props.messageTemplates.length > 0 ? '' : '1px solid #23CEF5',
      height: '36px',
      width: this.props.messageTemplates && this.props.messageTemplates.length > 0 ? 'calc(100% - 90px)' : 'calc(100% - 50px)',
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

    const wrappingUp = this.props.selectedInteraction.status === 'wrapup';

    const buttons = (
      <Button
        id={wrappingUp ? 'wrapup-button' : 'end-chat-button'}
        key={wrappingUp ? 'wrapup-button' : 'end-chat-button'}
        type="primaryBlue"
        text={wrappingUp ? messages.endWrapup : messages.endChat}
        onClick={this.props.endInteraction}
        disabled={isAccepting || this.props.awaitingDisposition}
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
          {
            this.state.showMessageTemplateMenu
            ? <div id="messageTemplatesContainer" style={this.styles.messageTemplatesContainer}>
              <div style={this.styles.messageTemplatesHeader}>
                <span style={this.styles.bold}>
                  <FormattedMessage {...messages.messagingTemplates} />
                </span>
                <span style={this.styles.right}>
                  <Icon name="arrow_up_down" />
                  &nbsp;
                  <FormattedMessage {...messages.toNavigate} />
                  &nbsp;&nbsp;&nbsp;
                  <Icon name="arrow_return" />
                  &nbsp;
                  <FormattedMessage {...messages.toSelect} />
                  &nbsp;&nbsp;&nbsp;
                  <span>
                    <span style={this.styles.bold}>
                      <FormattedMessage {...messages.esc} />
                    </span>
                    &nbsp;
                    <FormattedMessage {...messages.toDismiss} />
                  </span>
                </span>
              </div>
              <div style={this.styles.messageTemplates}>
                {
                  this.props.messageTemplates.map((messageTemplate, messageTemplateIndex) =>
                    <div
                      className="messageTemplate" key={messageTemplate.id}
                      onClick={() => this.addMessageTemplate()}
                      onFocus={() => this.selectMessageTemplateIndex(messageTemplateIndex)}
                      onMouseOver={() => this.selectMessageTemplateIndex(messageTemplateIndex)}
                      style={[this.styles.messageTemplate, this.state.selectedMessageTemplateIndex === messageTemplateIndex ? this.styles.selectedMessageTemplate : {}]}
                    >
                      <span style={this.styles.bold}>{ messageTemplate.name }</span>&nbsp;
                      <span>{ messageTemplate.template }</span>
                    </div>
                  )
                }
              </div>
            </div>
            : undefined
          }
          <div style={this.styles.messageTextareaContainer}>
            {
              this.props.messageTemplates && this.props.messageTemplates.length > 0
              ? <Button id="templateMenuButton" disabled={this.props.selectedInteraction.status === 'wrapup'} onClick={this.toggleMessageTemplateMenu} type="secondary" style={this.styles.templateMenuButton}>
                <span>+</span>
              </Button>
              : undefined
            }
            <textarea
              id="messageTextarea"
              ref={(textarea) => { this.messageTextarea = textarea; }}
              disabled={this.props.selectedInteraction.status === 'wrapup'}
              style={this.styles.messageTextarea}
              value={this.state.messageText}
              onChange={(e) => this.setMessageText(e.target.value)}
              onKeyDown={this.sendMessageOnEnter}
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
  messageTemplates: PropTypes.array,
  endInteraction: PropTypes.func.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

export default connect(mapStateToProps)(Radium(MessagingContentArea));
