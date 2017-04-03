/*
 *
 * EmailContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Radium from 'radium';

import moment from 'moment';
import 'assets/css/mediumdraft.min.css';
import { Editor, createEditorState } from 'medium-draft';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';

import { isValidEmail } from 'utils/validator';

import Button from 'components/Button';
import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';
import LoadingText from 'components/LoadingText';
import TextInput from 'components/TextInput';

import ContentArea from 'containers/ContentArea';

import { emailAddAttachment, emailRemoveAttachment, emailUpdateReply, emailSendReply } from 'containers/AgentDesktop/actions';
import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class EmailContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.onEmailCreateReply = this.onEmailCreateReply.bind(this);
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };

    this.state = {
      subject: this.props.selectedInteraction.emailReply ? this.props.selectedInteraction.emailReply.subject : undefined,
      tos: this.props.selectedInteraction.emailReply ? this.props.selectedInteraction.emailReply.tos : undefined,
      toInput: '',
      ccs: this.props.selectedInteraction.emailReply ? this.props.selectedInteraction.emailReply.ccs : undefined,
      ccInput: '',
      bccs: this.props.selectedInteraction.emailReply ? this.props.selectedInteraction.emailReply.bccs : undefined,
      bccInput: '',
      editorState: this.props.selectedInteraction.emailReply
        ? EditorState.createWithContent(stateFromHTML(this.props.selectedInteraction.emailReply.message))
        : createEditorState(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedInteraction.interactionId !== nextProps.selectedInteraction.interactionId) {
      if (this.props.selectedInteraction.emailReply) {
        this.emailUpdateReply();
      }
      this.setState({
        tos: nextProps.selectedInteraction.emailReply.tos,
        ccs: nextProps.selectedInteraction.emailReply.ccs,
        bccs: nextProps.selectedInteraction.emailReply.bccs,
        subject: nextProps.selectedInteraction.emailReply.subject,
        editorState: nextProps.selectedInteraction.emailReply
          ? EditorState.createWithContent(stateFromHTML(nextProps.selectedInteraction.emailReply.message))
          : createEditorState(),
      });
    } else if (this.props.selectedInteraction.emailReply === undefined && nextProps.selectedInteraction.emailReply !== undefined) {
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

  emailUpdateReply() {
    this.props.emailUpdateReply(this.props.selectedInteraction.interactionId, {
      tos: this.state.tos,
      ccs: this.state.ccs,
      bccs: this.state.bccs,
      subject: this.state.subject,
      message: stateToHTML(this.state.editorState.getCurrentContent()),
    });
  }

  onEmailCreateReply() {
    this.setState({
      editorState: createEditorState(),
    });
    this.props.emailCreateReply(this.props.selectedInteraction.interactionId);
  }

  onCommaAddTo(e) {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.toInput)) {
        this.setState({
          tos: this.state.tos.concat({ name: this.state.toInput, address: this.state.toInput }),
          toInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  }

  onCommaAddCc(e) {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.ccInput)) {
        this.setState({
          ccs: this.state.ccs.concat({ name: this.state.ccInput, address: this.state.ccInput }),
          ccInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  }

  onCommaAddBcc(e) {
    if (e.keyCode === 188) {
      e.preventDefault();
      if (isValidEmail(this.state.bccInput)) {
        this.setState({
          bccs: this.state.bccs.concat({ name: this.state.bccInput, address: this.state.bccInput }),
          bccInput: '',
        });
      }
      return false;
    } else {
      return true;
    }
  }

  onBlurAddTo() {
    if (isValidEmail(this.state.toInput)) {
      this.setState({
        tos: this.state.tos.concat({ name: this.state.toInput, address: this.state.toInput }),
        toInput: '',
      });
    }
  }

  onBlurAddCc() {
    if (isValidEmail(this.state.ccInput)) {
      this.setState({
        ccs: this.state.ccs.concat({ name: this.state.ccInput, address: this.state.ccInput }),
        ccInput: '',
      });
    }
  }

  onBlurAddBcc() {
    if (isValidEmail(this.state.bccInput)) {
      this.setState({
        bccs: this.state.bccs.concat({ name: this.state.bccInput, address: this.state.bccInput }),
        bccInput: '',
      });
    }
  }

  removeTo(toRemove) {
    this.setState({
      tos: this.state.tos.filter((to) =>
        to !== toRemove
      ),
    });
  }

  removeCc(ccRemove) {
    this.setState({
      ccs: this.state.ccs.filter((cc) =>
        cc !== ccRemove
      ),
    });
  }

  removeBcc(bccRemove) {
    this.setState({
      bccs: this.state.bccs.filter((bcc) =>
        bcc !== bccRemove
      ),
    });
  }

  addFilesToEmail(fileList) {
    for (let i = 0; i < fileList.length; i += 1) {
      this.props.emailAddAttachment(this.props.selectedInteraction.interactionId, {});
      SDK.interactions.email.addAttachment({ interactionId: this.props.selectedInteraction.interactionId, file: fileList[i] });
    }
  }

  removeAttachment(attachmentId) {
    this.props.emailRemoveAttachment(this.props.selectedInteraction.interactionId, attachmentId);
    SDK.interactions.email.removeAttachment({ interactionId: this.props.selectedInteraction.interactionId, attachmentId });
  }

  sendEmail() {
    this.props.emailSendReply(this.props.selectedInteraction.interactionId);
    console.log('SDK.interactions.email.sendReply()', {
      interactionId: this.props.selectedInteraction.interactionId,
      to: this.state.tos,
      cc: this.state.ccs,
      bcc: this.state.bccs,
      subject: this.state.subject,
      htmlBody: stateToHTML(this.state.editorState.getCurrentContent()),
      plainTextBody: this.state.editorState.getCurrentContent().getPlainText(),
    });
    SDK.interactions.email.sendReply({
      interactionId: this.props.selectedInteraction.interactionId,
      to: this.state.tos,
      cc: this.state.ccs,
      bcc: this.state.bccs,
      subject: this.state.subject,
      htmlBody: stateToHTML(this.state.editorState.getCurrentContent()),
      plainTextBody: this.state.editorState.getCurrentContent().getPlainText(),
    });
  }

  styles = {
    detailsField: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
      verticalAlign: 'top',
    },
    detailsValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
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
    replyButtons: { width: '148px' },
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
    richTextEditorContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      paddingTop: '15px',
    },
  }

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

    let buttons;
    let details;
    let content;

    if (this.props.selectedInteraction.sendingReply === true) {
      buttons = (
        <div style={this.styles.replyButtons}>
          <Button
            id="cancelEmail"
            type="secondary"
            style={{ marginRight: '5px' }}
            text={messages.cancel}
            onClick={() => this.props.emailCancelReply(this.props.selectedInteraction.interactionId)}
          />
          <Button
            id="sendEmail"
            type="primaryRed"
            text={messages.send}
            onClick={() => this.sendEmail()}
            disabled
          />
        </div>
      );
      details = <div></div>;
      content = (
        <div>
          <IconSVG style={this.styles.loadingSendingEmail} id="sendingReplyIcon" name="loading" />
          <div style={this.styles.centerText}>
            <FormattedMessage {...messages.sendingReply} />
          </div>
        </div>
      );
    } else if (this.props.selectedInteraction.emailReply === undefined) {
      if (this.props.selectedInteraction.emailDetails === undefined || (this.props.selectedInteraction.emailHtmlBody === undefined && this.props.selectedInteraction.emailPlainBody === undefined)) {
        buttons = (
          <Button
            id="replyEmailDisabled"
            key="replyEmailDisabled"
            type="primaryBlue"
            text={messages.reply}
            disabled
          />
        );
      } else {
        buttons = (
          <div>
            <Button
              id="endEmail"
              type="primaryRed"
              text={messages.noReply}
              onClick={this.props.endInteraction}
              disabled={this.props.awaitingDisposition}
              style={{ marginRight: '8px' }}
            />
            <Button
              id="replyEmail"
              type="primaryBlue"
              text={messages.reply}
              onClick={this.onEmailCreateReply}
            />
          </div>
        );
      }
      if (this.props.selectedInteraction.emailDetails === undefined) {
        details = <IconSVG style={this.styles.loadingCircle} id="loadingEmailDetails" name="loading" />;
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
        const bccs = this.props.selectedInteraction.emailDetails.bcc.map((bcc) => {
          if (bcc.name && bcc.name !== bcc.address) {
            return `${bcc.name} [${bcc.address}]`;
          } else {
            return bcc.address;
          }
        });
        details = (
          <div>
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.to} />
              </div>
              <div style={this.styles.detailsValue}>
                { tos }
              </div>
            </div>
            {
              ccs.length > 0
              ? <div>
                <div style={this.styles.detailsField}>
                  <FormattedMessage {...messages.cc} />
                </div>
                <div style={this.styles.detailsValue}>
                  { ccs.join(', ') }
                </div>
              </div>
              : undefined
            }
            {
              bccs.length > 0
              ? <div>
                <div style={this.styles.detailsField}>
                  <FormattedMessage {...messages.bcc} />
                </div>
                <div style={this.styles.detailsValue}>
                  { bccs.join(', ') }
                </div>
              </div>
              : undefined
            }
            <div>
              <div style={this.styles.detailsField}>
                <FormattedMessage {...messages.subject} />
              </div>
              <div style={this.styles.detailsValue}>
                {this.props.selectedInteraction.emailDetails.subject}
              </div>
            </div>
            {
              this.props.selectedInteraction.emailDetails.attachments !== undefined && this.props.selectedInteraction.emailDetails.attachments.length > 0
              ? <div style={this.styles.attachmentsContainer}>
                {
                  this.props.selectedInteraction.emailDetails.attachments.map((attachment, index) =>
                    <a key={attachment.artifactFileId} id={`attachment-${index}`} className="attachment" href={attachment.url} download >
                      <div style={this.styles.attachment} >
                        {attachment.filename}
                        {
                          attachment.url === undefined
                          ? <div style={{ display: 'inline-block', marginLeft: '6px' }}>
                            <IconSVG style={this.styles.loadingAttachment} id={`loadingAttachment-${index}`} name="loading" />
                          </div>
                          : ''
                        }
                      </div>
                    </a>
                  )
                }
              </div>
              : undefined
            }
          </div>
        );
      }

      if (this.props.selectedInteraction.emailHtmlBody === undefined && this.props.selectedInteraction.emailPlainBody === undefined) {
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
            { /* Remove this inline style when inline attachments/images are supported */ }
            <style>{'#emailContainer img { display: none; }'}</style>
            { // eslint-disable-next-line react/no-danger
            }<div id="emailContainer" style={this.styles.emailContent} dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.emailHtmlBody }} />
          </div>
        );
      } else {
        content = (
          <div id="emailContainer" style={this.styles.emailContent}>
            { this.props.selectedInteraction.emailPlainBody }
          </div>
        );
      }
    } else {
      buttons = (
        <div style={this.styles.replyButtons}>
          <Button
            id="cancelEmail"
            type="secondary"
            style={{ marginRight: '5px' }}
            text={messages.cancel}
            onClick={() => this.props.emailCancelReply(this.props.selectedInteraction.interactionId)}
          />
          <Button
            id="sendEmail"
            type="primaryRed"
            text={messages.send}
            onClick={() => this.sendEmail()}
          />
        </div>
      );

      details = (
        <div>
          <div style={this.styles.inputContainer}>
            <div style={this.styles.detailsField}>
              <FormattedMessage {...messages.to} />
            </div>
            <div style={this.styles.detailsValue}>
              {
                this.state.tos.map((to, index) =>
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`${index}-${to.address}`} id={`${index}-${to.address}`} style={this.styles.emailAddress}>
                    { to.name && to.name !== to.address ? `${to.name} [${to.address}]` : to.address }
                    <span onClick={() => this.removeTo(to)} style={this.styles.emailAddressRemove}>
                      &#10060;
                    </span>
                  </div>
                )
              }
              <TextInput
                id="emailToInput"
                styleType="inlineInherit"
                value={this.state.toInput}
                cb={(toInput) => this.setState({ toInput })}
                onKeyDown={(e) => this.onCommaAddTo(e)}
                onBlur={() => this.onBlurAddTo()}
              />
            </div>
          </div>
          <div style={this.styles.inputContainer}>
            <div style={this.styles.detailsField}>
              <FormattedMessage {...messages.cc} />
            </div>
            <div style={this.styles.detailsValue}>
              {
                this.state.ccs.map((cc, index) =>
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`${index}-${cc.address}`} id={`${index}-${cc.address}`} style={this.styles.emailAddress}>
                    { cc.name && cc.name !== cc.address ? `${cc.name} [${cc.address}]` : cc.address }
                    <span className="removeAddress" onClick={() => this.removeCc(cc)} style={this.styles.emailAddressRemove}>
                      &#10060;
                    </span>
                  </div>
                )
              }
              <TextInput
                id="emailCcInput"
                styleType="inlineInherit"
                value={this.state.ccInput}
                cb={(ccInput) => this.setState({ ccInput })}
                onKeyDown={(e) => this.onCommaAddCc(e)}
                onBlur={() => this.onBlurAddCc()}
              />
            </div>
          </div>
          <div style={this.styles.inputContainer}>
            <div style={this.styles.detailsField}>
              <FormattedMessage {...messages.bcc} />
            </div>
            <div style={this.styles.detailsValue}>
              {
                this.state.bccs.map((bcc, index) =>
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`${index}-${bcc.address}`} id={`${index}-${bcc.address}`} style={this.styles.emailAddress}>
                    { bcc.name && bcc.name !== bcc.address ? `${bcc.name} [${bcc.address}]` : bcc.address }
                    <span className="removeAddress" onClick={() => this.removeBcc(bcc)} style={this.styles.emailAddressRemove}>
                      &#10060;
                    </span>
                  </div>
                )
              }
              <TextInput
                id="emailBccInput"
                styleType="inlineInherit"
                value={this.state.bccInput}
                cb={(bccInput) => this.setState({ bccInput })}
                onKeyDown={(e) => this.onCommaAddBcc(e)}
                onBlur={() => this.onBlurAddBcc()}
              />
            </div>
          </div>
          <div>
            <div style={this.styles.detailsField}>
              <FormattedMessage {...messages.subject} />
            </div>
            <div style={this.styles.detailsValue}>
              <TextInput id="subjectInput" styleType="inlineInherit" value={this.state.subject} cb={(subject) => this.setState({ subject })} style={{ width: '100%' }} />
            </div>
          </div>
          <div style={this.styles.attachmentsContainer}>
            {
              this.props.selectedInteraction.emailReply.attachments.map((attachment, index) =>
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${index}-${attachment.name}`} id={`${index}-${attachment.name}`} style={this.styles.attachment} >
                  {
                    attachment.attachmentId === undefined
                    ? <div>Uploading...</div>
                    : <div>
                      <span style={this.styles.attachmentName}>
                        {attachment.name}
                      </span>
                      <span onClick={() => this.removeAttachment(attachment.attachmentId)} style={this.styles.attachmentRemove}>
                        &#10060;
                      </span>
                    </div>
                  }
                </div>
              )
            }
            <input id="attachmentFilePicker" type="file" multiple value="" onChange={(e) => this.addFilesToEmail(e.target.files)} style={{ display: 'none' }} />
            <label id="attachmentFilePickerLabel" htmlFor="attachmentFilePicker">
              <div style={[this.styles.attachment, this.styles.addAttachment]}>
                <Icon name="attachment" style={this.styles.attachmentIcon} />
                {
                  this.props.selectedInteraction.emailReply.attachments.length === 0
                  ? <span style={this.styles.addAttachmentMessage}>
                    <FormattedMessage {...messages.addAttachment} />
                  </span>
                  : undefined
                }
              </div>
            </label>
          </div>
        </div>
      );

      const timestampFormatted = moment(this.props.selectedInteraction.emailDetails.dateSent).format('LL');
      const emailReplyingTo = (
        <div className="md-RichEditor-editor" style={{ padding: '0 30px 20px' }}>
          <p>On {timestampFormatted} {this.props.selectedInteraction.emailDetails.from[0].name} wrote:</p>
          {
            this.props.selectedInteraction.emailHtmlBody !== undefined
            ? <blockquote className="md-RichEditor-blockquote" dangerouslySetInnerHTML={{ __html: this.props.selectedInteraction.emailHtmlBody }}></blockquote>
            : <blockquote className="md-RichEditor-blockquote">{ this.props.selectedInteraction.emailPlainBody }</blockquote>
          }
        </div>
      );

      const { editorState } = this.state;
      content = (
        <div style={this.styles.richTextEditorContainer}>
          <Editor
            editorState={editorState}
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
          { emailReplyingTo }
        </div>
      );
    }

    return <ContentArea interaction={this.props.selectedInteraction} from={from} buttons={buttons} details={details} content={content} />;
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
};


const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    emailAddAttachment: (interactionId, attachment) => dispatch(emailAddAttachment(interactionId, attachment)),
    emailRemoveAttachment: (interactionId, attachmentId) => dispatch(emailRemoveAttachment(interactionId, attachmentId)),
    emailUpdateReply: (interactionId, reply) => dispatch(emailUpdateReply(interactionId, reply)),
    emailSendReply: (interactionId) => dispatch(emailSendReply(interactionId)),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(EmailContentArea)));
