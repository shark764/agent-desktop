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
import CurrentCrmItemHistoryContentArea from 'containers/CurrentCrmItemHistoryContentArea';
import NewInteractionContentArea from 'containers/NewInteractionContentArea';
import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';
import VoiceContentArea from 'containers/VoiceContentArea';
import WorkItemContentArea from 'containers/WorkItemContentArea';
import WelcomeStats from 'containers/WelcomeStats';

import { setInteractionConfirmation } from 'containers/AgentDesktop/actions';
import { getSelectedInteraction } from 'containers/AgentDesktop/selectors';

import { selectMessageTemplates } from './selectors';

const styles = {
  base: {
    backgroundColor: '#072931',
    color: '#4B4B4B',
    position: 'relative',
  },
};

class MainContentArea extends React.Component {
  endInteraction = () => {
    if (this.props.selectedInteraction.status === 'wrapup') {
      CxEngage.interactions.endWrapup({
        interactionId: this.props.selectedInteraction.interactionId,
      });
    } else {
      this.props.setInteractionConfirmation(
        this.props.selectedInteraction.interactionId,
        true
      );
    }
  };

  render() {
    const selectedInteraction = this.props.selectedInteraction;

    let content = null;
    if (selectedInteraction) {
      if (selectedInteraction.status === 'creating-new-interaction') {
        content = <NewInteractionContentArea />;
      } else if (selectedInteraction.status === 'current-crm-item-history') {
        content = <CurrentCrmItemHistoryContentArea />;
      } else if (selectedInteraction.isScriptOnly === true) {
        content = (
          <AgentScript
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
            agent={this.props.agent}
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
      } else if (selectedInteraction.channelType === 'work-item') {
        content = (
          <WorkItemContentArea
            selectedInteraction={selectedInteraction}
            endInteraction={this.endInteraction}
          />
        );
      } else if (selectedInteraction.interactionId) {
        console.error(
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
    setInteractionConfirmation: (interactionId, status) =>
      dispatch(setInteractionConfirmation(interactionId, status)),
    dispatch,
  };
}

MainContentArea.propTypes = {
  selectedInteraction: PropTypes.object,
  messageTemplates: PropTypes.array,
  style: PropTypes.array,
  agent: PropTypes.object.isRequired,
  setInteractionConfirmation: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea))
);
