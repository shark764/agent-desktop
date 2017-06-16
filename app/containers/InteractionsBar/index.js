/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InteractionsBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import { selectIsAgentReady } from 'containers/AgentDesktop/selectors';
import { openNewInteractionPanel } from 'containers/AgentDesktop/actions';

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

import Icon from 'components/Icon';
import Interaction from 'containers/Interaction';

import { selectPendingInteractions, selectActiveVoiceInteraction, selectActiveNonVoiceInteractions, getSelectedInteractionId, selectNewInteractionPanel } from './selectors';
import messages from './messages';

export class InteractionsBar extends BaseComponent {
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

  acceptInteraction = (interactionId) => {
    const interaction = this.props.pendingInteractions.find((item) => item.interactionId === interactionId);
    const disallow = (this.props.activeExtension.type === 'pstn' && interaction.channelType === 'voice');
    if (!disallow) {
      this.props.acceptInteraction(interactionId);
    }
  }

  render() {
    let activeVoiceInteractionStatus;
    if (this.props.activeVoiceInteraction) {
      if (this.props.activeVoiceInteraction.status === 'wrapup') {
        activeVoiceInteractionStatus = 'wrapup';
      } else if (this.props.activeVoiceInteraction.status === 'work-ended-pending-script') {
        activeVoiceInteractionStatus = 'work-ended-pending-script';
      } else {
        activeVoiceInteractionStatus = 'active';
      }
    }

    const activeVoiceInteraction = this.props.activeVoiceInteraction
      ? (<Interaction
        interactionId={this.props.activeVoiceInteraction.interactionId}
        key={this.props.activeVoiceInteraction.interactionId}
        icon="voice"
        channelType={this.props.activeVoiceInteraction.channelType}
        from={this.props.activeVoiceInteraction.contact !== undefined ? this.props.activeVoiceInteraction.contact.attributes.name : this.props.activeVoiceInteraction.number}
        previewText={this.props.activeVoiceInteraction.contact !== undefined ? this.props.activeVoiceInteraction.number : undefined}
        status={activeVoiceInteractionStatus}
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
      let type;
      if (activeInteraction.channelType === 'messaging' || activeInteraction.channelType === 'sms') {
        from = activeInteraction.customer
          ? activeInteraction.customer
          : activeInteraction.messageHistory && activeInteraction.messageHistory[0] && activeInteraction.messageHistory[0].from;

        // use the last non-system message
        if (activeInteraction.messageHistory) {
          for (let i = activeInteraction.messageHistory.length - 1; i >= 0; i -= 1) {
            if (activeInteraction.messageHistory[i].type !== 'system') {
              text = activeInteraction.messageHistory[i].text;
              type = activeInteraction.messageHistory[i].type;
              break;
            }
          }
        }
        // if the last message was from the customer, show the 'new' icon
        if (type === 'customer' || type === 'message') {
          icon = 'message_new';
        } else {
          icon = 'message';
        }
      } else if (activeInteraction.channelType === 'email') {
        from = activeInteraction.emailDetails ? activeInteraction.emailDetails.from[0].name : activeInteraction.customer;
        text = activeInteraction.emailDetails ? activeInteraction.emailDetails.subject : '';
        icon = 'email';
      }

      // Set from to the contact name if available
      if (activeInteraction.contact !== undefined && activeInteraction.contact.attributes !== undefined) {
        from = activeInteraction.contact.attributes.name;
      }

      let status;
      if (activeInteraction.status === 'wrapup') {
        status = 'wrapup';
      } else if (activeInteraction.status === 'work-ended-pending-script') {
        status = 'work-ended-pending-script';
      } else {
        status = 'active';
      }

      return (
        <Interaction
          {...{ from, icon }}
          interactionId={activeInteraction.interactionId}
          key={activeInteraction.interactionId ? activeInteraction.interactionId : activeInteraction.customer}
          channelType={activeInteraction.channelType}
          previewText={text}
          status={status}
          targetWrapupTime={Number(activeInteraction.wrapupDetails.targetWrapupTime)}
          wrapupTime={Number(activeInteraction.wrapupDetails.wrapupTime)}
          selected={this.props.selectedInteractionId === activeInteraction.interactionId}
          onClick={this.props.selectedInteractionId !== activeInteraction.interactionId ? () => this.props.selectInteraction(activeInteraction.interactionId) : undefined}
        />
      );
    });

    const newInteraction = this.props.newInteractionPanel.visible
      && (<Interaction
        interactionId={this.props.newInteractionPanel.interactionId}
        status={this.props.newInteractionPanel.status}
        selected={this.props.selectedInteractionId === this.props.newInteractionPanel.interactionId}
        onClick={this.props.selectedInteractionId !== this.props.newInteractionPanel.interactionId ? () => this.props.selectInteraction(this.props.newInteractionPanel.interactionId) : undefined}
      />);

    const pendingInteractions = this.props.pendingInteractions.map((pendingInteraction) => {
      let icon;
      let from;
      let text;
      if (pendingInteraction.channelType === 'messaging' || pendingInteraction.channelType === 'sms') {
        from = pendingInteraction.messageHistory && pendingInteraction.messageHistory.length > 0 ? pendingInteraction.messageHistory[0].from : '';
        text = pendingInteraction.messageHistory && pendingInteraction.messageHistory.length > 0 ? pendingInteraction.messageHistory[0].text : '';
        icon = 'message_new';
      } else if (pendingInteraction.channelType === 'email') {
        from = pendingInteraction.customer;
        icon = 'email_new';
      } else if (pendingInteraction.channelType === 'voice') {
        from = pendingInteraction.number;
        icon = 'voice';
      }
      // Set from to the contact name if available
      if (pendingInteraction.contact !== undefined && pendingInteraction.contact.attributes !== undefined) {
        from = pendingInteraction.contact.attributes.name;
      }

      return (
        <Interaction
          {...{ icon, from }}
          interactionId={pendingInteraction.interactionId}
          key={pendingInteraction.interactionId}
          channelType={pendingInteraction.channelType}
          previewText={text}
          status="pending"
          timeout={pendingInteraction.timeout}
          onClick={() => this.acceptInteraction(pendingInteraction.interactionId)}
          interactionDirection={pendingInteraction.direction}
          isCanceled={pendingInteraction.isCancellingInteraction}
        />
      );
    });

    return (
      <div style={[this.styles.base, this.props.style]}>
        <div style={{ position: 'absolute', top: 0, width: '100%', color: '#FFFFFF', height: 'calc(100% - 47px)', overflowY: 'auto' }}>
          {activeVoiceInteraction}
          {activeNonVoiceInteractions}
          {newInteraction}
        </div>
        <div style={{ position: 'absolute', bottom: 47, width: '100%', padding: '11px' }}>
          {pendingInteractions}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '11px' }}>
          {
            this.props.isAgentReady && !this.props.newInteractionPanel.visible &&
            <Icon
              id="newInteraction"
              name="add_interaction"
              alt={this.props.intl.formatMessage(messages.newInteraction)}
              onclick={this.props.openNewInteractionPanel}
              style={{ display: 'block', margin: '0 auto' }}
            />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  isAgentReady: selectIsAgentReady(state, props),
  pendingInteractions: selectPendingInteractions(state, props),
  activeVoiceInteraction: selectActiveVoiceInteraction(state, props),
  activeNonVoiceInteractions: selectActiveNonVoiceInteractions(state, props),
  selectedInteractionId: getSelectedInteractionId(state, props),
  newInteractionPanel: selectNewInteractionPanel(state, props),
  activeExtension: selectActiveExtension(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    openNewInteractionPanel: () => dispatch(openNewInteractionPanel()),
    dispatch,
  };
}

InteractionsBar.propTypes = {
  intl: intlShape.isRequired,
  style: PropTypes.array,
  isAgentReady: PropTypes.bool.isRequired,
  pendingInteractions: PropTypes.array.isRequired,
  activeNonVoiceInteractions: PropTypes.array.isRequired,
  activeVoiceInteraction: PropTypes.object,
  selectInteraction: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  acceptInteraction: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(InteractionsBar)));
