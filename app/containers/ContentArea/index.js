/*
 *
 * ContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Toggle from 'react-toggle';

import { updateNote } from 'containers/AgentDesktop/actions';

import messages from './messages';

export class ContentArea extends React.Component {
  constructor(props) {
    super(props);
    this.setNotesPanelHeight = this.setNotesPanelHeight.bind(this);
    this.toggleWrapup = this.toggleWrapup.bind(this);
    this.state = {
      notesPanelHeight: this.props.interaction.note !== undefined ? this.props.interaction.note.notesPanelHeight : 300,
      noteTitle: this.props.interaction.note !== undefined ? this.props.interaction.note.title : '',
      noteContent: this.props.interaction.note !== undefined ? this.props.interaction.note.content : '',
      selectedDispositions: this.props.interaction.note !== undefined ? this.props.interaction.note.selectedDispositions : [],

      /* TODO when dispositions are available from the SDK
      showDispositionsList: false,
      dispositions: [
        { id: '0', name: 'Issue Resolved' },
        { id: '1', name: 'Upgrade' },
        { id: '2', name: 'Downgrade' },
        { id: '3', name: 'Cancel' },
        // { id: '4', name: 'Disposition with long long long long long long name' },
        // { id: '5', name: 'Disposition 5' },
        // { id: '6', name: 'Disposition 6' },
        // { id: '7', name: 'Disposition 7' },
        // { id: '8', name: 'Disposition 8' },
        // { id: '9', name: 'Disposition 9' },
        // { id: '10', name: 'Disposition 10' },
        // { id: '11', name: 'Disposition 11' },
        // { id: '12', name: 'Disposition 12' },
        // { id: '13', name: 'Disposition 13' },
        // { id: '14', name: 'Disposition 14' },
        // { id: '15', name: 'Disposition 15' },
        // { id: '16', name: 'Disposition 16' },
        // { id: '17', name: 'Disposition 17' },
        // { id: '18', name: 'Disposition 18' },
        // { id: '19', name: 'Disposition 19' },
        // { id: '20', name: 'Disposition 20' },
        // { id: '21', name: 'Disposition 21' },
        // { id: '22', name: 'Disposition 22' },
        // { id: '23', name: 'Disposition 23' },
        // { id: '24', name: 'Disposition 24' },
        // { id: '25', name: 'Disposition 25' },
        // { id: '26', name: 'Disposition 26' },
        // { id: '27', name: 'Disposition 27' },
        // { id: '28', name: 'Disposition 28' },
        // { id: '29', name: 'Disposition 29' },
      ],
      */
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interaction.interactionId !== nextProps.interaction.interactionId) {
      this.props.updateNote(this.props.interaction.interactionId, { title: this.state.noteTitle, content: this.state.noteContent, notesPanelHeight: this.state.notesPanelHeight, selectedDispositions: this.state.selectedDispositions });
      this.setState({
        showDispositionsList: false,
        notesPanelHeight: nextProps.interaction.note !== undefined ? nextProps.interaction.note.notesPanelHeight : 300,
        noteTitle: nextProps.interaction.note !== undefined ? nextProps.interaction.note.title : '',
        noteContent: nextProps.interaction.note !== undefined ? nextProps.interaction.note.content : '',
        selectedDispositions: nextProps.interaction.note !== undefined ? nextProps.interaction.note.selectedDispositions : [],
      });
    }
  }

  componentWillUnmount() {
    this.props.updateNote(this.props.interaction.interactionId, { title: this.state.noteTitle, content: this.state.noteContent, notesPanelHeight: this.state.notesPanelHeight, selectedDispositions: this.state.selectedDispositions });
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
      flex: '0 1 auto',
      padding: '12px 24px',
      fontSize: '15px',
    },
    notesTitleInput: {
      marginLeft: '6px',
      border: 'none',
      ':focus': {
        outline: 'none',
      },
    },
    dispositionsContainer: {
      padding: '0 0 15px 20px',
    },
    dispositionNewLabelContainer: {
      display: 'inline-block',
      position: 'relative',
    },
    disposition: {
      display: 'inline-block',
      backgroundColor: '#F3F3F3',
      borderRadius: '2px',
      fontSize: '12px',
      padding: '2px 7px',
      margin: '4px 10px 0 0',
      verticalAlign: 'top',
      border: '1px solid transparent',
    },
    dispositionNewLabel: {
      fontWeight: 600,
      cursor: 'pointer',
    },
    dispositionNewLabelSelected: {
      border: '1px solid #979797',
    },
    dispositionNewLabelPlus: {
      fontSize: '20px',
      lineHeight: '22px',
      marginRight: '10px',
    },
    dispositionLabelText: {
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: '2px',
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
      bottom: '38px',
      left: '-68px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.14)',
      borderRadius: '3px',
      fontSize: '16px',
      padding: '12px 0 8px 24px',
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
      bottom: '31px',
      left: '44px',
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
  };

  setNotesPanelHeight(newWidth) {
    this.setState({
      notesPanelHeight: newWidth,
    });
  }

  toggleWrapup() {
    if (this.props.interaction.wrapupDetails.wrapupEnabled) {
      SDK.interactions.disableWrapup({ interactionId: this.props.interaction.interactionId });
    } else {
      SDK.interactions.enableWrapup({ interactionId: this.props.interaction.interactionId });
    }
  }

  render() {
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
                        disabled={!this.props.interaction.wrapupDetails.wrapupUpdateAllowed}
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
        { /* TODO when notes / dispositions are available from the SDK
        <Resizable id="notes-resizable" direction="top" setPx={this.setNotesPanelHeight} disabledPx={50} px={this.state.notesPanelHeight} maxPx={600} minPx={125} isDisabled={false} >
          <div style={this.styles.notesArea}>
            <div style={this.styles.notesTitleContainer}>
              <FormattedMessage {...messages.notes} />
              <input
                id="notesTitleInput"
                placeholder={formatMessage(messages.notesTitlePlaceholder)}
                value={this.state.noteTitle}
                onChange={(e) => this.setState({ noteTitle: e.target.value })}
                style={this.styles.notesTitleInput}
              />
            </div>
            <div style={this.styles.dispositionsContainer}>
              {
                this.state.selectedDispositions.map((dispositionId) => {
                  const disposition = this.state.dispositions.find((dispositionListItem) => dispositionListItem.id === dispositionId);
                  return (
                    <div key={dispositionId} title={disposition.name} style={[this.styles.disposition]} >
                      <span style={this.styles.dispositionLabelText}>
                        { disposition.name !== undefined ? disposition.name.toUpperCase() : '' }
                      </span>
                      <span onClick={() => this.setState({ selectedDispositions: [] })} style={this.styles.dispositionRemove}>
                        &#10060;
                      </span>
                    </div>
                  );
                })
              }
              {
                this.state.selectedDispositions.length === 0
                ? <div style={this.styles.dispositionNewLabelContainer}>
                  <div
                    onClick={() => this.setState({ showDispositionsList: !this.state.showDispositionsList })}
                    style={[this.styles.disposition, this.styles.dispositionNewLabel, this.state.showDispositionsList ? this.styles.dispositionNewLabelSelected : undefined]}
                  >
                    <span style={this.styles.dispositionNewLabelPlus}>&#10133;</span>
                    <span style={this.styles.dispositionLabelText}>New Label</span>
                  </div>
                  {
                    this.state.showDispositionsList
                    ? <div>
                      <div style={this.styles.dispositionList}>
                        {
                          this.state.dispositions.map((disposition) =>
                            <div key={disposition.id} title={disposition.name} style={this.styles.selectableDisposition}>
                              <CheckBox
                                id={`${disposition.id}-checkbox`}
                                text={disposition.name}
                                checked={this.state.selectedDispositions.includes(disposition.id)}
                                cb={() => {
                                  this.setState({ selectedDispositions: [disposition.id], showDispositionsList: false });
                                }}
                                style={{ width: '100%' }}
                              />
                            </div>
                          )
                        }
                      </div>
                      <div style={this.styles.triangle}></div>
                    </div>
                    : undefined
                  }
                </div>
                : undefined
              }
            </div>
            <textarea
              id="notesTextarea"
              placeholder={formatMessage(messages.notesPlaceholder)}
              value={this.state.noteContent}
              onChange={(e) => this.setState({ noteContent: e.target.value })}
              style={this.styles.notesTextarea}
            />
          </div>
        </Resizable>
        */ }
      </div>
    );
  }
}

ContentArea.propTypes = {
  updateNote: PropTypes.func.isRequired,
  interaction: PropTypes.object.isRequired,
  from: PropTypes.node.isRequired,
  buttons: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateNote: (interactionId, note) => dispatch(updateNote(interactionId, note)),
    dispatch,
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(Radium(ContentArea)));
