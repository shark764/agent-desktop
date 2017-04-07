/*
 *
 * MainContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';
import VoiceContentArea from 'containers/VoiceContentArea';
import WelcomeStats from 'containers/WelcomeStats';

import { selectSelectedInteraction, selectMessageTemplates } from './selectors';

export class MainContentArea extends React.Component {

  constructor(props) {
    super(props);
    this.endInteraction = this.endInteraction.bind(this);
  }

  styles = {
    base: {
      backgroundColor: '#072931',
      color: '#4B4B4B',
    },
  };

  endInteraction() {
    if (this.props.selectedInteraction.status === 'wrapup') {
      SDK.interactions.endWrapup({ interactionId: this.props.selectedInteraction.interactionId });
    } else {
      SDK.interactions.end({ interactionId: this.props.selectedInteraction.interactionId });
    }
  }

  render() {
    const selectedInteraction = this.props.selectedInteraction;

    let content = null;
    if (selectedInteraction) {
      if (selectedInteraction.channelType === 'messaging' || selectedInteraction.channelType === 'sms') {
        const messageTemplates = this.props.messageTemplates.filter((messageTemplate) =>
          messageTemplate.channels.includes(selectedInteraction.channelType)
        );
        content = <MessagingContentArea selectedInteraction={selectedInteraction} endInteraction={this.endInteraction} messageTemplates={messageTemplates} />;
      } else if (selectedInteraction.channelType === 'email') {
        content = <EmailContentArea selectedInteraction={selectedInteraction} endInteraction={this.endInteraction} emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} />;
      } else if (selectedInteraction.channelType === 'voice') {
        content = <VoiceContentArea selectedInteraction={selectedInteraction} endInteraction={this.endInteraction} />;
      } else {
        throw new Error(`Unknown selected channelType: ${selectedInteraction.channelType}`);
      }
    }

    return (
      <div style={[this.styles.base, this.props.style]}>
        {
          content !== null
          ? content
          : <WelcomeStats agent={this.props.agent} tenant={this.props.tenant} />
        }
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
    dispatch,
  };
}

MainContentArea.propTypes = {
  style: PropTypes.array,
  selectedInteraction: PropTypes.object,
  messageTemplates: PropTypes.array,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
  agent: PropTypes.object.isRequired,
  tenant: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
