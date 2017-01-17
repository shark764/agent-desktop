/*
 *
 * MainContentArea
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectSelectedInteraction } from './selectors';
import Radium from 'radium';

import MessagingContentArea from 'containers/MessagingContentArea';
import EmailContentArea from 'containers/EmailContentArea';

export class MainContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  styles = {
    base: {
      backgroundColor: '#072931',
      color: '#4B4B4B',
    },
  };

  render() {
    const selectedInteraction = this.props.selectedInteraction;
    let content;
    if (selectedInteraction) {
      if (selectedInteraction.channelType === 'messaging' || selectedInteraction.channelType === 'sms') {
        content = <MessagingContentArea selectedInteraction={selectedInteraction} />;
      } else if (selectedInteraction.channelType === 'email') {
        content = <EmailContentArea selectedInteraction={selectedInteraction} emailCreateReply={this.props.emailCreateReply} emailCancelReply={this.props.emailCancelReply} />;
      } else {
        console.error('Unknown selected channelType: ', selectedInteraction.channelType);
      }
    }
    return (
      <div style={[this.styles.base, this.props.style]}>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  selectedInteraction: selectSelectedInteraction(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

MainContentArea.propTypes = {
  style: PropTypes.array,
  selectedInteraction: PropTypes.object,
  emailCreateReply: PropTypes.func.isRequired,
  emailCancelReply: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(MainContentArea));
