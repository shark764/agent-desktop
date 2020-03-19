/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Textarea from 'react-textarea-autosize';
import debounce from 'lodash/debounce';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

import { generateUUID } from 'utils/uuid';

import {
  saveMessageState,
  setCustomerRead,
  setMessageTemplateFilter,
  setMessageTemplateIndex,
  addSmoochPendingMessage,
} from 'containers/AgentDesktop/actions';
import {
  initializeOutboundSmsFromMessaging,
  sendOutboundSms,
  copyChatTranscript,
  sendSmoochMessage,
} from './actions';
import messages from './messages';
const styles = {
  messageTemplatesContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
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
  templateMenuButton: {
    width: '40px',
    verticalAlign: 'top',
    fontSize: '24px',
    padding: 0,
    borderRadius: '3px 0 0 3px',
  },
  messageTextarea: {
    padding: '4px',
    resize: 'none',
    flex: 1,
    borderTop: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderRight: 'none',
    borderLeft: '1px solid #979797',
    borderRadius: '3px 0 0 3px',
  },
  messageTextareaWithTemplatesOrFile: {
    padding: '4px',
    resize: 'none',
    flex: 1,
    borderTop: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderRight: 'none',
    borderLeft: 'none',
    borderRadius: '0',
  },
  messageButton: {
    width: '50px',
    verticalAlign: 'top',
    fontSize: '11px',
    padding: 0,
    borderRadius: '0 3px 3px 0',
  },
  attachmentArea: {
    borderTop: '1px solid #979797',
    borderBottom: '1px solid #979797',
    borderRight: 'none',
    borderLeft: '1px solid #979797',
    borderRadius: '3px 0 0 3px',
    maxWidth: '25%',
    padding: '4px',
  },
  attachmentAreaWithTemplates: {
    borderLeft: 'none',
    borderRadius: '0',
  },
  addAttachment: {
    position: 'absolute',
    fontSize: '12px',
    height: '26px',
    padding: '9px 10px',
    margin: '4px 20px 0 0',
    border: '1px solid transparent',
    right: '54px',
    bottom: '29px',
    cursor: 'pointer',
  },
  attachmentContainer: {
    display: 'inline-flex',
    borderRadius: '2px',
    fontSize: '12px',
    left: '30px',
    bottom: '23px',
    backgroundColor: '#eee',
    padding: '8px',
    width: '100%',
    maxWidth: '150px',
    height: '32px',
  },
  attachmentName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  disableAddAttachment: {
    cursor: 'not-allowed',
    color: '#ddd',
  },
};

export class MessagingTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageTemplateMenu: false,
      showMessageTemplateMenuByForwardSlash: false,
      messageTextareaHeight: 50,
      isTyping: false,
      attachedFile: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.selectedInteraction.interactionId !==
      nextProps.selectedInteraction.interactionId
    ) {
      if (this.props.selectedInteraction.source === 'smooch') {
        this.setState({
          showMessageTemplateMenu: false,
          showMessageTemplateMenuByForwardSlash: false,
        });
      } else {
        this.setState({
          showMessageTemplateMenu: false,
          showMessageTemplateMenuByForwardSlash: false,
          messageTextareaHeight: 50,
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);

    if (this.state.isTyping) {
      /**
       *  We cancel the debounce function to avoid updating the state
       *  after unmounting and avoiding memory leaks, and inmediately send the typing indicator as false.
       */
      this.handleTyping.cancel();
      CxEngage.interactions.messaging.sendSmoochTypingIndicator({
        interactionId: this.props.selectedInteraction.interactionId,
        typing: false,
      });
    }
  }

  toggleMessageTemplateMenu = () => {
    if (!this.state.showMessageTemplateMenu) {
      document.addEventListener('keydown', this.handleKeyDown);
      this.props.setMessageTemplateIndex(
        this.props.selectedInteraction.interactionId,
        0
      );
      this.setState({
        showMessageTemplateMenu: true,
      });
    } else {
      document.removeEventListener('keydown', this.handleKeyDown);
      this.props.setMessageTemplateFilter(
        this.props.selectedInteraction.interactionId
      );
      this.setState({
        showMessageTemplateMenu: false,
        showMessageTemplateMenuByForwardSlash: false,
      });
    }
  };

  handleKeyDown = e => {
    if (e.key === 'ArrowUp') {
      let newSelectedMessageTemplateIndex = this.props.selectedInteraction
        .selectedMessageTemplateIndex;
      if (!this.state.showMessageTemplateMenuByForwardSlash) {
        newSelectedMessageTemplateIndex =
          this.props.selectedInteraction.selectedMessageTemplateIndex > 0
            ? this.props.selectedInteraction.selectedMessageTemplateIndex - 1
            : 0;
      } else {
        // If we're filtering based on "/" text, select the previous unfiltered one
        for (
          let i =
            this.props.selectedInteraction.selectedMessageTemplateIndex - 1;
          i >= 0;
          i -= 1
        ) {
          if (
            this.props.messageTemplates[i].name
              .toUpperCase()
              .includes(
                this.props.selectedInteraction.messageTemplateFilter.toUpperCase()
              )
          ) {
            newSelectedMessageTemplateIndex = i;
            break;
          }
        }
      }
      this[
        `messageTemplate-${newSelectedMessageTemplateIndex}`
      ].scrollIntoView();
      this.props.setMessageTemplateIndex(
        this.props.selectedInteraction.interactionId,
        newSelectedMessageTemplateIndex
      );
    } else if (e.key === 'ArrowDown') {
      let newSelectedMessageTemplateIndex = this.props.selectedInteraction
        .selectedMessageTemplateIndex;
      if (!this.state.showMessageTemplateMenuByForwardSlash) {
        newSelectedMessageTemplateIndex =
          this.props.selectedInteraction.selectedMessageTemplateIndex <
          this.props.messageTemplates.length - 1
            ? this.props.selectedInteraction.selectedMessageTemplateIndex + 1
            : this.props.selectedInteraction.selectedMessageTemplateIndex;
      } else {
        // If we're filtering based on "/" text, select the next unfiltered one
        for (
          let i =
            this.props.selectedInteraction.selectedMessageTemplateIndex + 1;
          i < this.props.messageTemplates.length;
          i += 1
        ) {
          if (
            this.props.messageTemplates[i].name
              .toUpperCase()
              .includes(
                this.props.selectedInteraction.messageTemplateFilter.toUpperCase()
              )
          ) {
            newSelectedMessageTemplateIndex = i;
            break;
          }
        }
      }
      this[
        `messageTemplate-${newSelectedMessageTemplateIndex}`
      ].scrollIntoView();
      this.props.setMessageTemplateIndex(
        this.props.selectedInteraction.interactionId,
        newSelectedMessageTemplateIndex
      );
    } else if (e.key === 'Enter') {
      this.addMessageTemplate();
    } else if (e.key === 'Escape') {
      this.setState({
        showMessageTemplateMenu: false,
        showMessageTemplateMenuByForwardSlash: false,
      });
      this.props.setMessageTemplateFilter(
        this.props.selectedInteraction.interactionId
      );
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  };

  selectMessageTemplateIndex = selectedMessageTemplateIndex => {
    this.props.setMessageTemplateIndex(
      this.props.selectedInteraction.interactionId,
      selectedMessageTemplateIndex
    );
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
    this.props.saveMessageState(
      this.props.selectedInteraction.interactionId,
      `${newMessageText}${
        this.props.messageTemplates[
          this.props.selectedInteraction.selectedMessageTemplateIndex
        ].template
      }`,
      '',
      undefined
    );
    this.setState({
      showMessageTemplateMenu: false,
      showMessageTemplateMenuByForwardSlash: false,
    });
    this.props.setMessageTemplateFilter(
      this.props.selectedInteraction.interactionId
    );
    document.removeEventListener('keydown', this.handleKeyDown);
  };

  setMessageText = messageText => {
    // If we're filtering based on "/" text, reset the selected message template to the first unfiltered one
    let newSelectedMessageTemplateIndex;
    let newMessageTemplateFilter;

    // Send Typing indicator
    if (this.props.selectedInteraction.source === 'smooch') {
      this.handleTyping();
    }

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
    }
    this.props.saveMessageState(
      this.props.selectedInteraction.interactionId,
      messageText,
      newMessageTemplateFilter,
      newSelectedMessageTemplateIndex
    );
  };

  onMessageKeyDown = e => {
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
          this.props.selectedInteraction.currentMessage,
          this.props.selectedInteraction.popUri
        );
      } else if (
        this.props.selectedInteraction.status === 'initialized-outbound'
      ) {
        this.props.sendOutboundSms(
          this.props.selectedInteraction.interactionId,
          this.props.selectedInteraction.currentMessage
        );
      } else if (this.props.selectedInteraction.source === 'smooch') {
        if (this.state.attachedFile) {
          this.sendFile();
        }
        this.props.sendSmoochMessage(
          this.props.selectedInteraction.interactionId,
          {
            text: this.props.selectedInteraction.currentMessage,
          }
        );
        this.props.setCustomerRead(
          this.props.selectedInteraction.interactionId,
          false
        );
      } else {
        CxEngage.interactions.messaging.sendMessage({
          interactionId: this.props.selectedInteraction.interactionId,
          message: this.props.selectedInteraction.currentMessage,
        });
      }
      this.props.saveMessageState(
        this.props.selectedInteraction.interactionId,
        '',
        '',
        undefined
      );
    } else if (this.state.attachedFile) {
      this.sendFile();
    }
  };

  handleTyping = debounce(
    /**
     * sendSmoochTypingIndicator is invoked on leading with typing as true,
     * once the agent finishes typing (trailing) we wait 2 seconds to send the indicator again as false.
     * As we can only send execute the same function on leading and trailing, we use the component state to switch between true and false.
     */
    () => {
      CxEngage.interactions.messaging.sendSmoochTypingIndicator({
        interactionId: this.props.selectedInteraction.interactionId,
        typing: !this.state.isTyping,
      });
      this.setState(previousState => ({
        ...previousState,
        isTyping: !previousState.isTyping,
      }));
    },
    2000,
    { leading: true, trailing: true }
  );

  attachFile = fileList => {
    CxEngage.interactions.messaging.smoochAddAttachment({
      interactionId: this.props.selectedInteraction.interactionId,
      file: fileList[0],
    });
    this.setState(previousState => ({
      ...previousState,
      attachedFile: fileList[0],
    }));
  };

  removeFile = () => {
    CxEngage.interactions.messaging.smoochRemoveAttachment({
      interactionId: this.props.selectedInteraction.interactionId,
    });
    this.setState(previousState => ({
      ...previousState,
      attachedFile: null,
    }));
  };

  sendFile = () => {
    if (
      this.props.selectedInteraction.source === 'smooch' &&
      this.state.attachedFile
    ) {
      const { interactionId } = this.props.selectedInteraction;
      const { firstName, lastName, userId } = this.props.agent;
      const agentMessageId = generateUUID();
      CxEngage.interactions.messaging.sendSmoochAttachment({
        interactionId,
        agentMessageId,
      });
      this.props.addSmoochPendingMessage(interactionId, {
        agentMessageId,
        text: this.state.attachedFile.name,
        type: 'agent',
        from: `${firstName} ${lastName}`,
        resourceId: userId,
        pending: true,
        isFile: true,
        timestamp: Date.now(),
      });
      this.removeFile();
    }
  };

  render() {
    return (
      <div style={{ display: 'inline-flex' }}>
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
              { bottom: 9 + this.state.messageTextareaHeight },
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
                    !this.props.selectedInteraction.messageTemplateFilter ||
                    messageTemplate.name
                      .toUpperCase()
                      .includes(
                        this.props.selectedInteraction.messageTemplateFilter.toUpperCase()
                      )
                  ) {
                    return (
                      <div
                        className="messageTemplate"
                        key={messageTemplate.id}
                        ref={c => {
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
                          this.props.selectedInteraction
                            .selectedMessageTemplateIndex ===
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
          this.props.messageTemplates.length > 0 && (
          <Button
            id="templateMenuButton"
            onClick={this.toggleMessageTemplateMenu}
            type="secondary"
            style={[
              styles.templateMenuButton,
              { height: this.state.messageTextareaHeight },
            ]}
          >
            {'+'}
          </Button>
        )}

        {this.props.selectedInteraction.source === 'smooch' &&
          this.state.attachedFile && (
          <div
            style={[
              styles.attachmentArea,
              this.props.messageTemplates &&
                  this.props.messageTemplates.length > 0 &&
                  styles.attachmentAreaWithTemplates,
            ]}
          >
            <div
              title={this.state.attachedFile.name}
              style={{
                ...styles.attachmentContainer,
                ...(this.state.messageTextareaHeight > 50 && {
                  bottom: this.state.messageTextareaHeight - 24,
                }),
              }}
            >
              <span style={styles.attachmentName}>
                {this.state.attachedFile.name}
              </span>
              <div style={{ marginLeft: '5px' }} onClick={this.removeFile}>
                <IconSVG
                  id="removeFileIcon"
                  name="close"
                  color="grey"
                  width="12px"
                />
              </div>
            </div>
          </div>
        )}

        <style>
          {/* This style is here because the Textarea library doesn't render the ':focus' Radium attribute */}
          {`#messageTextarea:focus { outline: none; border-top: 1px solid #23CEF5 !important; border-bottom: 1px solid #23CEF5 !important; border-left: ${
            this.props.messageTemplates &&
            this.props.messageTemplates.length > 0 &&
            !this.state.attachedFile
              ? '0;'
              : '1px solid #23CEF5 !important;'
          }}`}
        </style>
        <Textarea
          minRows={2}
          maxRows={4}
          onHeightChange={messageTextareaHeight =>
            this.setState({ messageTextareaHeight })
          }
          id="messageTextarea"
          inputRef={input => {
            this.messageTextarea = input;
          }}
          style={{
            ...((this.props.messageTemplates &&
              this.props.messageTemplates.length > 0) ||
            (this.props.selectedInteraction.source === 'smooch' &&
              this.state.attachedFile)
              ? styles.messageTextareaWithTemplatesOrFile
              : styles.messageTextarea),
            ...(this.props.selectedInteraction.source === 'smooch' && {
              paddingRight: '45px',
            }),
          }}
          value={this.props.selectedInteraction.currentMessage}
          onChange={e => this.setMessageText(e.target.value)}
          onKeyDown={this.onMessageKeyDown}
          autoFocus
        />

        {this.props.selectedInteraction.source === 'smooch' && (
          <Fragment>
            <input
              id="attachmentFilePicker"
              type="file"
              value=""
              onChange={e => this.attachFile(e.target.files)}
              style={{ display: 'none' }}
              disabled={this.state.attachedFile !== null}
            />
            <label
              id="attachmentFilePickerLabel"
              htmlFor="attachmentFilePicker"
            >
              <div
                style={{
                  ...styles.addAttachment,
                  ...(this.state.attachedFile !== null &&
                    styles.disableAddAttachment),
                  ...(this.state.messageTextareaHeight > 50 && {
                    bottom: this.state.messageTextareaHeight - 14,
                  }),
                }}
              >
                <IconSVG
                  id="attachmentFileIcon"
                  name="attachment"
                  width="20px"
                  color="grey"
                  style={
                    this.state.attachedFile !== null
                      ? styles.disableAddAttachment
                      : {}
                  }
                />
              </div>
            </label>
          </Fragment>
        )}

        <Button
          id="sendMessageButton"
          onClick={this.sendMessage}
          type="secondary"
          style={[
            styles.messageButton,
            { height: this.state.messageTextareaHeight },
          ]}
          text={messages.send}
        />
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
      message,
      popUri
    ) =>
      dispatch(
        initializeOutboundSmsFromMessaging(
          interactionId,
          phoneNumber,
          contactId,
          message,
          popUri
        )
      ),
    sendOutboundSms: (interactionId, message) =>
      dispatch(sendOutboundSms(interactionId, message)),
    copyChatTranscript: interaction =>
      dispatch(copyChatTranscript(interaction)),
    setMessageTemplateFilter: interactionId =>
      dispatch(setMessageTemplateFilter(interactionId)),
    setMessageTemplateIndex: (interactionId, messageTemplateIndex) =>
      dispatch(setMessageTemplateIndex(interactionId, messageTemplateIndex)),
    saveMessageState: (
      interactionId,
      message,
      messageTemplateFilter,
      messageTemplateIndex
    ) =>
      dispatch(
        saveMessageState(
          interactionId,
          message,
          messageTemplateFilter,
          messageTemplateIndex
        )
      ),
    sendSmoochMessage: (interactionId, message) =>
      dispatch(sendSmoochMessage(interactionId, message)),
    setCustomerRead: (interactionId, isRead) =>
      dispatch(setCustomerRead(interactionId, isRead)),
    addSmoochPendingMessage: (interactionId, message) =>
      dispatch(addSmoochPendingMessage(interactionId, message)),
    dispatch,
  };
}

MessagingTextArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  messageTemplates: PropTypes.array.isRequired,
  agent: PropTypes.object,
  initializeOutboundSmsFromMessaging: PropTypes.func.isRequired,
  sendOutboundSms: PropTypes.func.isRequired,
  saveMessageState: PropTypes.func.isRequired,
  setCustomerRead: PropTypes.func.isRequired,
  setMessageTemplateFilter: PropTypes.func.isRequired,
  setMessageTemplateIndex: PropTypes.func.isRequired,
  sendSmoochMessage: PropTypes.func.isRequired,
  addSmoochPendingMessage: PropTypes.func.isRequired,
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
