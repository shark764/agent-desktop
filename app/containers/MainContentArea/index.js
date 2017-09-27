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

import ErrorBoundary from 'components/ErrorBoundary';

import AgentScript from 'containers/AgentScript';
import NewInteractionContentArea from 'containers/NewInteractionContentArea';
import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';
import VoiceContentArea from 'containers/VoiceContentArea';
import WelcomeStats from 'containers/WelcomeStats';

import { removeInteraction } from 'containers/AgentDesktop/actions';
import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

import { selectMessageTemplates } from './selectors';

const styles = {
  base: {
    backgroundColor: '#072931',
    color: '#4B4B4B',
    position: 'relative',
    zIndex: '1',
  },
};

class MainContentArea extends React.Component {
  endInteraction = () => {
    if (this.props.selectedInteraction.status === 'wrapup') {
      CxEngage.interactions.endWrapup({
        interactionId: this.props.selectedInteraction.interactionId,
      });
    } else if (
      this.props.selectedInteraction.status === 'connecting-to-outbound' ||
      this.props.selectedInteraction.status === 'initializing-outbound'
    ) {
      this.props.removeInteraction(
        this.props.selectedInteraction.interactionId
      );
    } else if (
      this.props.selectedInteraction.channelType === 'email' &&
      this.props.selectedInteraction.direction === 'outbound'
    ) {
      CxEngage.interactions.sendCustomInterrupt({
        interactionId: this.props.selectedInteraction.interactionId,
        interruptType: 'work-cancel',
        interruptBody: {
          resourceId: this.props.agent.userId,
        },
      });
    } else {
      CxEngage.interactions.end({
        interactionId: this.props.selectedInteraction.interactionId,
      });
      // FIXME We shouldn't have to do this. Flow should be sending us a work-ended back, but it is not currently.
      if (this.props.selectedInteraction.status === 'initialized-outbound') {
        this.props.removeInteraction(
          this.props.selectedInteraction.interactionId
        );
      }
    }
  };

  render() {
    const selectedInteraction = this.props.selectedInteraction;

    let content = null;
    if (selectedInteraction) {
      if (selectedInteraction.status === 'creating-new-interaction') {
        content = <NewInteractionContentArea />;
      } else if (selectedInteraction.isScriptOnly === true) {
        content = (
          <AgentScript
            interactionId={selectedInteraction.interactionId}
            script={selectedInteraction.script}
            style={{ padding: '30px' }}
          />
        );
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
      } else if (selectedInteraction.interactionId) {
        throw new Error(
          `Unknown selected channelType: ${selectedInteraction.channelType}`
        );
      }
    }

    return (
      <div style={[styles.base, this.props.style]}>
        {content !== null ? content : <WelcomeStats agent={this.props.agent} />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: getSelectedInteraction(state, props),
  messageTemplates: selectMessageTemplates(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
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
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea))
);
