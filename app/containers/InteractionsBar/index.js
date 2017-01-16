/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import messages from './messages';
import { selectPendingInteractions, selectActiveVoiceInteraction, selectActiveNonVoiceInteractions, getSelectedInteractionId } from './selectors';

import Countdown from 'components/Countdown';
import Icon from 'components/Icon';
import Timer from 'components/Timer';
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
      boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.3)',
    },
  };

  acceptInteraction(interactionId) {
    const autoSelect = (this.props.selectedInteractionId === undefined);
    this.props.acceptInteraction(interactionId, autoSelect);
  }

  render() {
    const activeVoiceInteraction = this.props.activeVoiceInteraction
      ? <div
        style={{ backgroundColor: this.props.selectedInteractionId === this.props.activeVoiceInteraction.interactionId ? '#0B424E' : 'inherit',
          borderBottom: '1px solid #141414',
          cursor: 'pointer',
          padding: '30px 16px 20px',
          height: '100px',
          width: '100%' }}
        onClick={() => this.props.selectInteraction(this.props.activeVoiceInteraction.interactionId)}
      >
        <Icon
          name="voice"
          style={{ float: 'left' }}
        />
        <div style={{ float: 'left', marginLeft: '14px', width: '211px' }}>
          <div style={{ float: 'right' }}>
            <Timer format="mm:ss" />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px', width: 'calc(100% - 57px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {this.props.activeVoiceInteraction.number}
          </div>
          <div className="previewText" style={{ height: '36px', lineHeight: '18px', marginTop: '5px', overflow: 'hidden' }}>
          </div>
        </div>
      </div>
      : '';

    const activeNonVoiceInteractions = this.props.activeNonVoiceInteractions.map((activeInteraction) => {
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
      } else if (pendingInteraction.channelType === 'voice') {
        from = pendingInteraction.number;
        icon = 'voice';
      }
      return (
        <div
          style={{ backgroundColor: '#F3F3F3', cursor: 'pointer', marginTop: '11px', padding: '20px 16px', borderRadius: '3px', height: '123px', width: '100%' }}
          key={pendingInteraction.interactionId}
          onClick={() => this.acceptInteraction(pendingInteraction.interactionId)}
        >
          <Icon name={icon} style={{ float: 'left', width: icon === 'message_new' ? '20px' : '', height: icon === 'message_new' ? '16px' : '' }} />
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
          {activeVoiceInteraction}
          {activeNonVoiceInteractions}
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
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
  activeNonVoiceInteractions: selectActiveNonVoiceInteractions(state, props),
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
  activeNonVoiceInteractions: PropTypes.array.isRequired,
  activeVoiceInteraction: PropTypes.object,
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  acceptInteraction: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar));
