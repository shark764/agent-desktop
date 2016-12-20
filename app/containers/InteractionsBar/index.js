/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPendingNonVoiceInteractions, selectActiveNonVoiceInteractions } from './selectors';
import Radium from 'radium';

import messages from './messages';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';

export class InteractionsBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      backgroundColor: '#072931',
      color: '#4B4B4B',
      position: 'relative',
      width: '100%',
      fontSize: '14px',
      lineHeight: '14px',
    },
  };

  render() {
    // TODO different styling for accepted ones
    const activeNonVoiceInteractions = this.props.activeNonVoiceInteractions.map((pendingNonVoiceInteraction) =>
      <div style={{ backgroundColor: '#F3F3F3', padding: '20px 16px', borderRadius: '3px', height: '123px', width: '100%' }} key={pendingNonVoiceInteraction.interactionId} onClick={() => this.props.acceptInteraction(pendingNonVoiceInteraction.interactionId)}>
        <Icon name="chat" style={{ float: 'left', width: '20px', height: '16px' }} />
        <div style={{ float: 'left', marginLeft: '5px', width: '190px' }}>
          <div style={{ float: 'right', color: '#23CEF5' }}>
            0:00
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px' }}>
            {pendingNonVoiceInteraction.messageHistory[0].metadata.name}
          </div>
          <div style={{ height: '36px', lineHeight: '18px', marginTop: '5px' }}>
            {pendingNonVoiceInteraction.messageHistory[0].body.text}
          </div>
          <div style={{ color: '#979797', fontSize: '12px', marginTop: '11px' }}>
            <FormattedMessage {...messages.accept} />
          </div>
        </div>
      </div>
    );

    // TODO components for this
    const pendingNonVoiceInteractions = this.props.pendingNonVoiceInteractions.map((pendingNonVoiceInteraction) =>
      <div style={{ backgroundColor: '#F3F3F3', padding: '20px 16px', borderRadius: '3px', height: '123px', width: '100%' }} key={pendingNonVoiceInteraction.interactionId} onClick={() => this.props.acceptInteraction(pendingNonVoiceInteraction.interactionId)}>
        <Icon name="message_new" style={{ float: 'left', width: '20px', height: '16px' }} />
        <div style={{ float: 'left', marginLeft: '5px', width: '190px' }}>
          <div style={{ float: 'right', color: '#23CEF5' }}>
            0:00
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px' }}>
            {pendingNonVoiceInteraction.messageHistory[0].metadata.name}
          </div>
          <div style={{ height: '36px', lineHeight: '18px', marginTop: '5px' }}>
            {pendingNonVoiceInteraction.messageHistory[0].body.text}
          </div>
          <div style={{ color: '#979797', fontSize: '12px', marginTop: '11px' }}>
            <FormattedMessage {...messages.accept} />
          </div>
        </div>
      </div>
    );
    return (
      <div style={[this.styles.base, this.props.style]}>
        <div>{ /* active voice interaction here */ }</div>
        <div>
          {activeNonVoiceInteractions}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '11px' }}>
          {pendingNonVoiceInteractions}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  pendingNonVoiceInteractions: selectPendingNonVoiceInteractions()(state, props),
  activeNonVoiceInteractions: selectActiveNonVoiceInteractions()(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

InteractionsBar.propTypes = {
  style: PropTypes.array,
  pendingNonVoiceInteractions: PropTypes.array.isRequired,
  activeNonVoiceInteractions: PropTypes.array.isRequired,
  acceptInteraction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
