/*
 *
 * InteractionsBar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import Interaction from 'components/Interaction';

import { selectPendingInteractions, selectActiveVoiceInteraction, selectActiveNonVoiceInteractions, getSelectedInteractionId } from './selectors';

export class InteractionsBar extends React.Component {
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
    this.props.acceptInteraction(interactionId);
  }

  render() {
    const activeVoiceInteraction = this.props.activeVoiceInteraction
      ? (<Interaction
        interactionId={this.props.activeVoiceInteraction.interactionId}
        key={this.props.activeVoiceInteraction.interactionId}
        icon="voice"
        channelType={this.props.activeVoiceInteraction.channelType}
        from={this.props.activeVoiceInteraction.contact !== undefined ? this.props.activeVoiceInteraction.contact.attributes.name : this.props.activeVoiceInteraction.number}
        previewText={this.props.activeVoiceInteraction.contact !== undefined ? this.props.activeVoiceInteraction.number : undefined}
        status={this.props.activeVoiceInteraction.status === 'wrapup' ? 'wrapup' : 'active'}
        targetWrapupTime={Number(this.props.activeVoiceInteraction.wrapupDetails.targetWrapupTime)}
        wrapupTime={Number(this.props.activeVoiceInteraction.wrapupDetails.wrapupTime)}
        selected={this.props.selectedInteractionId === this.props.activeVoiceInteraction.interactionId}
        onClick={this.props.selectedInteractionId !== this.props.activeVoiceInteraction.interactionId ? () => this.props.selectInteraction(this.props.activeVoiceInteraction.interactionId) : undefined}
      />)
      : '';

    const activeNonVoiceInteractions = this.props.activeNonVoiceInteractions.map((activeInteraction) => {
      let icon;
      let from;
      let text;
      if (activeInteraction.channelType === 'messaging' || activeInteraction.channelType === 'sms') {
        from = activeInteraction.messageHistory[0].from;

        // Try to find the first unread customer message
        const firstUnreadCustomerMessage = activeInteraction.messageHistory.find((messageHistoryItem) => messageHistoryItem.unread === true && (messageHistoryItem.type === 'customer' || messageHistoryItem.type === 'message'));
        if (firstUnreadCustomerMessage !== undefined) {
          text = firstUnreadCustomerMessage.text;
          icon = 'message_new';
        } else {
          // If there are no unread customer messages, use the last non-system message
          for (let i = activeInteraction.messageHistory.length - 1; i >= 0; i -= 1) {
            if (activeInteraction.messageHistory[i].type !== 'system') {
              text = activeInteraction.messageHistory[i].text;
              break;
            }
          }
          icon = 'message';
        }
      } else if (activeInteraction.channelType === 'email') {
        from = activeInteraction.emailDetails ? activeInteraction.emailDetails.from[0].name : activeInteraction.customer;
        text = activeInteraction.emailDetails ? activeInteraction.emailDetails.subject : '';
        icon = 'email';
      }

      // Set from to the contact name if available
      if (activeInteraction.contact !== undefined) {
        from = activeInteraction.contact.attributes.name;
      }

      return (
        <Interaction
          interactionId={activeInteraction.interactionId}
          key={activeInteraction.interactionId}
          icon={icon}
          channelType={activeInteraction.channelType}
          from={from}
          previewText={text}
          status={activeInteraction.status === 'wrapup' ? 'wrapup' : 'active'}
          targetWrapupTime={Number(activeInteraction.wrapupDetails.targetWrapupTime)}
          wrapupTime={Number(activeInteraction.wrapupDetails.wrapupTime)}
          selected={this.props.selectedInteractionId === activeInteraction.interactionId}
          onClick={this.props.selectedInteractionId !== activeInteraction.interactionId ? () => this.props.selectInteraction(activeInteraction.interactionId) : undefined}
        />
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
        from = pendingInteraction.customer;
        icon = 'email_new';
      } else if (pendingInteraction.channelType === 'voice') {
        from = pendingInteraction.number;
        icon = 'voice';
      }
      // Set from to the contact name if available
      if (pendingInteraction.contact !== undefined) {
        from = pendingInteraction.contact.attributes.name;
      }
      return (
        <Interaction
          interactionId={pendingInteraction.interactionId}
          key={pendingInteraction.interactionId}
          icon={icon}
          channelType={pendingInteraction.channelType}
          from={from}
          previewText={text}
          status="pending"
          timeout={pendingInteraction.timeout}
          onClick={() => this.acceptInteraction(pendingInteraction.interactionId)}
        />
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
