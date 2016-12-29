/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPendingInteractions, selectActiveInteractions, getSelectedInteractionId } from './selectors';
import Radium from 'radium';

import messages from './messages';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import Countdown from 'components/Countdown';
import TimerMinutes from 'components/TimerMinutes';

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
    const activeInteractions = this.props.activeInteractions.map((activeInteraction) =>
      <div
        style={{ backgroundColor: this.props.selectedInteractionId === activeInteraction.interactionId ? '#0B424E' : 'inherit',
          borderBottom: '1px solid #141414',
          cursor: 'pointer',
          padding: '20px 16px',
          borderRadius: '3px',
          height: '100px',
          width: '100%' }}
        key={activeInteraction.interactionId}
        onClick={() => this.props.selectInteraction(activeInteraction.interactionId)}
      >
        <Icon
          name={activeInteraction.hasUnreadMessage ? 'message_new' : 'message'}
          style={{ float: 'left', width: '18px', height: '18px' }}
        />
        <div style={{ float: 'left', marginLeft: '14px', width: '211px' }}>
          <div style={{ float: 'right' }}>
            <TimerMinutes />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px' }}>
            {activeInteraction.messageHistory[0].from}
          </div>
          <div style={{ height: '36px', lineHeight: '18px', marginTop: '5px' }}>
            {activeInteraction.messageHistory[0].text}
          </div>
        </div>
      </div>
    );

    const pendingInteractions = this.props.pendingInteractions.map((pendingInteraction) =>
      <div
        style={{ backgroundColor: '#F3F3F3', cursor: 'pointer', padding: '20px 16px', borderRadius: '3px', height: '123px', width: '100%' }}
        key={pendingInteraction.interactionId}
        onClick={() => this.props.acceptInteraction(pendingInteraction.interactionId)}
      >
        <Icon name="message_new" style={{ float: 'left', width: '20px', height: '16px' }} />
        <div style={{ float: 'left', marginLeft: '5px', width: '190px' }}>
          <div style={{ float: 'right', color: '#23CEF5' }}>
            <Countdown countdownUntil={new Date(pendingInteraction.timeout)} />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px' }}>
            {pendingInteraction.messageHistory[0].from}
          </div>
          <div style={{ height: '36px', lineHeight: '18px', marginTop: '5px' }}>
            {pendingInteraction.messageHistory[0].text}
          </div>
          <div style={{ color: '#979797', fontSize: '12px', marginTop: '11px' }}>
            <FormattedMessage {...messages.accept} />
          </div>
        </div>
      </div>
    );

    return (
      <div style={[this.styles.base, this.props.style]}>
        <div style={{ position: 'absolute', top: 0, width: '100%', color: '#FFFFFF' }}>
          {activeInteractions}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '11px' }}>
          {pendingInteractions}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  pendingInteractions: selectPendingInteractions(state, props),
  activeInteractions: selectActiveInteractions(state, props),
  selectedInteractionId: getSelectedInteractionId(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

InteractionsBar.propTypes = {
  style: PropTypes.array,
  pendingInteractions: PropTypes.array.isRequired,
  activeInteractions: PropTypes.array.isRequired,
  acceptInteraction: PropTypes.func.isRequired,
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
