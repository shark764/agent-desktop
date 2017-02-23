/*
 *
 * ContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Resizable from 'components/Resizable';

import { updateNote } from 'containers/AgentDesktop/actions';

import messages from './messages';

export class ContentArea extends React.Component {
  constructor(props) {
    super(props);
    this.setNotesPanelHeight = this.setNotesPanelHeight.bind(this);
    this.state = {
      notesPanelHeight: this.props.interaction.note !== undefined ? this.props.interaction.note.notesPanelHeight : 300,
      noteTitle: this.props.interaction.note !== undefined ? this.props.interaction.note.title : '',
      noteContent: this.props.interaction.note !== undefined ? this.props.interaction.note.content : '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interaction.interactionId !== nextProps.interaction.interactionId) {
      this.props.updateNote(this.props.interaction.interactionId, { title: this.state.noteTitle, content: this.state.noteContent, notesPanelHeight: this.state.notesPanelHeight });
      this.setState({
        notesPanelHeight: nextProps.interaction.note !== undefined ? nextProps.interaction.note.notesPanelHeight : 300,
        noteTitle: nextProps.interaction.note !== undefined ? nextProps.interaction.note.title : '',
        noteContent: nextProps.interaction.note !== undefined ? nextProps.interaction.note.content : '',
      });
    }
  }

  componentWillUnmount() {
    this.props.updateNote(this.props.interaction.interactionId, { title: this.state.noteTitle, content: this.state.noteContent, notesPanelHeight: this.state.notesPanelHeight });
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
    },
    from: {
      width: 'calc(100% - 160px)',
      display: 'inline-block',
      fontSize: '20px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    buttons: {
      float: 'right',
    },
    details: {
      fontSize: '12px',
      padding: '10px',
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
      overflowY: 'hidden',
    },
    notesTitleContainer: {
      flex: '0 1 auto',
      padding: '12px 20px',
      fontSize: '15px',
    },
    notesTitleInput: {
      marginLeft: '6px',
      ':focus': {
        outline: 'none',
      },
    },
    notesTextarea: {
      flex: '1 1 36px',
      width: '100%',
      resize: 'none',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E4E4E4',
      padding: '20px',
    },
  };

  setNotesPanelHeight(newWidth) {
    this.setState({
      notesPanelHeight: newWidth,
    });
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
                <div style={this.styles.buttons}>
                  {this.props.buttons}
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
        <Resizable id="notes-resizable" direction="top" setPx={this.setNotesPanelHeight} disabledPx={50} px={this.state.notesPanelHeight} maxPx={600} minPx={50} isDisabled={false} >
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
            <textarea
              id="notesTextarea"
              placeholder={formatMessage(messages.notesPlaceholder)}
              value={this.state.noteContent}
              onChange={(e) => this.setState({ noteContent: e.target.value })}
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
};

function mapDispatchToProps(dispatch) {
  return {
    updateNote: (interactionId, note) => dispatch(updateNote(interactionId, note)),
    dispatch,
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(Radium(ContentArea)));
