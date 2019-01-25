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

import ErrorBoundary from 'components/ErrorBoundary';

import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';
import LoadingText from 'components/LoadingText';
import Select from 'components/Select';
import TextInput from 'components/TextInput';

import ContentArea from 'containers/ContentArea';
import CustomFields from 'containers/CustomFields';

import {
  emailCreateReply,
  emailCancelReply,
  emailAddAttachment,
  emailRemoveAttachment,
  emailUpdateReply,
  emailSendReply,
  setEmailAttachmentUrl,
  setEmailAttachmentFetchingUrl,
  updateEmailInput,
  updateSelectedEmailTemplate,
} from 'containers/AgentDesktop/actions';

import {
  selectAwaitingDisposition,
  selectIsEndWrapupDisabled,
} from 'containers/AgentDesktop/selectors';
import { selectWrapupBtnTooltipText } from 'containers/ContentAreaTop/selectors';

import EmailInput from './EmailInput';

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
    minHeight: '1.5em',
    wordBreak: 'break-all',
  },
  detailsContainer: {
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '169px',
  },
  attachmentRemove: {
    whiteSpace: 'nowrap',
  },
  loadingCircle: {
    margin: '0 auto',
    display: 'block',
    height: 50,
    width: 50,
  },
  loadingAttachment: {
    display: 'inline-block',
    marginLeft: '6px',
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
  emailContentPlainBody: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    padding: '19px 23px',
    whiteSpace: 'pre',
  },
  emailContentFrame: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    border: '0',
  },
  emailContentFrameReply: {
    position: 'absolute',
    width: 'calc(100% - 30px)',
    overflowY: 'auto',
    border: '0',
  },
  inputContainer: {
    marginBottom: '2px',
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
    this.emailFrames = React.createRef();
    this.state = {
      editorState: this.props.selectedInteraction.emailReply
        ? EditorState.createWithContent(
          stateFromHTML(this.props.selectedInteraction.emailReply.message),
          decorator
        )
        : createEditorState(),
    };
  }

  componentWillUnmount() {
    if (this.props.selectedInteraction.emailReply) {
      this.emailUpdateReply(
        this.props.selectedInteraction.interactionId,
        this.state.editorState
      );
    }
  }

  componentDidMount() {
    this.updateIframes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.selectedInteraction.interactionId !==
      prevProps.selectedInteraction.interactionId
    ) {
      if (prevProps.selectedInteraction.emailReply) {
        this.emailUpdateReply(
          prevProps.selectedInteraction.interactionId,
          prevState.editorState
        );
      }
      if (this.props.selectedInteraction.emailReply) {
        // eslint-disable-next-line
        this.setState({
          editorState: EditorState.createWithContent(
            stateFromHTML(this.props.selectedInteraction.emailReply.message),
            decorator
          ),
        });
      } else {
        // eslint-disable-next-line
        this.setState({
          editorState: createEditorState(),
        });
      }
    }

    // We do this so we can make sure the iframe is updated when necessary
    if (
      this.props.selectedInteraction.interactionId !==
        prevProps.selectedInteraction.interactionId ||
      this.props.selectedInteraction.emailHtmlBody !==
        prevProps.selectedInteraction.emailHtmlBody ||
      this.props.selectedInteraction.emailReply !==
        prevProps.selectedInteraction.emailReply
    ) {
      this.updateIframes();
    }
  }

  updateIframes = () => {
    if (this.emailFrames.current) {
      const emailIframe =
        this.emailFrames.current.contentWindow ||
        (this.emailFrames.current.contentDocument.document ||
          this.emailFrames.current.contentDocument);
      this.emailFrames.current.contentDocument.head.innerHTML =
        '<base target="_blank" />';

      // https://stackoverflow.com/a/18957141
      emailIframe.document.open();
      emailIframe.document.write(this.emailWithImages());
      emailIframe.document.close();

      if (this.props.selectedInteraction.emailReply !== undefined) {
        //  Added a style to the body of the iframe to avoid a double scroll bar when the user reply email.
        this.emailFrames.current.contentDocument.head.innerHTML +=
          '<style> body{ overflow:hidden } </style>';
        this.emailFrames.current.style.height = '0px';
        const heightpx = this.emailFrames.current.contentWindow.document.body
          .scrollHeight;
        this.emailFrames.current.style.height = `${heightpx}px`;
      }
    }
  };

  emailUpdateReply = (interactionId, editorState) => {
    this.props.emailUpdateReply(
      interactionId,
      stateToHTML(editorState.getCurrentContent())
    );
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

  updateToInput = (value) => {
    this.props.updateEmailInput(
      this.props.selectedInteraction.interactionId,
      'toInput',
      value
    );
  };

  updateCcInput = (value) => {
    this.props.updateEmailInput(
      this.props.selectedInteraction.interactionId,
      'ccInput',
      value
    );
  };

  updateBccInput = (value) => {
    this.props.updateEmailInput(
      this.props.selectedInteraction.interactionId,
      'bccInput',
      value
    );
  };

  updateSubjectInput = (value) => {
    this.props.updateEmailInput(
      this.props.selectedInteraction.interactionId,
      'subjectInput',
      value
    );
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
    this.props.updateSelectedEmailTemplate(
      this.props.selectedInteraction.interactionId,
      value
    );
    this.setState({
      editorState: newEditorState,
    });
  };

  sendEmail = () => {
    this.props.emailSendReply(this.props.selectedInteraction.interactionId);

    const emailReply = {
      interactionId: this.props.selectedInteraction.interactionId,
      to: this.props.selectedInteraction.emailReply.tos,
      cc: this.props.selectedInteraction.emailReply.ccs,
      bcc: this.props.selectedInteraction.emailReply.bccs,
      subject: this.props.selectedInteraction.emailReply.subjectInput,
    };

    const htmlBody = stateToHTML(this.state.editorState.getCurrentContent());
    const plainTextBody = this.state.editorState
      .getCurrentContent()
      .getPlainText();
    if (this.props.selectedInteraction.direction === 'agent-initiated') {
      emailReply.htmlBody = htmlBody;
      emailReply.plainTextBody = plainTextBody;
    } else {
      emailReply.htmlBody =
        htmlBody +
        this.wrapEmailHistoryHtml(
          this.props.selectedInteraction.emailHtmlBody !== undefined
            ? this.emailWithImages()
            : this.props.selectedInteraction.emailPlainBody
        );
      emailReply.plainTextBody = `${plainTextBody}
${this.wrapEmailHistoryPlainText()}`;
    }
    console.log('CxEngage.interactions.email.sendReply()', emailReply);
    CxEngage.interactions.email.sendReply(emailReply);
  };

  emailWithImages = () => {
    const { emailDetails } = this.props.selectedInteraction;
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

  onDateNameWrote = () => {
    const timestampFormatted = moment(
      this.props.selectedInteraction.emailDetails.dateSent
    ).format('LL');
    return this.props.intl.formatMessage(messages.onDateNameWrote, {
      date: timestampFormatted,
      name: this.props.selectedInteraction.emailDetails.from[0].name,
    });
  };

  wrapEmailHistoryHtml = (email) =>
    `<p>${this.onDateNameWrote()}</p>
<div style='border-left: 2px solid #979797; padding-left: 20px; white-space: pre;'>
${email}
</div>`;

  wrapEmailHistoryPlainText = () =>
    `${this.onDateNameWrote()}
${this.props.selectedInteraction.emailPlainBody}`;

  updateAttachmentUrl = (selectedArtifactFileId) => {
    this.props.setEmailAttachmentFetchingUrl(
      this.props.selectedInteraction.interactionId,
      selectedArtifactFileId,
      true
    );

    const selectedAttachment = this.props.selectedInteraction.emailDetails.attachments.find(
      (attachment) => selectedArtifactFileId === attachment.artifactFileId
    );

    if (selectedAttachment) {
      CxEngage.interactions.email.getAttachmentUrl(
        {
          interactionId: this.props.selectedInteraction.interactionId,
          artifactId: this.props.selectedInteraction.emailDetails.artifactId,
          artifactFileId: selectedAttachment.artifactFileId,
        },
        (attachmentUrlError, attachmentUrlTopic, attachmentUrlResponse) => {
          const attachmentUrl = attachmentUrlResponse.url;
          this.props.setEmailAttachmentUrl(
            this.props.selectedInteraction.interactionId,
            selectedAttachment.artifactFileId,
            attachmentUrl
          );
          this.props.setEmailAttachmentFetchingUrl(
            this.props.selectedInteraction.interactionId,
            selectedAttachment.artifactFileId,
            false
          );
          window.open(attachmentUrl);
        }
      );
    } else {
      console.error('Cannot find selected attachment');
    }
  };

  render() {
    let from;
    if (this.props.selectedInteraction.emailDetails === undefined) {
      from = this.props.selectedInteraction.customer;
    } else {
      const emailFrom = this.props.selectedInteraction.emailDetails.from[0];
      if (this.props.selectedInteraction.contact !== undefined) {
        from = `${this.props.selectedInteraction.contact.attributes.name} [${
          emailFrom.address
        }]`;
      } else if (emailFrom.name !== emailFrom.address) {
        from =
          emailFrom.name === null
            ? emailFrom.address
            : `${emailFrom.name} [${emailFrom.address}]`;
      } else {
        from = emailFrom.address;
      }
    }

    let details;
    let content;
    let buttonConfig = [];

    if (
      this.props.selectedInteraction.sendingReply &&
      this.props.selectedInteraction.status !== 'work-ended-pending-script'
    ) {
      if (this.props.selectedInteraction.status === 'wrapup') {
        buttonConfig = [
          {
            id: 'endWrapup',
            type: 'primaryRed',
            text: messages.endWrapup,
            onClick: this.props.endInteraction,
            disabled: this.props.isEndWrapupDisabled,
            title: this.props.wrapupBtnTooltipText,
          },
        ];
      }

      details = <div />;
      if (this.props.selectedInteraction.status !== 'wrapup') {
        content = (
          <div key="wrapupSpinner" style={styles.loadingSendingEmail}>
            <IconSVG id="sendingReplyIcon" name="loading" />
            <div style={styles.centerText}>
              <FormattedMessage key="replySpinner" {...messages.sendingEmail} />
            </div>
          </div>
        );
      } else if (this.props.awaitingDisposition) {
        content = (
          <div key="wrapupSpinner" style={styles.loadingSendingEmail}>
            <IconSVG id="sendingReplyIcon" name="loading" />
            <div style={styles.centerText}>
              <FormattedMessage
                key="dispoSpinner"
                {...messages.awaitingDisposition}
              />
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
            disabled: this.props.isEndWrapupDisabled,
            title: this.props.wrapupBtnTooltipText,
          },
        ];
      } else {
        buttonConfig = [
          {
            id: 'endEmail',
            type: 'primaryRed',
            text: messages.noReply,
            onClick: this.onEmailNoReply,
          },
          {
            id: 'replyEmail',
            type: 'primaryBlue',
            text: messages.reply,
            onClick: this.onEmailCreateReply,
          },
        ];
      }
      if (this.props.selectedInteraction.emailDetails === undefined) {
        details = (
          <div style={styles.loadingCircle}>
            <IconSVG id="loadingEmailDetails" name="loading" />
          </div>
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
            {ccs.length > 0 ? (
              <div>
                <div style={styles.detailsField}>
                  <FormattedMessage {...messages.cc} />
                </div>
                <div style={styles.detailsValue}>
                  {ccs.join(', ')}
                </div>
              </div>
            ) : (
              undefined
            )}
            {bccs.length > 0 ? (
              <div>
                <div style={styles.detailsField}>
                  <FormattedMessage {...messages.bcc} />
                </div>
                <div style={styles.detailsValue}>
                  {bccs.join(', ')}
                </div>
              </div>
            ) : (
              undefined
            )}
            <div>
              <div style={styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={styles.detailsValue}>
                {this.props.selectedInteraction.emailDetails.subject}
              </div>
            </div>
            {this.props.selectedInteraction.customFields && (
              <div style={styles.detailsContainer}>
                <CustomFields />
              </div>
            )}
            {this.props.selectedInteraction.emailDetails.attachments !==
              undefined &&
            this.props.selectedInteraction.emailDetails.attachments.length >
              0 ? (
                <div style={styles.detailsContainer}>
                  {this.props.selectedInteraction.emailDetails.attachments.map(
                    (attachment, index) => (
                      <span
                        key={attachment.artifactFileId}
                        id={`attachment-${index}`}
                        className="attachment"
                        onClick={() =>
                          this.updateAttachmentUrl(attachment.artifactFileId)
                        }
                      >
                        <div
                          title={attachment.filename}
                          style={[styles.attachment, styles.addAttachment]}
                        >
                          {attachment.filename}
                          {attachment.fetchingAttachmentUrl && (
                            <div style={styles.loadingAttachment}>
                              <IconSVG
                                id={`loadingAttachment-${index}`}
                                name="loading"
                              />
                            </div>
                          )}
                        </div>
                      </span>
                    )
                  )}
                </div>
              ) : (
                undefined
              )}
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
            <iframe
              title="emailFrame"
              ref={this.emailFrames}
              style={styles.emailContentFrame}
            />
          </div>
        );
      } else {
        content = (
          <div id="emailContainer" style={styles.emailContentPlainBody}>
            {this.props.selectedInteraction.emailPlainBody}
          </div>
        );
      }
    } else {
      if (this.props.selectedInteraction.direction === 'agent-initiated') {
        buttonConfig = [
          {
            id: 'cancelOutboundEmail',
            type: 'primaryRed',
            text: messages.cancel,
            onClick: this.props.endInteraction,
            disabled: this.props.selectedInteraction.status !== 'work-accepted',
          },
          {
            id: 'sendOutboundEmail',
            type: 'primaryBlue',
            text: messages.send,
            onClick: () => this.sendEmail(),
            disabled:
              this.props.selectedInteraction.status !== 'work-accepted' ||
              this.props.selectedInteraction.canSendReply !== true,
          },
        ];
      } else if (this.props.selectedInteraction.status === 'wrapup') {
        buttonConfig = [
          {
            id: 'endWrapup',
            type: 'primaryRed',
            text: messages.endWrapup,
            onClick: this.props.endInteraction,
            disabled: this.props.isEndWrapupDisabled,
            title: this.props.wrapupBtnTooltipText,
          },
        ];
      } else {
        buttonConfig = [
          {
            id: 'cancelEmail',
            type: 'primaryRed',
            text: messages.cancel,
            onClick: this.onEmailCancelReply,
          },
          {
            id: 'sendEmail',
            type: 'primaryBlue',
            text: messages.send,
            onClick: () => this.sendEmail(),
            disabled: this.props.selectedInteraction.canSendReply !== true,
          },
        ];
      }

      const emailTemplates = this.props.emailTemplates.map((emailTemplate) => ({
        value: emailTemplate.template,
        label: emailTemplate.name,
      }));
      details = (
        <div>
          <EmailInput
            style={styles.inputContainer}
            emails={this.props.selectedInteraction.emailReply.tos}
            message={messages.to}
            inputType="to"
            value={this.props.selectedInteraction.emailReply.toInput}
            cb={this.updateToInput}
          />
          <EmailInput
            style={styles.inputContainer}
            emails={this.props.selectedInteraction.emailReply.ccs}
            message={messages.cc}
            inputType="cc"
            value={this.props.selectedInteraction.emailReply.ccInput}
            cb={this.updateCcInput}
          />
          <EmailInput
            style={styles.inputContainer}
            emails={this.props.selectedInteraction.emailReply.bccs}
            message={messages.bcc}
            inputType="bcc"
            value={this.props.selectedInteraction.emailReply.bccInput}
            cb={this.updateBccInput}
          />
          <div style={styles.inputContainer}>
            <div style={styles.detailsField}>
              <FormattedMessage {...messages.subject} />
            </div>
            <div style={styles.detailsValue}>
              {this.props.selectedInteraction.status !==
              'work-ended-pending-script' ? (
                  <TextInput
                    id="subjectInput"
                    styleType="inlineInherit"
                    placeholder="…"
                    value={this.props.selectedInteraction.emailReply.subjectInput}
                    cb={(subject) => this.updateSubjectInput(subject)}
                    style={{ width: '100%' }}
                    readOnly={
                      this.props.selectedInteraction.status ===
                    'work-ended-pending-script'
                    }
                  />
                ) : (
                  this.props.selectedInteraction.emailReply.subjectInput
                )}
            </div>
          </div>
          {this.props.emailTemplates.length > 0 && (
            <div>
              <div style={styles.detailsField}>
                <FormattedMessage {...messages.template} />
              </div>
              <div style={styles.detailsValue}>
                {this.props.selectedInteraction.status !==
                'work-ended-pending-script' ? (
                    <Select
                      id="emailTemplates"
                      style={styles.select}
                      type="inline-small"
                      value={
                        this.props.selectedInteraction.emailReply
                          .selectedEmailTemplate
                      }
                      options={emailTemplates}
                      onChange={(e) => this.onTemplateChange(e ? e.value : e)}
                    />
                  ) : (
                    this.props.selectedInteraction.emailReply
                      .selectedEmailTemplate
                  )}
              </div>
            </div>
          )}
          <div style={styles.detailsContainer}>
            {this.props.selectedInteraction.emailReply.attachments.map(
              (attachment, index) => (
                <div
                  key={`${index}-${attachment.name}`} // eslint-disable-line
                  id={`${index}-${attachment.name}`}
                  style={styles.attachment}
                >
                  {attachment.attachmentId === undefined ? (
                    <FormattedMessage {...messages.uploading} />
                  ) : (
                    <div>
                      <div
                        title={attachment.name}
                        style={styles.attachmentName}
                      >
                        {attachment.name}
                      </div>
                      {this.props.selectedInteraction.status !==
                        'work-ended-pending-script' && (
                        <div
                          onClick={() =>
                            this.removeAttachment(attachment.attachmentId)
                          }
                          style={{
                            display: 'inline-block',
                            marginLeft: '5px',
                          }}
                        >
                          <IconSVG
                            id="removeAttachmentIcon"
                            name="close"
                            color="grey"
                            width="12px"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
            {this.props.selectedInteraction.status !==
              'work-ended-pending-script' && (
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
                      .length === 0 ? (
                        <span style={styles.addAttachmentMessage}>
                          <FormattedMessage {...messages.addAttachment} />
                        </span>
                      ) : (
                        undefined
                      )}
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      );

      let emailReplyingTo;

      if (this.props.selectedInteraction.direction !== 'agent-initiated') {
        const date = moment(
          this.props.selectedInteraction.emailDetails.dateSent
        ).format('LL');
        emailReplyingTo = (
          <div
            className="md-RichEditor-editor"
            style={{ padding: '0 30px 20px' }}
          >
            <div>
              <FormattedMessage
                {...messages.onDateNameWrote}
                values={{
                  date,
                  name: this.props.selectedInteraction.emailDetails.from[0]
                    .name,
                }}
              />
            </div>
            {this.props.selectedInteraction.emailHtmlBody !== undefined ? (
              <iframe
                title="emailFrame"
                ref={this.emailFrames}
                style={styles.emailContentFrameReply}
              />
            ) : (
              <blockquote
                style={{ whiteSpace: 'pre' }}
                className="md-RichEditor-blockquote"
              >
                {this.props.selectedInteraction.emailPlainBody}
              </blockquote>
            )}
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

    return (
      <ContentArea
        interaction={this.props.selectedInteraction}
        from={from}
        buttonConfig={buttonConfig}
        details={details}
        content={content}
        agent={this.props.agent}
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
  setEmailAttachmentUrl: PropTypes.func.isRequired,
  setEmailAttachmentFetchingUrl: PropTypes.func.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
  isEndWrapupDisabled: PropTypes.bool.isRequired,
  wrapupBtnTooltipText: PropTypes.object.isRequired,
  emailTemplates: PropTypes.array.isRequired,
  agent: PropTypes.object.isRequired,
  updateEmailInput: PropTypes.func.isRequired,
  updateSelectedEmailTemplate: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
  isEndWrapupDisabled: selectIsEndWrapupDisabled(state, props),
  wrapupBtnTooltipText: selectWrapupBtnTooltipText(state, props),
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
    emailUpdateReply: (interactionId, message) =>
      dispatch(emailUpdateReply(interactionId, message)),
    emailSendReply: (interactionId) => dispatch(emailSendReply(interactionId)),
    setEmailAttachmentUrl: (interactionId, artifactFileId, url) =>
      dispatch(setEmailAttachmentUrl(interactionId, artifactFileId, url)),
    setEmailAttachmentFetchingUrl: (
      interactionId,
      artifactFileId,
      fetchingAttachmentUrl
    ) =>
      dispatch(
        setEmailAttachmentFetchingUrl(
          interactionId,
          artifactFileId,
          fetchingAttachmentUrl
        )
      ),
    updateEmailInput: (interactionId, input, value) =>
      dispatch(updateEmailInput(interactionId, input, value)),
    updateSelectedEmailTemplate: (interactionId, selectedTemplate) =>
      dispatch(updateSelectedEmailTemplate(interactionId, selectedTemplate)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Radium(EmailContentArea))
  )
);
