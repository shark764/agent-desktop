/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContentArea
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';

import { isUUID } from 'utils/validator';

import ErrorBoundary from 'components/ErrorBoundary';

import Resizable from 'components/Resizable';
import Checkbox from 'components/Checkbox';
import IconSVG from 'components/IconSVG';
import Button from 'components/Button';
import ContentAreaTop from 'containers/ContentAreaTop';

import {
  updateNote,
  setInteractionConfirmation,
  removeInteraction,
} from 'containers/AgentDesktop/actions';
import {
  selectAgentDesktopMap,
  selectAwaitingDisposition,
  selectCrmModule,
} from 'containers/AgentDesktop/selectors';

import CrmRecordNotification from './CrmRecordNotification';
import messages from './messages';

export class ContentArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notesPanelHeight: this.props.interaction.note.notesPanelHeight,
      body: this.props.interaction.note.body,
      title: this.props.interaction.note.title,
      showDispositionsList: false,
      loadingDisposition: false,
      savingNote: false,
    };

    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.interaction.interactionId !==
      nextProps.interaction.interactionId
    ) {
      this.setState({
        showDispositionsList: false,
        notesPanelHeight: nextProps.interaction.note.notesPanelHeight,
        title: nextProps.interaction.note.title,
        body: nextProps.interaction.note.body,
        savingNote: false,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  persistNote = (note, currentNotesPanelHeight) => {
    const inContext =
      this.mounted &&
      this.props.interaction.interactionId === note.interactionId;
    if (!inContext || !this.state.savingNote) {
      if (inContext) {
        this.setState({
          savingNote: true,
        });
      }
      const callback = (error, topic, response) => {
        if (!error) {
          console.log('[ContentArea] CxEngage.subscribe()', topic, response);
          if (inContext) {
            this.setState({
              savingNote: false,
            });
          }
          if (
            topic.indexOf('cxengage/interactions/create-note-response') > -1
          ) {
            this.props.updateNote(note.interactionId, {
              title: note.title,
              body: note.body,
              noteId: response.noteId,
              notesPanelHeight: currentNotesPanelHeight,
            });
          } else {
            this.props.updateNote(this.props.interaction.interactionId, {
              title: note.title,
              body: note.body,
              notesPanelHeight: currentNotesPanelHeight,
            });
          }
        }
      };
      if (this.props.interaction.note.noteId) {
        CxEngage.interactions.updateNote(
          { noteId: this.props.interaction.note.noteId, ...note },
          callback
        );
      } else {
        CxEngage.interactions.createNote(note, callback);
      }
    }
  };

  styles = {
    base: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
    },
    mainContent: {
      flex: '1 0',
      backgroundColor: '#F3F3F3',
      height: '100%',
      padding: '5px',
    },
    header: {
      flex: '0 1 auto',
      padding: '0 10px',
    },
    fromButtonsContainer: {
      borderBottom: '1px solid #D0D0D0',
      padding: '10px 5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    from: {
      display: 'inline-block',
      fontSize: '20px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    buttons: {
      marginLeft: '10px',
    },
    details: {
      fontSize: '12px',
      padding: '10px 0',
    },
    content: {
      flex: '1 1 auto',
      position: 'relative',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E4E4E4',
    },
    notesArea: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      backgroundColor: '#E4E4E4',
      padding: '5px 11px',
    },
    notesTitleContainer: {
      display: 'flex',
      padding: '12px 24px',
      fontSize: '15px',
    },
    notesTitleInput: {
      flexGrow: 1,
      marginLeft: '6px',
      border: 'none',
      ':focus': {
        outline: 'none',
      },
    },
    disabled: {
      cursor: 'not-allowed',
    },
    dispositionChipsContainer: {
      flex: '0 1 auto',
      padding: '0 12px 12px',
      display: 'flex',
    },
    dispositionChip: {
      display: 'flex',
      backgroundColor: '#F3F3F3',
      borderRadius: '2px',
      fontSize: '12px',
      padding: '2px 7px',
      marginLeft: '10px',
      border: '1px solid #E4E4E4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dispositionsContainer: {
      paddingLeft: '15px',
      display: 'flex',
      flexDirection: 'column',
    },
    disposition: {
      display: 'flex',
      backgroundColor: '#F3F3F3',
      fontSize: '12px',
      padding: '2px 7px',
      margin: '4px 10px 0 0',
      border: '1px solid transparent',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 0,
    },
    dispositionNewLabel: {
      fontWeight: 600,
      cursor: 'pointer',
    },
    dispositionNewLabelPlus: {
      fontSize: '20px',
      lineHeight: '22px',
      marginRight: '10px',
    },
    dispositionLabelText: {
      maxWidth: '190px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    dispositionRemove: {
      fontSize: '20px',
      lineHeight: '22px',
      marginLeft: '5px',
      color: '#979797',
      cursor: 'pointer',
    },
    dispositionList: {
      position: 'absolute',
      zIndex: 11,
      bottom: '35px',
      left: '-115px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.14)',
      borderRadius: '3px',
      fontSize: '16px',
      padding: '10px 0 10px 15px',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    triangle: {
      width: '0px',
      height: '0px',
      borderTop: '10px solid white',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: 'none',
      position: 'absolute',
      zIndex: 12,
      bottom: '25px',
      left: '-55px',
    },
    selectableDisposition: {
      width: '220px',
    },
    notesTextarea: {
      flex: '1 1 36px',
      width: '100%',
      resize: 'none',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E4E4E4',
      padding: '20px',
    },
    wrapupContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    rightHeaderContainer: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      marginLeft: 'auto',
    },
    toggleWrapupLabel: {
      marginRight: '5px',
    },
    closeButton: {
      margin: '0',
      padding: '0 0 3px 5px',
      backgroundColor: 'inherit',
    },
    categoryName: {
      fontWeight: '600',
    },
    confirmDialog: {
      display: 'grid',
      height: 'calc(100% - 50px)',
    },
    confirmDialogInnerDiv: {
      margin: 'auto',
      textAlign: 'center',
      color: 'white',
    },
    confirmDialogWrapper: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 10,
      backgroundColor: 'rgba(16, 60, 78, 0.8)',
    },
    blueQuestionMark: {
      borderRadius: '50%',
      backgroundColor: '#23cef5',
      width: '20px',
      display: 'inline-block',
      margin: '10px',
    },
    blueLine: {
      height: '1px',
      width: '50px',
      marginBottom: '18px',
      backgroundColor: '#23cef5',
      display: 'inline-block',
      position: 'relative',
      top: '13px',
    },
    confirmButtons: {
      backgroundColor: 'white',
      padding: '7px 40px',
      border: 'none',
      position: 'relative',
      bottom: '30px',
      ':hover': {
        cursor: 'pointer',
        boxShadow: `0px 0px 10px rgb(35, 205, 244)`,
      },
    },
  };

  setNotesPanelHeight = (newHeight) => {
    this.setState({
      notesPanelHeight: newHeight,
    });
  };

  handleChange = (note) => {
    this.setState(note);
    clearTimeout(this.persistNoteIntervalId);
    const currentNotesPanelHeight = this.state.notesPanelHeight;
    const currentNote = {
      title: note.title || this.state.title,
      body: note.body || this.state.body,
      interactionId: this.props.interaction.interactionId,
    };
    this.persistNoteIntervalId = setTimeout(
      () => this.persistNote(currentNote, currentNotesPanelHeight),
      1500
    );
  };

  selectDisposition = (dispositionId) => {
    this.setState({
      loadingDisposition: true,
      showDispositionsList: false,
    });
    CxEngage.interactions.selectDispositionCode(
      {
        interactionId: this.props.interaction.interactionId,
        dispositionId,
      },
      (error, topic, response) => {
        console.log('[ContentArea] CxEngage.subscribe()', topic, response);
        this.setState({
          loadingDisposition: false,
        });
      }
    );
  };

  renderCategory = (category) => (
    <div
      key={`category-${category.name}`}
      id={`category-${category.name}`}
      title={category.name}
    >
      <div style={this.styles.categoryName}>{category.name}</div>
      <div style={this.styles.dispositionsContainer}>
        {category.dispositions.map(this.renderDisposition)}
      </div>
    </div>
  );

  renderDisposition = (disposition) => (
    <div
      key={`disposition-${disposition.dispositionId}`}
      id={`disposition-${disposition.dispositionId}`}
      title={disposition.name}
      style={this.styles.selectableDisposition}
    >
      <Checkbox
        id={`${disposition.dispositionId}-checkbox`}
        text={disposition.name}
        checked={false}
        cb={() => this.selectDisposition(disposition.dispositionId)}
        style={{ width: '100%' }}
        disabled={this.state.loadingDisposition}
      />
    </div>
  );

  deselectDisposition = () => {
    this.setState({
      loadingDisposition: true,
    });
    CxEngage.interactions.deselectDispositionCode(
      { interactionId: this.props.interaction.interactionId },
      (error, topic, response) => {
        console.log('[ContentArea] CxEngage.subscribe()', topic, response);
        this.setState({
          loadingDisposition: false,
        });
      }
    );
  };

  getNewLabelChipBorderColor = () => {
    if (this.props.awaitingDisposition) {
      return '#FE4565';
    } else if (this.state.showDispositionsList) {
      return '#97979';
    } else {
      return '#E4E4E4';
    }
  };

  getNotesContent = () => {
    const { formatMessage } = this.props.intl;
    return (
      <div key="notesArea" style={this.styles.notesArea}>
        <div style={this.styles.notesTitleContainer}>
          <FormattedMessage {...messages.notes} />
          <input
            id="notesTitleInput"
            placeholder={formatMessage(messages.notesTitlePlaceholder)}
            value={this.state.title}
            onChange={(e) => this.handleChange({ title: e.target.value })}
            style={[
              this.styles.notesTitleInput,
              this.props.interaction.status === 'work-ended-pending-script' &&
                this.styles.disabled,
            ]}
            maxLength="80"
            readOnly={
              this.props.interaction.status === 'work-ended-pending-script'
            }
          />
        </div>
        {this.getDispositionsContent()}
        <textarea
          id="notesTextarea"
          placeholder={formatMessage(messages.notesPlaceholder)}
          value={this.state.body}
          onChange={(e) => this.handleChange({ body: e.target.value })}
          style={[
            this.styles.notesTextarea,
            this.props.interaction.status === 'work-ended-pending-script' &&
              this.styles.disabled,
          ]}
          maxLength="65535"
          readOnly={
            this.props.interaction.status === 'work-ended-pending-script'
          }
        />
      </div>
    );
  };

  getConfirmContent = () => {
    const { formatMessage } = this.props.intl;
    return this.props.interaction.endConfirmation === true &&
      this.props.interaction.status !== 'wrapup' &&
      this.props.interaction.status !== 'work-ended-pending-script' ? (
        <div style={this.styles.confirmDialogWrapper}>
          <div style={this.styles.confirmDialog}>
            <div style={this.styles.confirmDialogInnerDiv}>
              {formatMessage(messages.confirmDialog1)}
              <div style={{ width: '100%' }}>
                <div style={this.styles.blueLine} />
                <div style={this.styles.blueQuestionMark}>?</div>
                <div style={this.styles.blueLine} />
              </div>
              {formatMessage(messages.confirmDialog2)}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <button
              key="cancelButton"
              style={this.styles.confirmButtons}
              onClick={() => this.cancelConfirmEnd()}
              id="cancelEndButton"
              autoFocus
            >
              {formatMessage(messages.cancelButton)}
            </button>
            <button
              key="confirmButton"
              style={this.styles.confirmButtons}
              onClick={() => this.confirmEnd()}
              id="confirmEndButton"
            >
              {formatMessage(messages.confirmButton)}
            </button>
          </div>
        </div>
      ) : null;
  };

  getDispositionsContent = () =>
    this.props.interaction.dispositionDetails.dispositions.length > 0 && (
      <div
        id="selected-dispositions"
        style={this.styles.dispositionChipsContainer}
      >
        {this.props.interaction.dispositionDetails.selected.map((disposition) => (
          <div
            id={`selected-disposition-${disposition.dispositionId}`}
            key={`selected-disposition-${disposition.dispositionId}`}
            title={disposition.name}
            style={this.styles.dispositionChip}
          >
            <span style={this.styles.dispositionLabelText}>
              {disposition.name !== undefined
                ? disposition.name.toUpperCase()
                : ''}
            </span>
            <Button
              id="delete-disposition-btn"
              style={this.styles.closeButton}
              clear
              iconName="close"
              type="secondary"
              onClick={this.deselectDisposition}
              disabled={this.state.loadingDisposition}
            />
          </div>
        ))}
        {this.props.interaction.dispositionDetails.selected.length === 0 &&
          this.props.interaction.status !== 'work-ended-pending-script' && [
            <div
              onClick={() =>
                this.setState({
                  showDispositionsList: !this.state.showDispositionsList,
                })
              }
              key="new-label-button"
              id="new-label-button"
              style={[
                this.styles.dispositionChip,
                this.styles.dispositionNewLabel,
                {
                  border: `1px solid ${this.getNewLabelChipBorderColor()}`,
                },
              ]}
            >
              <IconSVG
                name="add"
                id="add-disposition-icon"
                width="16px"
                color="grey"
              />
              <div
                style={[
                  this.styles.dispositionLabelText,
                  { marginLeft: '5px', padding: '2.5px 0' },
                ]}
              >
                <FormattedMessage {...messages.disposition} />
              </div>
            </div>,
            this.state.showDispositionsList && (
              <div
                id="dispositions-lists-container"
                key="dispositionsContainer"
                style={{ position: 'relative' }}
              >
                <div
                  id="dispositions-lists"
                  style={this.styles.dispositionList}
                >
                  {this.props.interaction.dispositionDetails.dispositions.map(
                    (disposition) => {
                      if (disposition.type === 'category') {
                        return this.renderCategory(disposition);
                      }
                      return this.renderDisposition(disposition);
                    }
                  )}
                </div>
                <div style={this.styles.triangle} />
              </div>
            ),
          ]}
      </div>
    );

  zendeskAssign = () => {
    if (this.props.crmActiveTab) {
      if (this.props.crmActiveTab.getIn(['contact', 'type']) === 'user') {
        CxEngage.zendesk.assignContact({
          interactionId: this.props.interaction.interactionId,
        });
      } else if (
        this.props.crmActiveTab.getIn(['contact', 'type']) === 'ticket'
      ) {
        CxEngage.zendesk.assignRelatedTo({
          interactionId: this.props.interaction.interactionId,
        });
      } else {
        console.error(
          `Cannot assign to active tab of type: ${this.props.crmActiveTab.getIn(
            ['contact', 'type']
          )}`
        );
      }
    }
  };

  zendeskUnassign = () => {
    if (
      this.props.crmActiveTab &&
      this.props.interaction.contact !== undefined
    ) {
      if (this.props.interaction.contact.type === 'user') {
        CxEngage.zendesk.unassignContact({
          interactionId: this.props.interaction.interactionId,
        });
      } else if (this.props.interaction.contact.type === 'ticket') {
        CxEngage.zendesk.unassignRelatedTo({
          interactionId: this.props.interaction.interactionId,
        });
      } else {
        console.error(
          `Cannot unassign contact of type: ${
            this.props.interaction.contact.type
          }`
        );
      }
    }
  };

  salesforceAssign = () => {
    if (this.props.crmModule === 'salesforce-classic') {
      CxEngage.salesforceClassic.assign({
        interactionId: `${this.props.interaction.interactionId}`,
      });
    } else {
      CxEngage.salesforceLightning.assign({
        interactionId: `${this.props.interaction.interactionId}`,
      });
    }
  };

  salesforceUnassign = () => {
    if (
      this.props.crmModule === 'salesforce-classic' &&
      this.props.interaction.contact !== undefined
    ) {
      CxEngage.salesforceClassic.unassign({
        interactionId: this.props.interaction.interactionId,
        objectId: this.props.interaction.contact.id,
      });
    } else {
      CxEngage.salesforceLightning.unassign({
        interactionId: this.props.interaction.interactionId,
        objectId: this.props.interaction.contact.id,
      });
    }
  };

  confirmEnd = () => {
    if (
      this.props.interaction.status === 'connecting-to-outbound' ||
      this.props.interaction.status === 'initializing-outbound'
    ) {
      this.props.removeInteraction(this.props.interaction.interactionId);
    } else if (
      this.props.interaction.channelType === 'email' &&
      this.props.interaction.direction === 'outbound'
    ) {
      CxEngage.interactions.sendCustomInterrupt({
        interactionId: this.props.interaction.interactionId,
        interruptType: 'work-cancel',
        interruptBody: {
          resourceId: this.props.agent.userId,
        },
      });
    } else if (!isUUID(this.props.interaction.interactionId)) {
      this.props.removeInteraction(this.props.interaction.interactionId);
    } else {
      CxEngage.interactions.end({
        interactionId: this.props.interaction.interactionId,
      });
      // FIXME We shouldn't have to do this. Flow should be sending us a work-ended back, but it is not currently.
      if (this.props.interaction.status === 'initialized-outbound') {
        this.props.removeInteraction(this.props.interaction.interactionId);
      }
    }
  };
  cancelConfirmEnd = () => {
    this.props.setInteractionConfirmation(
      this.props.interaction.interactionId,
      false
    );
  };

  render() {
    let { buttonConfig } = this.props;
    if (this.props.crmActiveTab !== undefined) {
      let isSelected = false;
      let text;
      let onClick;
      let disabled = !isUUID(this.props.interaction.interactionId);
      if (this.props.interaction.contact !== undefined) {
        if (
          this.props.interaction.contact.type ===
            this.props.crmActiveTab.getIn(['contact', 'type']) &&
          this.props.interaction.contact.id ===
            this.props.crmActiveTab.getIn(['contact', 'id'])
        ) {
          text = messages.unassign;
          onClick = this.zendeskUnassign;
        } else {
          text = messages.assigned;
          isSelected = true;
          disabled = true;
        }
      } else {
        text = messages.assign;
        onClick = this.zendeskAssign;
      }
      buttonConfig = buttonConfig.concat({
        id: 'crmAssign',
        type: 'secondary',
        text,
        onClick,
        isSelected,
        // isUUID only returns true once we have passed through a series
        // of states that take us from the attempt to connect to outbound
        // up until the interaction has has actually started and has a interactionId.
        disabled,
      });
    }

    // TODO: this button wont be needed once sdk give us an active tab changed subscription for salesforce classic and lightning
    // combine the below into the button directly above once sdk work is completed
    if (
      this.props.crmModule !== 'none' &&
      this.props.crmActiveTab === undefined
    ) {
      let isSelected = false;
      let text;
      let onClick;
      let disabled = !isUUID(this.props.interaction.interactionId);
      if (this.props.interaction.contact !== undefined) {
        if (
          this.props.interaction.contact.type &&
          this.props.interaction.contact.id
        ) {
          text = messages.unassign;
          onClick = this.salesforceUnassign;
        } else {
          text = messages.assigned;
          isSelected = true;
          disabled = true;
        }
      } else {
        text = messages.assign;
        onClick = this.salesforceAssign;
      }
      buttonConfig = buttonConfig.concat({
        id: 'crmAssign',
        type: 'secondary',
        text,
        onClick,
        isSelected,
        // isUUID only returns true once we have passed through a series
        // of states that take us from the attempt to connect to outbound
        // up until the interaction has has actually started and has a interactionId.
        disabled,
      });
    }

    let notesDisabled = false;
    if (this.context.toolbarMode) {
      notesDisabled = true;
    }
    return (
      <div style={{ height: '100%' }}>
        {this.getConfirmContent()}
        <div
          style={[
            this.styles.base,
            {
              filter: `blur(${
                this.props.interaction.endConfirmation === true &&
                this.props.interaction.status !== 'wrapup' &&
                this.props.interaction.status !== 'work-ended-pending-script'
                  ? '1'
                  : '0'
              }px)`,
            },
          ]}
        >
          <div style={this.styles.mainContent}>
            <div style={this.styles.base}>
              {this.props.crmModule !== 'none' && (
                <CrmRecordNotification
                  contactAssignedNotification={
                    this.props.interaction.contactAssignedNotification
                  }
                  interactionId={this.props.interaction.interactionId}
                />
              )}
              <div style={this.styles.header}>
                <ContentAreaTop
                  interaction={this.props.interaction}
                  from={this.props.from}
                  buttonConfig={buttonConfig}
                />
                <div style={this.styles.details}>{this.props.details}</div>
              </div>
              {this.props.content && (
                <div style={this.styles.content}>{this.props.content}</div>
              )}
              {notesDisabled && (
                <div style={{ paddingTop: '15px', marginTop: 'auto' }}>
                  {this.getDispositionsContent()}
                </div>
              )}
            </div>
          </div>
          {!notesDisabled && [
            this.props.content ? (
              <Resizable
                id="notes-resizable"
                key="notes-resizable"
                direction="top"
                setPx={this.setNotesPanelHeight}
                disabledPx={50}
                px={this.state.notesPanelHeight}
                maxPx={600}
                minPx={125}
                isDisabled={false}
              >
                {this.getNotesContent()}
              </Resizable>
            ) : (
              this.getNotesContent()
            ),
          ]}
        </div>
      </div>
    );
  }
}

export const buttonConfigPropTypes = {
  text: PropTypes.any,
  mouseOverText: PropTypes.object,
  iconName: PropTypes.string,
  children: PropTypes.element,
  tabIndex: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  clear: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
  hasSubButtons: PropTypes.bool,
  isSelected: PropTypes.bool,
};

ContentArea.propTypes = {
  intl: intlShape.isRequired,
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes)),
  details: PropTypes.node.isRequired,
  content: PropTypes.node,
  crmModule: PropTypes.string,
  crmActiveTab: ImmutablePropTypes.mapContains({
    contact: ImmutablePropTypes.mapContains({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      attributes: ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }),
  awaitingDisposition: PropTypes.bool.isRequired,
  updateNote: PropTypes.func.isRequired,
  setInteractionConfirmation: PropTypes.func.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  agent: PropTypes.object,
};

ContentArea.contextTypes = {
  toolbarMode: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  crmActiveTab: selectAgentDesktopMap(state, props).get('crmActiveTab'),
  awaitingDisposition: selectAwaitingDisposition(state, props),
  crmModule: selectCrmModule(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    updateNote: (interactionId, note) =>
      dispatch(updateNote(interactionId, note)),
    removeInteraction: (interactionId) =>
      dispatch(removeInteraction(interactionId)),
    setInteractionConfirmation: (interactionId, status) =>
      dispatch(setInteractionConfirmation(interactionId, status)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContentArea)))
);
