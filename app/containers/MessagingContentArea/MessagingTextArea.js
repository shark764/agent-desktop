/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Textarea from 'react-textarea-autosize';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import Icon from 'components/Icon';

import { saveMessageState } from 'containers/AgentDesktop/actions';
import { initializeOutboundSmsFromMessaging, sendOutboundSms } from './actions';
import messages from './messages';

const styles = {
  messageTemplatesContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  messageTemplatesContainerAgentDesktop: {
    left: '56px',
    width: 'calc(100% - 122px)',
    maxHeight: 'calc(100% - 102px)',
    borderTop: '1px solid #E4E4E4',
    borderRight: '1px solid #E4E4E4',
    borderLeft: '1px solid #E4E4E4',
    borderRadius: '3px 3px 0 0',
    boxShadow: '0 0 6px 0 rgba(0,0,0,0.1)',
  },
  messageTemplatesContainerToolbar: {
    left: 0,
    width: '100%',
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
    flex: '0 1 50px',
    maxHeight: '95px',
  },
  templateMenuButton: {
    height: 'calc(100% - 4px)',
    width: '40px',
    verticalAlign: 'top',
    fontSize: '24px',
    padding: 0,
    borderRadius: '3px 0 0 3px',
  },
  messageTextarea: {
    padding: '4px',
    resize: 'none',
    width: 'calc(100% - 50px)',
    borderTop: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderRight: 'none',
    borderLeft: '1px solid #979797',
    borderRadius: '3px 0 0 3px',
  },
  messageTextareaWithTemplates: {
    padding: '4px',
    resize: 'none',
    width: 'calc(100% - 90px)',
    borderTop: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderRight: 'none',
    borderLeft: 'none',
    borderRadius: '0',
  },
  messageButton: {
    height: 'calc(100% - 4px)',
    width: '50px',
    verticalAlign: 'top',
    fontSize: '11px',
    padding: 0,
    borderRadius: '0 3px 3px 0',
  },
};

export class MessagingTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageTemplateMenu: false,
      showMessageTemplateMenuByForwardSlash: false,
      messageTemplateFilter: undefined,
      selectedMessageTemplateIndex: 0,
      messageTextareaHeight: 50,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.selectedInteraction.interactionId !==
      nextProps.selectedInteraction.interactionId
    ) {
      this.setState({
        showMessageTemplateMenu: false,
        showMessageTemplateMenuByForwardSlash: false,
        messageTemplateFilter: undefined,
        selectedMessageTemplateIndex: 0,
        messageTextareaHeight: 50,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  toggleMessageTemplateMenu = () => {
    if (!this.state.showMessageTemplateMenu) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.setState({
        showMessageTemplateMenu: true,
        selectedMessageTemplateIndex: 0,
      });
    } else {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.setState({
        showMessageTemplateMenu: false,
        showMessageTemplateMenuByForwardSlash: false,
        messageTemplateFilter: undefined,
      });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      let newSelectedMessageTemplateIndex = this.state
        .selectedMessageTemplateIndex;
      if (!this.state.showMessageTemplateMenuByForwardSlash) {
        newSelectedMessageTemplateIndex =
          this.state.selectedMessageTemplateIndex > 0
            ? this.state.selectedMessageTemplateIndex - 1
            : 0;
      } else {
        // If we're filtering based on "/" text, select the previous unfiltered one
        for (
          let i = this.state.selectedMessageTemplateIndex - 1;
          i >= 0;
          i -= 1
        ) {
          if (
            this.props.messageTemplates[i].name
              .toUpperCase()
              .includes(this.state.messageTemplateFilter.toUpperCase())
          ) {
            newSelectedMessageTemplateIndex = i;
            break;
          }
        }
      }
      this[
        `messageTemplate-${newSelectedMessageTemplateIndex}`
      ].scrollIntoView();
      this.setState({
        selectedMessageTemplateIndex: newSelectedMessageTemplateIndex,
      });
    } else if (e.key === 'ArrowDown') {
      let newSelectedMessageTemplateIndex = this.state
        .selectedMessageTemplateIndex;
      if (!this.state.showMessageTemplateMenuByForwardSlash) {
        newSelectedMessageTemplateIndex =
          this.state.selectedMessageTemplateIndex <
          this.props.messageTemplates.length - 1
            ? this.state.selectedMessageTemplateIndex + 1
            : this.state.selectedMessageTemplateIndex;
      } else {
        // If we're filtering based on "/" text, select the next unfiltered one
        for (
          let i = this.state.selectedMessageTemplateIndex + 1;
          i < this.props.messageTemplates.length;
          i += 1
        ) {
          if (
            this.props.messageTemplates[i].name
              .toUpperCase()
              .includes(this.state.messageTemplateFilter.toUpperCase())
          ) {
            newSelectedMessageTemplateIndex = i;
            break;
          }
        }
      }
      this[
        `messageTemplate-${newSelectedMessageTemplateIndex}`
      ].scrollIntoView();
      this.setState({
        selectedMessageTemplateIndex: newSelectedMessageTemplateIndex,
      });
    } else if (e.key === 'Enter') {
      this.addMessageTemplate();
    } else if (e.key === 'Escape') {
      this.setState({
        showMessageTemplateMenu: false,
        showMessageTemplateMenuByForwardSlash: false,
        messageTemplateFilter: undefined,
      });
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  };

  selectMessageTemplateIndex = (selectedMessageTemplateIndex) => {
    this.setState({ selectedMessageTemplateIndex });
  };

  addMessageTemplate = () => {
    this.messageTextarea.focus();
    let newMessageText = this.props.selectedInteraction.currentMessage;
    if (this.state.showMessageTemplateMenuByForwardSlash) {
      newMessageText = newMessageText.substring(
        0,
        newMessageText.lastIndexOf('/')
      );
    }
    this.props.saveMesssageState(
      this.props.selectedInteraction.interactionId,
      `${newMessageText}${
        this.props.messageTemplates[this.state.selectedMessageTemplateIndex]
          .template
      }`
    );
    this.setState({
      showMessageTemplateMenu: false,
      showMessageTemplateMenuByForwardSlash: false,
      messageTemplateFilter: undefined,
    });
    document.removeEventListener('keydown', this.handleKeyDown);
  };

  setMessageText = (messageText) => {
    // If we're filtering based on "/" text, reset the selected message template to the first unfiltered one
    let newSelectedMessageTemplateIndex;
    let newMessageTemplateFilter;
    if (this.state.showMessageTemplateMenuByForwardSlash) {
      newMessageTemplateFilter = messageText.substring(
        messageText.lastIndexOf('/') + 1
      );
      for (let i = 0; i < this.props.messageTemplates.length; i += 1) {
        if (
          this.props.messageTemplates[i].name
            .toUpperCase()
            .includes(newMessageTemplateFilter.toUpperCase())
        ) {
          newSelectedMessageTemplateIndex = i;
          break;
        }
      }
      this.setState({
        messageTemplateFilter: newMessageTemplateFilter,
        selectedMessageTemplateIndex:
          newSelectedMessageTemplateIndex !== undefined
            ? newSelectedMessageTemplateIndex
            : this.state.selectedMessageTemplateIndex,
      });
    }
    this.props.saveMesssageState(
      this.props.selectedInteraction.interactionId,
      messageText
    );
  };

  onMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!this.state.showMessageTemplateMenu) {
        this.sendMessage();
      }
      return false;
    } else if (
      (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
      this.state.showMessageTemplateMenu
    ) {
      e.preventDefault();
      return false;
    } else if (
      e.key === '/' &&
      this.props.messageTemplates &&
      this.props.messageTemplates.length > 0 &&
      !this.state.showMessageTemplateMenu &&
      !this.state.showMessageTemplateMenuByForwardSlash
    ) {
      this.setState({
        showMessageTemplateMenuByForwardSlash: true,
      });
      this.toggleMessageTemplateMenu();
      return true;
    } else {
      return true;
    }
  };

  sendMessage = () => {
    if (
      this.props.selectedInteraction.currentMessage &&
      this.props.selectedInteraction.currentMessage.trim() !== ''
    ) {
      if (this.props.selectedInteraction.status === 'connecting-to-outbound') {
        this.props.initializeOutboundSmsFromMessaging(
          this.props.selectedInteraction.interactionId,
          this.props.selectedInteraction.customer,
          this.props.selectedInteraction.contact
            ? this.props.selectedInteraction.contact.id
            : null,
          this.props.selectedInteraction.currentMessage
        );
      } else if (
        this.props.selectedInteraction.status === 'initialized-outbound'
      ) {
        this.props.sendOutboundSms(
          this.props.selectedInteraction.interactionId,
          this.props.selectedInteraction.currentMessage
        );
      } else {
        CxEngage.interactions.messaging.sendMessage({
          interactionId: this.props.selectedInteraction.interactionId,
          message: this.props.selectedInteraction.currentMessage,
        });
      }
      this.props.saveMesssageState(
        this.props.selectedInteraction.interactionId,
        ''
      );
    }
  };

  render() {
    return (
      <div style={styles.messageTextareaContainer}>
        {this.state.showMessageTemplateMenu ? (
          <div
            id="messageTemplatesContainer"
            style={[
              styles.messageTemplatesContainer,
              this.context.toolbarMode
                ? styles.messageTemplatesContainerToolbar
                : styles.messageTemplatesContainerAgentDesktop,
              this.context.toolbarMode && {
                height: `calc(100% - ${14 +
                  this.state.messageTextareaHeight}px)`,
              },
              { bottom: 14 + this.state.messageTextareaHeight },
            ]}
          >
            <div style={styles.messageTemplatesHeader}>
              <span style={styles.bold}>
                <FormattedMessage {...messages.messagingTemplates} />
              </span>
              <span style={styles.right}>
                <Icon name="arrow_up_down" />
                &nbsp;
                <FormattedMessage {...messages.toNavigate} />
                &nbsp;&nbsp;&nbsp;
                <Icon name="arrow_return" />
                &nbsp;
                <FormattedMessage {...messages.toSelect} />
                &nbsp;&nbsp;&nbsp;
                <span>
                  <span style={styles.bold}>
                    <FormattedMessage {...messages.esc} />
                  </span>
                  {!this.context.toolbarMode && (
                    <span>
                      &nbsp;
                      <FormattedMessage {...messages.toDismiss} />
                    </span>
                  )}
                </span>
              </span>
            </div>
            <div style={styles.messageTemplates}>
              {this.props.messageTemplates.map(
                (messageTemplate, messageTemplateIndex) => {
                  if (
                    !this.state.showMessageTemplateMenuByForwardSlash ||
                    !this.state.messageTemplateFilter ||
                    messageTemplate.name
                      .toUpperCase()
                      .includes(this.state.messageTemplateFilter.toUpperCase())
                  ) {
                    return (
                      <div
                        className="messageTemplate"
                        key={messageTemplate.id}
                        ref={(c) => {
                          this[`messageTemplate-${messageTemplateIndex}`] = c;
                        }}
                        onClick={() => this.addMessageTemplate()}
                        onFocus={() =>
                          this.selectMessageTemplateIndex(messageTemplateIndex)
                        }
                        onMouseOver={() =>
                          this.selectMessageTemplateIndex(messageTemplateIndex)
                        }
                        style={[
                          styles.messageTemplate,
                          this.state.selectedMessageTemplateIndex ===
                          messageTemplateIndex
                            ? styles.selectedMessageTemplate
                            : {},
                        ]}
                      >
                        <span style={styles.bold}>
                          /
                          {messageTemplate.name}
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <span>
                          {messageTemplate.template}
                        </span>
                      </div>
                    );
                  } else {
                    return undefined;
                  }
                }
              )}
            </div>
          </div>
        ) : (
          undefined
        )}
        {this.props.messageTemplates &&
          this.props.messageTemplates.length > 0 &&
          this.props.selectedInteraction.status !== 'wrapup' && (
          <Button
            id="templateMenuButton"
            onClick={this.toggleMessageTemplateMenu}
            type="secondary"
            style={styles.templateMenuButton}
          >
            {'+'}
          </Button>
        )}
        <style>
          {/* This style is here because the Textarea library doesn't render the ':focus' Radium attribute */}
          {`#messageTextarea:focus { outline: none; border-top: 1px solid #23CEF5 !important; border-bottom: 1px solid #23CEF5 !important; border-left: ${
            this.props.messageTemplates &&
            this.props.messageTemplates.length > 0
              ? '0;'
              : '1px solid #23CEF5 !important;'
          }}`}
        </style>
        {this.props.selectedInteraction.status !== 'wrapup' && (
          <Textarea
            minRows={2}
            maxRows={4}
            onHeightChange={(messageTextareaHeight) =>
              this.setState({ messageTextareaHeight })
            }
            id="messageTextarea"
            inputRef={(input) => {
              this.messageTextarea = input;
            }}
            style={
              this.props.messageTemplates &&
              this.props.messageTemplates.length > 0
                ? styles.messageTextareaWithTemplates
                : styles.messageTextarea
            }
            value={this.props.selectedInteraction.currentMessage}
            onChange={(e) => this.setMessageText(e.target.value)}
            onKeyDown={this.onMessageKeyDown}
            autoFocus
          />
        )}
        {this.props.selectedInteraction.status !== 'wrapup' && (
          <Button
            id="sendMessageButton"
            onClick={this.sendMessage}
            type="secondary"
            style={styles.messageButton}
            text={messages.send}
          />
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initializeOutboundSmsFromMessaging: (
      interactionId,
      phoneNumber,
      contactId,
      message
    ) =>
      dispatch(
        initializeOutboundSmsFromMessaging(
          interactionId,
          phoneNumber,
          contactId,
          message
        )
      ),
    sendOutboundSms: (interactionId, message) =>
      dispatch(sendOutboundSms(interactionId, message)),
    saveMesssageState: (interactionId, message) =>
      dispatch(saveMessageState(interactionId, message)),
    dispatch,
  };
}

MessagingTextArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  messageTemplates: PropTypes.array.isRequired,
  initializeOutboundSmsFromMessaging: PropTypes.func.isRequired,
  sendOutboundSms: PropTypes.func.isRequired,
  saveMesssageState: PropTypes.func.isRequired,
};

MessagingTextArea.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(
    null,
    mapDispatchToProps
  )(Radium(MessagingTextArea))
);
