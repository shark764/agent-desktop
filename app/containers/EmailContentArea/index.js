/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * EmailContentArea
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import moment from 'moment';
import 'assets/css/mediumdraft.min.css';
import { Editor, createEditorState } from 'medium-draft';
import {
  EditorState,
  convertFromHTML,
  ContentState,
  CompositeDecorator,
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

import { isValidEmail } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import ButtonLayout from 'components/ButtonLayout';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';
import LoadingText from 'components/LoadingText';
import Select from 'components/Select';
import TextInput from 'components/TextInput';

import ContentArea from 'containers/ContentArea';

import {
  emailCreateReply,
  emailCancelReply,
  emailAddAttachment,
  emailRemoveAttachment,
  emailUpdateReply,
  emailSendReply,
  removeInteraction,
} from 'containers/AgentDesktop/actions';
import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'IMAGE'
    );
  }, callback);
}

const Image = (props) => {
  /* eslint-disable react/prop-types */
  const { height, src, width } = props.contentState
    .getEntity(props.entityKey)
    .getData();
  /* eslint-enable react/prop-types */

  return <img alt="" src={src} height={height} width={width} />;
};

const decorator = new CompositeDecorator([
  {
    strategy: findImageEntities,
    component: Image,
  },
]);

const styles = {
  detailsField: {
    color: '#979797',
    display: 'inline-block',
    width: '90px',
    verticalAlign: 'top',
  },
  detailsValue: {
    display: 'inline-block',
    width: 'calc(100% - 90px)',
    minHeight: '1.8em',
  },
  attachmentsContainer: {
    borderTop: '1px solid #D0D0D0',
    marginTop: '10px',
    paddingTop: '10px',
  },
  attachment: {
    display: 'inline-block',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: '2px',
    fontSize: '12px',
    height: '26px',
    padding: '3px 10px',
    margin: '4px 10px 0 0',
    verticalAlign: 'top',
    border: '1px solid transparent',
  },
  addAttachment: {
    cursor: 'pointer',
  },
  attachmentIcon: {
    verticalAlign: 'top',
    marginTop: '1px',
  },
  addAttachmentMessage: {
    marginLeft: '5px',
  },
  attachmentName: {
    verticalAlign: 'top',
    marginTop: '-1px',
    display: 'inline-block',
  },
  attachmentRemove: {
    fontSize: '18px',
    lineHeight: '16px',
    marginLeft: '7px',
    color: '#979797',
    cursor: 'pointer',
  },
  loadingCircle: {
    margin: '0 auto',
    display: 'block',
    height: 50,
    width: 50,
  },
  loadingAttachment: {
    display: 'inline-block',
    height: 14,
    width: 14,
  },
  loadingSendingEmail: {
    margin: '20px auto 10px',
    display: 'block',
    height: 80,
    width: 80,
  },
  centerText: {
    textAlign: 'center',
  },
  emailContent: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    padding: '19px 23px',
  },
  inputContainer: {
    marginBottom: '2px',
  },
  emailAddress: {
    display: 'inline-block',
    backgroundColor: '#FFFFFF',
    border: '1px solid #D0D0D0',
    borderRadius: '3px',
    padding: '0 6px',
    marginRight: '6px',
  },
  emailAddressRemove: {
    fontSize: '12px',
    marginLeft: '6px',
    color: '#979797',
    cursor: 'pointer',
  },
  select: {
    height: '20px',
    border: 'none',
    backgroundColor: 'inherit',
  },
  richTextEditorContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    paddingTop: '15px',
  },
};

export class EmailContentArea extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
    this.state = {
      subject: this.props.selectedInteraction.emailReply
        ? this.props.selectedInteraction.emailReply.subject
        : '',
      tos: this.props.selectedInteraction.emailReply
        ? this.props.selectedInteraction.emailReply.tos
        : [],
      toInput: '',
      ccs: this.props.selectedInteraction.emailReply
        ? this.props.selectedInteraction.emailReply.ccs
        : [],
      ccInput: '',
      bccs: this.props.selectedInteraction.emailReply
        ? this.props.selectedInteraction.emailReply.bccs
        : [],
      bccInput: '',
      selectedEmailTemplate: undefined,
      editorState: this.props.selectedInteraction.emailReply
        ? EditorState.createWithContent(
            stateFromHTML(this.props.selectedInteraction.emailReply.message),
            decorator
          )
        : createEditorState(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.selectedInteraction.interactionId !==
      nextProps.selectedInteraction.interactionId
    ) {
      if (this.props.selectedInteraction.emailReply) {
        this.emailUpdateReply();
      }
      if (nextProps.selectedInteraction.emailReply) {
        this.setState({
          tos: nextProps.selectedInteraction.emailReply.tos,
          ccs: nextProps.selectedInteraction.emailReply.ccs,
          bccs: nextProps.selectedInteraction.emailReply.bccs,
          subject: nextProps.selectedInteraction.emailReply.subject,
          editorState: EditorState.createWithContent(
            stateFromHTML(nextProps.selectedInteraction.emailReply.message),
            decorator
          ),
        });
      } else {
        this.setState({
          tos: [],
          ccs: [],
          bccs: [],
          subject: '',
          editorState: createEditorState(),
        });
      }
    } else if (
      this.props.selectedInteraction.emailReply === undefined &&
      nextProps.selectedInteraction.emailReply !== undefined
    ) {
      this.setState({
        tos: nextProps.selectedInteraction.emailReply.tos,
        ccs: nextProps.selectedInteraction.emailReply.ccs,
        bccs: nextProps.selectedInteraction.emailReply.bccs,
        subject: nextProps.selectedInteraction.emailReply.subject,
      });
    }
  }

  componentWillUnmount() {
    if (this.props.selectedInteraction.emailReply) {
      this.emailUpdateReply();
    }
  }

  emailUpdateReply = () => {
    this.props.emailUpdateReply(this.props.selectedInteraction.interactionId, {
      tos: this.state.tos,
      ccs: this.state.ccs,
      bccs: this.state.bccs,
      subject: this.state.subject,
      message: stateToHTML(this.state.editorState.getCurrentContent()),
    });
  };

  onEmailCreateReply = () => {
    CxEngage.interactions.email.agentReplyStarted({
      interactionId: this.props.selectedInteraction.interactionId,
    });
    this.setState({
      editorState: createEditorState(),
    });
    this.props.emailCreateReply(this.props.selectedInteraction.interactionId);
  };

  onEmailNoReply = () => {
    CxEngage.interactions.email.agentNoReply({
      interactionId: this.props.selectedInteraction.interactionId,
    });
    this.props.endInteraction();
  };

  onEmailCancelReply = () => {
    CxEngage.interactions.email.agentCancelledReply({
      interactionId: this.props.selectedInteraction.interactionId,
    });
    this.props.emailCancelReply(this.props.selectedInteraction.interactionId);
  };

  onCommaAddTo = (e) => {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.toInput)) {
        this.setState({
          tos: this.state.tos.concat({
            name: this.state.toInput,
            address: this.state.toInput,
          }),
          toInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  };

  onCommaAddCc = (e) => {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.ccInput)) {
        this.setState({
          ccs: this.state.ccs.concat({
            name: this.state.ccInput,
            address: this.state.ccInput,
          }),
          ccInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  };

  onCommaAddBcc = (e) => {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.bccInput)) {
        this.setState({
          bccs: this.state.bccs.concat({
            name: this.state.bccInput,
            address: this.state.bccInput,
          }),
          bccInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  };

  onBlurAddTo = () => {
    if (isValidEmail(this.state.toInput)) {
      this.setState({
        tos: this.state.tos.concat({
          name: this.state.toInput,
          address: this.state.toInput,
        }),
        toInput: '',
      });
    }
  };

  onBlurAddCc = () => {
    if (isValidEmail(this.state.ccInput)) {
      this.setState({
        ccs: this.state.ccs.concat({
          name: this.state.ccInput,
          address: this.state.ccInput,
        }),
        ccInput: '',
      });
    }
  };

  onBlurAddBcc = () => {
    if (isValidEmail(this.state.bccInput)) {
      this.setState({
        bccs: this.state.bccs.concat({
          name: this.state.bccInput,
          address: this.state.bccInput,
        }),
        bccInput: '',
      });
    }
  };

  removeTo = (toRemove) => {
    this.setState({
      tos: this.state.tos.filter((to) => to !== toRemove),
    });
  };

  removeCc = (ccRemove) => {
    this.setState({
      ccs: this.state.ccs.filter((cc) => cc !== ccRemove),
    });
  };

  removeBcc = (bccRemove) => {
    this.setState({
      bccs: this.state.bccs.filter((bcc) => bcc !== bccRemove),
    });
  };

  addFilesToEmail = (fileList) => {
    for (let i = 0; i < fileList.length; i += 1) {
      this.props.emailAddAttachment(
        this.props.selectedInteraction.interactionId,
        {}
      );
      CxEngage.interactions.email.addAttachment({
        interactionId: this.props.selectedInteraction.interactionId,
        file: fileList[i],
      });
    }
  };

  removeAttachment = (attachmentId) => {
    this.props.emailRemoveAttachment(
      this.props.selectedInteraction.interactionId,
      attachmentId
    );
    CxEngage.interactions.email.removeAttachment({
      interactionId: this.props.selectedInteraction.interactionId,
      attachmentId,
    });
  };

  onTemplateChange = (value) => {
    let newEditorState;
    if (value !== null && value !== undefined) {
      newEditorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(value).contentBlocks,
          convertFromHTML(value).entityMap
        ),
        decorator
      );
    } else {
      newEditorState = createEditorState();
    }
    this.setState({
      selectedEmailTemplate: value,
      editorState: newEditorState,
    });
  };

  sendEmail = () => {
    this.props.emailSendReply(this.props.selectedInteraction.interactionId);

    const emailReply = {
      interactionId: this.props.selectedInteraction.interactionId,
      to: this.state.tos,
      cc: this.state.ccs,
      bcc: this.state.bccs,
      subject: this.state.subject,
    };

    if (this.props.selectedInteraction.direction === 'outbound') {
      emailReply.htmlBody = stateToHTML(
        this.state.editorState.getCurrentContent()
      );
      emailReply.plainTextBody = this.state.editorState
        .getCurrentContent()
        .getPlainText();
    } else {
      emailReply.htmlBody =
        stateToHTML(this.state.editorState.getCurrentContent()) +
        this.wrapEmailHistory(this.emailWithImages());
      emailReply.plainTextBody =
        this.state.editorState.getCurrentContent().getPlainText() +
        this.props.selectedInteraction.emailPlainBody;
    }
    console.log('CxEngage.interactions.email.sendReply()', emailReply);
    CxEngage.interactions.email.sendReply(emailReply);
  };

  emailWithImages = () => {
    const emailDetails = this.props.selectedInteraction.emailDetails;
    let newEmailBody = this.props.selectedInteraction.emailHtmlBody;
    let srcStartIndex;
    let bodyAfter;
    let srcEndIndex;
    let inlineContent;
    let imageId;

    if (emailDetails.attachments && emailDetails.attachments.length !== 0) {
      emailDetails.attachments.forEach((attachment) => {
        inlineContent = false;
        imageId = '';

        attachment.headers.forEach((header) => {
          if (
            header.contentDisposition &&
            header.contentDisposition.slice(0, 6) === 'inline'
          ) {
            inlineContent = true;
          }
          if (header.contentId) {
            imageId = header.contentId.slice(1, -1);
          }
        });

        srcStartIndex = newEmailBody.indexOf(imageId) - 4;
        if (inlineContent && srcStartIndex > -1) {
          bodyAfter = newEmailBody.slice(srcStartIndex);
          srcEndIndex = bodyAfter.indexOf('"') + srcStartIndex;
          newEmailBody = [
            newEmailBody.slice(0, srcStartIndex),
            attachment.url,
            newEmailBody.slice(srcEndIndex),
          ].join('');
        }
      });
    }

    return newEmailBody;
  };

  wrapEmailHistory = (email) => {
    const timestampFormatted = moment(
      this.props.selectedInteraction.emailDetails.dateSent
    ).format('LL');
    return `
      <p>On ${timestampFormatted} ${this.props.selectedInteraction.emailDetails
      .from[0].name} wrote:</p>
      <div style='border-left: 2px solid #979797; padding-left: 20px'>
        ${email}
      </div>
    `;
  };

  render() {
    let from;
    if (this.props.selectedInteraction.emailDetails === undefined) {
      from = this.props.selectedInteraction.customer;
    } else {
      const emailFrom = this.props.selectedInteraction.emailDetails.from[0];
      if (emailFrom.name !== emailFrom.address) {
        from = `${emailFrom.name} [${emailFrom.address}]`;
      } else {
        from = emailFrom.address;
      }
    }

    let details;
    let content;
    let buttonConfig = [];

    if (
      this.props.selectedInteraction.sendingReply === true &&
      this.props.selectedInteraction.status !== 'work-ended-pending-script'
    ) {
      if (this.props.selectedInteraction.status === 'wrapup') {
        buttonConfig = [
          {
            id: 'endWrapup',
            type: 'primaryRed',
            text: messages.endWrapup,
            onClick: this.props.endInteraction,
            disabled: this.props.awaitingDisposition,
            style: { marginRight: '8px' },
          },
        ];
      } else {
        buttonConfig = [
          {
            id: 'cancelEmail',
            type: 'secondary',
            style: { marginRight: '8px' },
            text: messages.cancel,
            onClick: this.onEmailCancelReply,
          },
          {
            id: 'sendEmail',
            type: 'primaryRed',
            text: messages.send,
            onClick: () => this.sendEmail(),
            disabled: true,
            isMainBtn: true,
          },
        ];
      }

      details = <div />;
      if (this.props.selectedInteraction.status !== 'wrapup') {
        content = (
          <div key="wrapupSpinner">
            <IconSVG
              style={styles.loadingSendingEmail}
              id="sendingReplyIcon"
              name="loading"
            />
            <div style={styles.centerText}>
              <VelocityTransitionGroup
                runOnMount
                enter={{ animation: 'transition.slideUpIn', duration: '1000' }}
              >
                <FormattedMessage
                  key="replySpinner"
                  {...messages.sendingEmail}
                />
              </VelocityTransitionGroup>
            </div>
          </div>
        );
      } else if (this.props.awaitingDisposition) {
        content = (
          <div key="wrapupSpinner">
            <IconSVG
              style={styles.loadingSendingEmail}
              id="sendingReplyIcon"
              name="loading"
            />
            <div style={styles.centerText}>
              <VelocityTransitionGroup
                runOnMount
                enter={{ animation: 'transition.slideUpIn', duration: '1000' }}
              >
                <FormattedMessage
                  key="dispoSpinner"
                  {...messages.awaitingDisposition}
                />
              </VelocityTransitionGroup>
            </div>
          </div>
        );
      } else {
        content = <div />;
      }
    } else if (this.props.selectedInteraction.emailReply === undefined) {
      if (
        this.props.selectedInteraction.emailDetails === undefined ||
        (this.props.selectedInteraction.emailHtmlBody === undefined &&
          this.props.selectedInteraction.emailPlainBody === undefined)
      ) {
        buttonConfig = [
          {
            id: 'replyEmailDisabled',
            key: 'replyEmailDisabled',
            type: 'primaryBlue',
            text: messages.reply,
            disabled: true,
          },
        ];
      } else if (this.props.selectedInteraction.status === 'wrapup') {
        buttonConfig = [
          {
            id: 'endWrapup',
            type: 'primaryRed',
            text: messages.endWrapup,
            onClick: this.props.endInteraction,
            disabled: this.props.awaitingDisposition,
            style: { marginRight: '8px' },
          },
        ];
      } else {
        buttonConfig = [
          {
            id: 'endEmail',
            type: 'primaryRed',
            text: messages.noReply,
            onClick: this.onEmailNoReply,
            style: { marginRight: '8px' },
          },
          {
            id: 'replyEmail',
            type: 'primaryBlue',
            text: messages.reply,
            onClick: this.onEmailCreateReply,
            isMainBtn: true,
          },
        ];
      }
      if (this.props.selectedInteraction.emailDetails === undefined) {
        details = (
          <IconSVG
            style={styles.loadingCircle}
            id="loadingEmailDetails"
            name="loading"
          />
        );
      } else {
        const tos = this.props.selectedInteraction.emailDetails.to.map((to) => {
          if (to.name && to.name !== to.address) {
            return `${to.name} [${to.address}]`;
          } else {
            return to.address;
          }
        });
        const ccs = this.props.selectedInteraction.emailDetails.cc.map((cc) => {
          if (cc.name && cc.name !== cc.address) {
            return `${cc.name} [${cc.address}]`;
          } else {
            return cc.address;
          }
        });
        const bccs = this.props.selectedInteraction.emailDetails.bcc.map(
          (bcc) => {
            if (bcc.name && bcc.name !== bcc.address) {
              return `${bcc.name} [${bcc.address}]`;
            } else {
              return bcc.address;
            }
          }
        );
        details = (
          <div>
            <div>
              <div style={styles.detailsField}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={styles.detailsValue}>
                {tos.join(', ')}
              </div>
            </div>
            {ccs.length > 0
              ? <div>
                <div style={styles.detailsField}>
                  <FormattedMessage {...messages.cc} />
                </div>
                <div style={styles.detailsValue}>
                  {ccs.join(', ')}
                </div>
              </div>
              : undefined}
            {bccs.length > 0
              ? <div>
                <div style={styles.detailsField}>
                  <FormattedMessage {...messages.bcc} />
                </div>
                <div style={styles.detailsValue}>
                  {bccs.join(', ')}
                </div>
              </div>
              : undefined}
            <div>
              <div style={styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={styles.detailsValue}>
                {this.props.selectedInteraction.emailDetails.subject}
              </div>
            </div>
            {this.props.selectedInteraction.emailDetails.attachments !==
              undefined &&
            this.props.selectedInteraction.emailDetails.attachments.length > 0
              ? <div style={styles.attachmentsContainer}>
                {this.props.selectedInteraction.emailDetails.attachments.map(
                    (attachment, index) =>
                      (<a
                        key={attachment.artifactFileId}
                        id={`attachment-${index}`}
                        className="attachment"
                        href={attachment.url}
                        download
                      >
                        <div style={styles.attachment}>
                          {attachment.filename}
                          {attachment.url === undefined
                            ? <div
                              style={{
                                display: 'inline-block',
                                marginLeft: '6px',
                              }}
                            >
                              <IconSVG
                                style={styles.loadingAttachment}
                                id={`loadingAttachment-${index}`}
                                name="loading"
                              />
                            </div>
                            : ''}
                        </div>
                      </a>)
                  )}
              </div>
              : undefined}
          </div>
        );
      }

      if (
        this.props.selectedInteraction.emailHtmlBody === undefined &&
        this.props.selectedInteraction.emailPlainBody === undefined
      ) {
        content = (
          <div>
            <LoadingText />
            <br />
            <LoadingText />
          </div>
        );
      } else if (this.props.selectedInteraction.emailHtmlBody !== undefined) {
        content = (
          <div>
            {
              // eslint-disable-next-line react/no-danger
            }
            <div
              id="emailContainer"
              style={styles.emailContent}
              dangerouslySetInnerHTML={{ __html: this.emailWithImages() }}
            />
          </div>
        );
      } else {
        content = (
          <div id="emailContainer" style={styles.emailContent}>
            {this.props.selectedInteraction.emailPlainBody}
          </div>
        );
      }
    } else {
      if (this.props.selectedInteraction.direction === 'outbound') {
        buttonConfig = [
          {
            id: 'cancelOutboundEmail',
            type: 'primaryRed',
            text: messages.cancel,
            onClick: this.props.endInteraction,
            disabled: this.props.selectedInteraction.status !== 'work-accepted',
            style: { marginRight: '8px' },
          },
          {
            id: 'sendOutboundEmail',
            type: 'primaryBlue',
            text: messages.send,
            onClick: () => this.sendEmail(),
            disabled: this.props.selectedInteraction.status !== 'work-accepted',
            style: { marginRight: '8px' },
            isMainBtn: true,
          },
        ];
      } else if (this.props.selectedInteraction.status === 'wrapup') {
        buttonConfig = [
          {
            id: 'endWrapup',
            type: 'primaryRed',
            text: messages.endWrapup,
            onClick: this.props.endInteraction,
            disabled: this.props.awaitingDisposition,
            style: { marginRight: '8px' },
          },
        ];
      } else {
        buttonConfig = [
          {
            id: 'cancelEmail',
            type: 'primaryRed',
            text: messages.cancel,
            onClick: this.onEmailCancelReply,
            style: { marginRight: '8px' },
          },
          {
            id: 'sendEmail',
            type: 'primaryBlue',
            text: messages.send,
            onClick: () => this.sendEmail(),
            isMainBtn: true,
          },
        ];
      }

      const emailTemplates = this.props.emailTemplates.map((emailTemplate) => ({
        value: emailTemplate.template,
        label: emailTemplate.name,
      }));
      details = (
        <div>
          <div style={styles.inputContainer}>
            <div style={styles.detailsField}>
              <FormattedMessage {...messages.to} />
            </div>
            <div style={styles.detailsValue}>
              {this.state.tos.map((to, index) =>
                (<div
                  key={`${index}-${to.address}`}
                  id={`${index}-${to.address}`}
                  style={styles.emailAddress}
                >
                  {to.name && to.name !== to.address
                    ? `${to.name} [${to.address}]`
                    : to.address}
                  {(this.props.selectedInteraction.direction === 'outbound' ||
                    index !== 0) &&
                    this.props.selectedInteraction.status !==
                      'work-ended-pending-script' &&
                      <span
                        onClick={() => this.removeTo(to)}
                        style={styles.emailAddressRemove}
                      >
                      &#10060;
                    </span>}
                </div>)
              )}
              {this.props.selectedInteraction.status !==
                'work-ended-pending-script' &&
                <TextInput
                  id="emailToInput"
                  styleType="inlineInherit"
                  noBorder
                  placeholder="…"
                  value={this.state.toInput}
                  cb={(toInput) => this.setState({ toInput })}
                  onKeyDown={(e) => this.onCommaAddTo(e)}
                  onBlur={() => this.onBlurAddTo()}
                />}
            </div>
          </div>
          <div style={styles.inputContainer}>
            <div style={styles.detailsField}>
              <FormattedMessage {...messages.cc} />
            </div>
            <div style={styles.detailsValue}>
              {this.state.ccs.map((cc, index) =>
                (<div
                  key={`${index}-${cc.address}`}
                  id={`${index}-${cc.address}`}
                  style={styles.emailAddress}
                >
                  {cc.name && cc.name !== cc.address
                    ? `${cc.name} [${cc.address}]`
                    : cc.address}
                  {this.props.selectedInteraction.status !==
                    'work-ended-pending-script' &&
                    <span
                      className="removeAddress"
                      onClick={() => this.removeCc(cc)}
                      style={styles.emailAddressRemove}
                    >
                      &#10060;
                    </span>}
                </div>)
              )}
              {this.props.selectedInteraction.status !==
                'work-ended-pending-script' &&
                <TextInput
                  id="emailCcInput"
                  styleType="inlineInherit"
                  noBorder
                  placeholder="…"
                  value={this.state.ccInput}
                  cb={(ccInput) => this.setState({ ccInput })}
                  onKeyDown={(e) => this.onCommaAddCc(e)}
                  onBlur={() => this.onBlurAddCc()}
                />}
            </div>
          </div>
          <div style={styles.inputContainer}>
            <div style={styles.detailsField}>
              <FormattedMessage {...messages.bcc} />
            </div>
            <div style={styles.detailsValue}>
              {this.state.bccs.map((bcc, index) =>
                (<div
                  key={`${index}-${bcc.address}`}
                  id={`${index}-${bcc.address}`}
                  style={styles.emailAddress}
                >
                  {bcc.name && bcc.name !== bcc.address
                    ? `${bcc.name} [${bcc.address}]`
                    : bcc.address}
                  {this.props.selectedInteraction.status !==
                    'work-ended-pending-script' &&
                    <span
                      className="removeAddress"
                      onClick={() => this.removeBcc(bcc)}
                      style={styles.emailAddressRemove}
                    >
                      &#10060;
                    </span>}
                </div>)
              )}
              {this.props.selectedInteraction.status !==
                'work-ended-pending-script' &&
                <TextInput
                  id="emailBccInput"
                  styleType="inlineInherit"
                  noBorder
                  placeholder="…"
                  value={this.state.bccInput}
                  cb={(bccInput) => this.setState({ bccInput })}
                  onKeyDown={(e) => this.onCommaAddBcc(e)}
                  onBlur={() => this.onBlurAddBcc()}
                />}
            </div>
          </div>
          <div style={styles.inputContainer}>
            <div style={styles.detailsField}>
              <FormattedMessage {...messages.subject} />
            </div>
            <div style={styles.detailsValue}>
              {this.props.selectedInteraction.status !==
              'work-ended-pending-script'
                ? <TextInput
                  id="subjectInput"
                  styleType="inlineInherit"
                  placeholder="…"
                  value={this.state.subject}
                  cb={(subject) => this.setState({ subject })}
                  style={{ width: '100%' }}
                  readOnly={
                      this.props.selectedInteraction.status ===
                      'work-ended-pending-script'
                    }
                />
                : this.state.subject}
            </div>
          </div>
          {this.props.emailTemplates.length > 0 &&
            <div>
              <div style={styles.detailsField}>
                <FormattedMessage {...messages.template} />
              </div>
              <div style={styles.detailsValue}>
                {this.props.selectedInteraction.status !==
                'work-ended-pending-script'
                  ? <Select
                    id="emailTemplates"
                    style={styles.select}
                    type="inline-small"
                    value={this.state.selectedEmailTemplate}
                    options={emailTemplates}
                    onChange={(e) => this.onTemplateChange(e ? e.value : e)}
                  />
                  : this.state.selectedEmailTemplate}
              </div>
            </div>}
          <div style={styles.attachmentsContainer}>
            {this.props.selectedInteraction.emailReply.attachments.map(
              (attachment, index) =>
                (<div
                  key={`${index}-${attachment.name}`}
                  id={`${index}-${attachment.name}`}
                  style={styles.attachment}
                >
                  {attachment.attachmentId === undefined
                    ? <div>Uploading...</div>
                    : <div>
                      <span style={styles.attachmentName}>
                        {attachment.name}
                      </span>
                      {this.props.selectedInteraction.status !==
                          'work-ended-pending-script' &&
                          <span
                            onClick={() =>
                              this.removeAttachment(attachment.attachmentId)}
                            style={styles.attachmentRemove}
                          >
                            &#10060;
                          </span>}
                    </div>}
                </div>)
            )}
            {this.props.selectedInteraction.status !==
              'work-ended-pending-script' &&
              <div>
                <input
                  id="attachmentFilePicker"
                  type="file"
                  multiple
                  value=""
                  onChange={(e) => this.addFilesToEmail(e.target.files)}
                  style={{ display: 'none' }}
                />
                <label
                  id="attachmentFilePickerLabel"
                  htmlFor="attachmentFilePicker"
                >
                  <div style={[styles.attachment, styles.addAttachment]}>
                    <Icon name="attachment" style={styles.attachmentIcon} />
                    {this.props.selectedInteraction.emailReply.attachments
                      .length === 0
                      ? <span style={styles.addAttachmentMessage}>
                        <FormattedMessage {...messages.addAttachment} />
                      </span>
                      : undefined}
                  </div>
                </label>
              </div>}
          </div>
        </div>
      );

      let timestampFormatted;
      let emailReplyingTo;

      if (this.props.selectedInteraction.direction !== 'outbound') {
        timestampFormatted = moment(
          this.props.selectedInteraction.emailDetails.dateSent
        ).format('LL');
        emailReplyingTo = (
          <div
            className="md-RichEditor-editor"
            style={{ padding: '0 30px 20px' }}
          >
            <p>
              On {timestampFormatted}{' '}
              {this.props.selectedInteraction.emailDetails.from[0].name} wrote:
            </p>
            {this.props.selectedInteraction.emailHtmlBody !== undefined
              ? <blockquote
                className="md-RichEditor-blockquote"
                dangerouslySetInnerHTML={{ __html: this.emailWithImages() }}
              />
              : <blockquote className="md-RichEditor-blockquote">
                {this.props.selectedInteraction.emailPlainBody}
              </blockquote>}
          </div>
        );
      }

      const { editorState } = this.state;
      content = (
        <div style={styles.richTextEditorContainer}>
          <Editor
            editorState={editorState}
            editorEnabled={
              this.props.selectedInteraction.status !==
              'work-ended-pending-script'
            }
            onChange={this.onChange}
            placeholder={this.props.intl.formatMessage(messages.addMessage)}
            sideButtons={[]}
            inlineButtons={[
              {
                label: 'B',
                style: 'BOLD',
                icon: 'bold',
                description: 'Bold',
              },
              {
                label: 'I',
                style: 'ITALIC',
                icon: 'italic',
                description: 'Italic',
              },
              {
                label: 'U',
                style: 'UNDERLINE',
                icon: 'underline',
                description: 'Underline',
              },
            ]}
            blockButtons={[
              {
                label: 'H3',
                style: 'header-three',
                icon: 'header',
                description: 'Heading 3',
              },
              {
                label: 'Q',
                style: 'blockquote',
                icon: 'quote-right',
                description: 'Blockquote',
              },
              {
                label: 'UL',
                style: 'unordered-list-item',
                icon: 'list-ul',
                description: 'Unordered List',
              },
              {
                label: 'OL',
                style: 'ordered-list-item',
                icon: 'list-ol',
                description: 'Ordered List',
              },
            ]}
          />
          {emailReplyingTo}
        </div>
      );
    }

    const buttons = <ButtonLayout buttonConfig={buttonConfig} />;

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

EmailContentArea.propTypes = {
  intl: intlShape.isRequired,
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  emailAddAttachment: PropTypes.func.isRequired,
  emailRemoveAttachment: PropTypes.func.isRequired,
  emailUpdateReply: PropTypes.func.isRequired,
  emailSendReply: PropTypes.func.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
  emailTemplates: PropTypes.array.isRequired,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    emailCreateReply: (interactionId) =>
      dispatch(emailCreateReply(interactionId)),
    emailCancelReply: (interactionId) =>
      dispatch(emailCancelReply(interactionId)),
    emailAddAttachment: (interactionId, attachment) =>
      dispatch(emailAddAttachment(interactionId, attachment)),
    emailRemoveAttachment: (interactionId, attachmentId) =>
      dispatch(emailRemoveAttachment(interactionId, attachmentId)),
    emailUpdateReply: (interactionId, reply) =>
      dispatch(emailUpdateReply(interactionId, reply)),
    emailSendReply: (interactionId) => dispatch(emailSendReply(interactionId)),
    removeInteraction: (interactionId) =>
      dispatch(removeInteraction(interactionId)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Radium(EmailContentArea))
  )
);
