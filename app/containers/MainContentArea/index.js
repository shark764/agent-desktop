/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * MainContentArea
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import NewInteractionContentArea from 'containers/NewInteractionContentArea';
import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';
import VoiceContentArea from 'containers/VoiceContentArea';
import WelcomeStats from 'containers/WelcomeStats';

import { removeInteraction } from 'containers/AgentDesktop/actions';
import { selectSelectedInteraction } from 'containers/AgentDesktop/selectors';

import { selectMessageTemplates } from './selectors';

const styles = {
  base: {
    backgroundColor: '#072931',
    color: '#4B4B4B',
  },
};

class MainContentArea extends BaseComponent {
  endInteraction = () => {
    if (this.props.selectedInteraction.status === 'wrapup') {
      CxEngage.interactions.endWrapup({
        interactionId: this.props.selectedInteraction.interactionId,
      });
    } else if (
      this.props.selectedInteraction.status === 'connecting-to-outbound' ||
      this.props.selectedInteraction.status === 'initializing-outbound' ||
      this.props.selectedInteraction.status === 'initialized-outbound'
    ) {
      this.props.removeInteraction(
        this.props.selectedInteraction.interactionId
      );
    } else {
      CxEngage.interactions.end({
        interactionId: this.props.selectedInteraction.interactionId,
      });
    }
  };

  render() {
    const selectedInteraction = this.props.selectedInteraction;

    let content = null;
    if (selectedInteraction) {
      if (selectedInteraction.status === 'creating-new-interaction') {
        content = <NewInteractionContentArea />;
      } else if (
        selectedInteraction.channelType === 'messaging' ||
        selectedInteraction.channelType === 'sms'
      ) {
        const messageTemplates = this.props.messageTemplates.filter(
          (messageTemplate) =>
            messageTemplate.channels.includes(selectedInteraction.channelType)
        );
        content = (
          <MessagingContentArea
            selectedInteraction={selectedInteraction}
            endInteraction={this.endInteraction}
            messageTemplates={messageTemplates}
          />
        );
      } else if (selectedInteraction.channelType === 'email') {
        const emailTemplates = this.props.messageTemplates.filter(
          (messageTemplate) =>
            messageTemplate.channels.includes(selectedInteraction.channelType)
        );
        content = (
          <EmailContentArea
            selectedInteraction={selectedInteraction}
            endInteraction={this.endInteraction}
            emailTemplates={emailTemplates}
          />
        );
      } else if (selectedInteraction.channelType === 'voice') {
        content = (
          <VoiceContentArea
            selectedInteraction={selectedInteraction}
            endInteraction={this.endInteraction}
          />
        );
      } else {
        throw new Error(
          `Unknown selected channelType: ${selectedInteraction.channelType}`
        );
      }
    }

    return (
      <div style={[styles.base, this.props.style]}>
        {content !== null
          ? content
          : <WelcomeStats
            agent={this.props.agent}
            tenant={this.props.tenant}
          />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: selectSelectedInteraction(state, props),
  messageTemplates: selectMessageTemplates(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    removeInteraction: (interactionId) =>
      dispatch(removeInteraction(interactionId)),
    dispatch,
  };
}

MainContentArea.propTypes = {
  selectedInteraction: PropTypes.object,
  messageTemplates: PropTypes.array,
  removeInteraction: PropTypes.func.isRequired,
  style: PropTypes.array,
  agent: PropTypes.object.isRequired,
  tenant: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  Radium(MainContentArea)
);
