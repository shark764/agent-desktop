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
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import Resizable from 'components/Resizable';
import Checkbox from 'components/Checkbox';
import IconSVG from 'components/IconSVG';
import Button from 'components/Button';
import ContentAreaTop from 'containers/ContentAreaTop';

import { updateNote } from 'containers/AgentDesktop/actions';
import {
  selectAgentDesktopMap,
  selectAwaitingDisposition,
} from 'containers/AgentDesktop/selectors';
import { buttonConfigPropTypes } from 'components/ButtonLayout';

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
      loadingWrapup: false,
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
      border: '1px solid transparent',
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
    addIcon: {
      width: '16px',
      height: '16px',
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

  renderCategory = (category) =>
    (<div
      key={`category-${category.name}`}
      id={`category-${category.name}`}
      title={category.name}
    >
      <div style={this.styles.categoryName}>
        {category.name}
      </div>
      <div style={this.styles.dispositionsContainer}>
        {category.dispositions.map(this.renderDisposition)}
      </div>
    </div>);

  renderDisposition = (disposition) =>
    (<div
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
    </div>);

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
      return '#F3F3F3';
    }
  };

  getNotesContent = () => {
    const { formatMessage } = this.props.intl;
    return (
      <div style={this.styles.notesArea}>
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
        {this.props.interaction.dispositionDetails.dispositions.length
          ? <div
            id="selected-dispositions"
            style={this.styles.dispositionChipsContainer}
          >
            {this.props.interaction.dispositionDetails.selected.map(
                (disposition) =>
                  (<div
                    id={`selected-disposition-${disposition.dispositionId}`}
                    key={`selected-disposition-${disposition.dispositionId}`}
                    title={disposition.name}
                    style={[this.styles.dispositionChip]}
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
                  </div>)
              )}
            {this.props.interaction.dispositionDetails.selected.length ===
                0 &&
              this.props.interaction.status !== 'work-ended-pending-script'
                ? [
                  <div
                    onClick={() =>
                        this.setState({
                          showDispositionsList: !this.state
                            .showDispositionsList,
                        })}
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
                      style={this.styles.addIcon}
                    />
                    <span
                      style={[
                        this.styles.dispositionLabelText,
                          { marginLeft: '5px', padding: '2.5px 0' },
                      ]}
                    >
                      <FormattedMessage {...messages.disposition} />
                    </span>
                  </div>,
                  this.state.showDispositionsList
                      ? <div
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
                      : undefined,
                ]
                : undefined}
          </div>
          : undefined}
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

  zendeskAssign = () => {
    if (this.props.zendeskActiveTab) {
      if (this.props.zendeskActiveTab.get('type') === 'user') {
        CxEngage.zendesk.assignContact({
          interactionId: this.props.interaction.interactionId,
        });
      } else if (this.props.zendeskActiveTab.get('type') === 'ticket') {
        CxEngage.zendesk.assignRelatedTo({
          interactionId: this.props.interaction.interactionId,
        });
      }
    }
  };

  render() {
    let buttonConfig = this.props.buttonConfig;
    if (this.props.zendeskActiveTab) {
      buttonConfig = buttonConfig.concat({
        id: 'zendeskAssign',
        type: 'secondary',
        text: messages.assign,
        onClick: this.zendeskAssign,
      });
    }

    return (
      <div style={this.styles.base}>
        <div style={this.styles.mainContent}>
          <div style={this.styles.base}>
            <div style={this.styles.header}>
              <ContentAreaTop
                interaction={this.props.interaction}
                from={this.props.from}
                buttonConfig={buttonConfig}
              />
              <div style={this.styles.details}>
                {this.props.details}
              </div>
            </div>
            {this.props.content &&
              <div style={this.styles.content}>
                {this.props.content}
              </div>}
          </div>
        </div>
        {this.props.content
          ? <Resizable
            id="notes-resizable"
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
          : this.getNotesContent()}
      </div>
    );
  }
}

ContentArea.propTypes = {
  intl: intlShape.isRequired,
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node,
  buttonConfig: PropTypes.arrayOf(PropTypes.shape(buttonConfigPropTypes))
    .isRequired,
  details: PropTypes.node.isRequired,
  content: PropTypes.node,
  zendeskActiveTab: PropTypes.object.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
  updateNote: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  zendeskActiveTab: selectAgentDesktopMap(state, props).get('zendeskActiveTab'),
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    updateNote: (interactionId, note) =>
      dispatch(updateNote(interactionId, note)),
    dispatch,
  };
}

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContentArea)))
);
