/*
 *
 * ContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Toggle from 'react-toggle';
import Resizable from 'components/Resizable';
import Checkbox from 'components/Checkbox';
import IconSVG from 'components/IconSVG';
import Button from 'components/Button';

import { updateNote } from 'containers/AgentDesktop/actions';
import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class ContentArea extends React.Component {
  constructor(props) {
    super(props);
    this.setNotesPanelHeight = this.setNotesPanelHeight.bind(this);
    this.toggleWrapup = this.toggleWrapup.bind(this);
    this.state = {
      notesPanelHeight: this.props.interaction.note.notesPanelHeight,
      body: this.props.interaction.note.body,
      title: this.props.interaction.note.title,
      showDispositionsList: false,
      loadingDisposition: false,
      loadingWrapup: false,
      savingNote: false,
    };

    this.selectDisposition = this.selectDisposition.bind(this);
    this.renderDisposition = this.renderDisposition.bind(this);
    this.deselectDisposition = this.deselectDisposition.bind(this);
    this.renderCategory = this.renderCategory.bind(this);
    this.persistNote = this.persistNote.bind(this);
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interaction.interactionId !== nextProps.interaction.interactionId) {
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
    clearInterval(this.persistNoteIntervalId);
    this.persistNote();
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  persistNote() {
    if (!this.state.savingNote) {
      this.setState({
        savingNote: true,
      });
      const currentNotesPanelHeight = this.state.notesPanelHeight;
      const note = {
        title: this.state.title,
        body: this.state.body,
        interactionId: this.props.interaction.interactionId,
      };
      const callback = (error, topic, response) => {
        // TODO: error handling / display
        console.log('[ContentArea] SDK.subscribe()', topic, response);
        if (this.mounted && this.props.interaction.interactionId === note.interactionId) {
          this.setState({
            savingNote: false,
          });
        }
        if (topic.indexOf('cxengage/interactions/create-note-response') > -1) {
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
      };
      if (this.props.interaction.note.noteId) {
        note.noteId = this.props.interaction.note.noteId;
        SDK.interactions.updateNote(note, callback);
      } else {
        SDK.interactions.createNote(note, callback);
      }
    }
  }

  styles = {
    base: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
    },
    mainContent: {
      flex: '1 1 auto',
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
      padding: '5px',
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
      left: '-160px',
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
    },
    toggleWrapupLabel: {
      marginRight: '5px',
    },
    closeButton: {
      margin: '0',
      padding: '0 0 3px 5px',
    },
    categoryName: {
      fontWeight: '600',
    },
    addIcon: {
      width: '16px',
      height: '16px',
      paddingBottom: '2px',
    },
  };

  setNotesPanelHeight(newHeight) {
    this.setState({
      notesPanelHeight: newHeight,
    });
  }

  handleChange(note) {
    this.setState(note);
    clearTimeout(this.persistNoteIntervalId);
    this.persistNoteIntervalId = setTimeout(this.persistNote, 1500);
  }

  toggleWrapup() {
    const wrapupToggleCallback = (error, topic, response) => {
      console.log('[AgentDesktop] SDK.subscribe()', topic, response);
      // TODO: display / handle error
      this.setState({ loadingWrapup: false });
    };
    this.setState({ loadingWrapup: true });
    if (this.props.interaction.wrapupDetails.wrapupEnabled) {
      SDK.interactions.disableWrapup({ interactionId: this.props.interaction.interactionId }, wrapupToggleCallback);
    } else {
      SDK.interactions.enableWrapup({ interactionId: this.props.interaction.interactionId }, wrapupToggleCallback);
    }
  }

  selectDisposition(dispositionId) {
    this.setState({
      loadingDisposition: true,
      showDispositionsList: false,
    });
    SDK.interactions.selectDispositionCode({
      interactionId: this.props.interaction.interactionId,
      dispositionId,
    }, (error, topic, response) => {
      console.log('[ContentArea] SDK.subscribe()', topic, response);
      // TODO: display / handle error
      this.setState({
        loadingDisposition: false,
      });
    });
  }

  renderCategory(category) {
    return (
      <div key={`category-${category.name}`} id={`category-${category.name}`} title={category.name}>
        <div style={this.styles.categoryName}>{category.name}</div>
        <div style={this.styles.dispositionsContainer}>
          {
            category.dispositions.map(this.renderDisposition)
          }
        </div>
      </div>
    );
  }

  renderDisposition(disposition) {
    return (
      <div key={`disposition-${disposition.dispositionId}`} id={`disposition-${disposition.dispositionId}`} title={disposition.name} style={this.styles.selectableDisposition}>
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
  }

  deselectDisposition() {
    this.setState({
      loadingDisposition: true,
    });
    SDK.interactions.deselectDispositionCode({ interactionId: this.props.interaction.interactionId }, (error, topic, response) => {
      console.log('[ContentArea] SDK.subscribe()', topic, response);
      // TODO: display / handle error
      if (
        this.props.interaction.dispositionDetails.forceSelect &&
        !this.props.interaction.wrapupDetails.wrapupEnabled
      ) {
        SDK.interactions.enableWrapup({ interactionId: response.interactionId });
      }
      this.setState({
        loadingDisposition: false,
      });
    });
  }

  getNewLabelChipBorderColor() {
    if (this.props.awaitingDisposition) {
      return '#FE4565';
    } else if (this.state.showDispositionsList) {
      return '#97979';
    } else {
      return '#F3F3F3';
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div style={this.styles.base}>
        <div style={this.styles.mainContent}>
          <div style={this.styles.base}>
            <div style={this.styles.header}>
              <div style={this.styles.fromButtonsContainer}>
                <div style={this.styles.from}>
                  {this.props.from}
                </div>
                <div style={this.styles.rightHeaderContainer}>
                  {this.props.interaction.status !== 'wrapup' ?
                    <div id="wrapupContainer" style={this.styles.wrapupContainer}>
                      <label htmlFor="wrapupToggle" style={this.styles.toggleWrapupLabel}>
                        <FormattedMessage {...messages.wrapup} />
                      </label>
                      <Toggle
                        id="toggleWrapup"
                        icons={false}
                        onChange={this.toggleWrapup}
                        disabled={
                          this.state.loadingWrapup ||
                          !this.props.interaction.wrapupDetails.wrapupUpdateAllowed || (
                            this.props.interaction.dispositionDetails.forceSelect &&
                            this.props.interaction.dispositionDetails.selected.length === 0
                          )
                        }
                        checked={this.props.interaction.wrapupDetails.wrapupEnabled}
                      />
                    </div>
                    : undefined
                  }
                  <div style={this.styles.buttons}>
                    {this.props.buttons}
                  </div>
                </div>
              </div>
              <div style={this.styles.details}>
                {this.props.details}
              </div>
            </div>
            <div style={this.styles.content}>
              {this.props.content}
            </div>
          </div>
        </div>
        <Resizable id="notes-resizable" direction="top" setPx={this.setNotesPanelHeight} disabledPx={50} px={this.state.notesPanelHeight} maxPx={600} minPx={125} isDisabled={false} >
          <div style={this.styles.notesArea}>
            <div style={this.styles.notesTitleContainer}>
              <FormattedMessage {...messages.notes} />
              <input
                id="notesTitleInput"
                placeholder={formatMessage(messages.notesTitlePlaceholder)}
                value={this.state.title}
                onChange={(e) => this.handleChange({ title: e.target.value })}
                style={this.styles.notesTitleInput}
              />
            </div>
            {
              <div style={this.styles.dispositionChipsContainer}>
                {
                  this.props.interaction.dispositionDetails.selected.map((disposition) =>
                    <div id={`selected-disposition-${disposition.dispositionId}`} key={`selected-disposition-${disposition.dispositionId}`} title={disposition.name} style={[this.styles.dispositionChip]} >
                      <span style={this.styles.dispositionLabelText}>
                        { disposition.name !== undefined ? disposition.name.toUpperCase() : '' }
                      </span>
                      <Button
                        id="delete-disposition-btn"
                        clear
                        style={this.styles.closeButton}
                        iconName="close"
                        type="secondary"
                        onClick={this.deselectDisposition}
                        disabled={this.state.loadingDisposition}
                      />
                    </div>
                  )
                }
                {
                  this.props.interaction.dispositionDetails.selected.length === 0
                  ? [
                    <div
                      onClick={() => this.setState({ showDispositionsList: !this.state.showDispositionsList })}
                      key="new-label-button"
                      id="new-label-button"
                      style={[this.styles.dispositionChip, this.styles.dispositionNewLabel, { border: `1px solid ${this.getNewLabelChipBorderColor()}` }]}
                    >
                      <IconSVG
                        name="add"
                        id="add-disposition-icon"
                        style={this.styles.addIcon}
                      />
                      <span style={[this.styles.dispositionLabelText, { marginLeft: '5px' }]}>
                        <FormattedMessage {...messages.newLabel} />
                      </span>
                    </div>,
                    this.state.showDispositionsList && this.props.interaction.dispositionDetails.dispositions.length
                      ? <div key="dispositionsContainer" style={{ position: 'relative' }}>
                        <div style={this.styles.dispositionList}>
                          {
                            this.props.interaction.dispositionDetails.dispositions.map((disposition) => {
                              if (disposition.type === 'category') {
                                return this.renderCategory(disposition);
                              }
                              return this.renderDisposition(disposition);
                            })
                          }
                        </div>
                        <div style={this.styles.triangle}></div>
                      </div>
                      : undefined,
                  ]
                  : undefined
                }
              </div>
            }
            <textarea
              id="notesTextarea"
              placeholder={formatMessage(messages.notesPlaceholder)}
              value={this.state.body}
              onChange={(e) => this.handleChange({ body: e.target.value })}
              style={this.styles.notesTextarea}
            />
          </div>
        </Resizable>
      </div>
    );
  }
}

ContentArea.propTypes = {
  intl: intlShape.isRequired,
  updateNote: PropTypes.func.isRequired,
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node.isRequired,
  buttons: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    updateNote: (interactionId, note) => dispatch(updateNote(interactionId, note)),
    dispatch,
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(ContentArea)));
