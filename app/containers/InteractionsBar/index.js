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

  acceptInteraction(interactionId) {
    SDK.Agent.Session.Messaging.workNotificationHandler({ interactionId }, 'work-initiated');
  }

  render() {
    const activeInteractions = this.props.activeInteractions.map((activeInteraction) => {
      let icon;
      let from;
      let text;
      if (activeInteraction.channelType === 'messaging' || activeInteraction.channelType === 'sms') {
        from = activeInteraction.messageHistory ? activeInteraction.messageHistory[0].from : '';
        text = activeInteraction.messageHistory ? activeInteraction.messageHistory[0].text : '';
        if (activeInteraction.hasUnreadMessage) {
          icon = 'message_new';
        } else {
          icon = 'message';
        }
      } else if (activeInteraction.channelType === 'email') {
        from = activeInteraction.email.from;
        text = activeInteraction.email.content;
        icon = 'email';
      }
      return (
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
            name={icon}
            style={{ float: 'left', width: '18px', height: '15px' }}
          />
          <div style={{ float: 'left', marginLeft: '14px', width: '211px' }}>
            <div style={{ float: 'right' }}>
              <TimerMinutes />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px', width: 'calc(100% - 57px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {from}
            </div>
            <style>
              {'.previewText br {display: none;}'}
            </style>
            <div className="previewText" style={{ height: '36px', lineHeight: '18px', marginTop: '5px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></div>
          </div>
        </div>
      );
    });

    const pendingInteractions = this.props.pendingInteractions.map((pendingInteraction) => {
      let icon;
      let from;
      let text;
      if (pendingInteraction.channelType === 'messaging' || pendingInteraction.channelType === 'sms') {
        from = pendingInteraction.messageHistory ? pendingInteraction.messageHistory[0].from : '';
        text = pendingInteraction.messageHistory ? pendingInteraction.messageHistory[0].text : '';
        icon = 'message_new';
      } else if (pendingInteraction.channelType === 'email') {
        from = pendingInteraction.email.from;
        text = pendingInteraction.email.content;
        icon = 'email_new';
      }
      return (
        <div
          style={{ backgroundColor: '#F3F3F3', cursor: 'pointer', padding: '20px 16px', borderRadius: '3px', height: '123px', width: '100%' }}
          key={pendingInteraction.interactionId}
          onClick={() => this.acceptInteraction(pendingInteraction.interactionId, pendingInteraction.channelType)}
        >
          <Icon name={icon} style={{ float: 'left', width: '20px', height: '16px' }} />
          <div style={{ float: 'left', marginLeft: '10px', width: '185px' }}>
            <div style={{ float: 'right', color: '#23CEF5' }}>
              <Countdown countdownUntil={new Date(pendingInteraction.timeout)} />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px', width: 'calc(100% - 27px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {from}
            </div>
            <style>
              {'.previewText br {display: none;}'}
            </style>
            <div className="previewText" style={{ height: '36px', lineHeight: '18px', marginTop: '5px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: text }}></div>
            <div style={{ color: '#979797', fontSize: '12px', marginTop: '11px' }}>
              <FormattedMessage {...messages.accept} />
            </div>
          </div>
        </div>
      );
    });

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
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
