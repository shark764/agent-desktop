/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * VoiceContentArea
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';
import has from 'lodash/has';

import ErrorBoundary from 'components/ErrorBoundary';

import CustomFields from 'containers/CustomFields';

import AgentScript from 'containers/AgentScript';
import ContentArea from 'containers/ContentArea';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class VoiceContentArea extends React.Component {
  styles = {
    content: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      padding: '17px',
    },
  };

  render() {
    const isAccepting =
      this.props.selectedInteraction.status === 'work-accepting';

    const from = has(this.props.selectedInteraction, 'contact.attributes.name')
      ? this.props.selectedInteraction.contact.attributes.name
      : this.props.selectedInteraction.number;

    const details = this.props.selectedInteraction.customFields
      ? <CustomFields />
      : '';

    const wrappingUp = this.props.selectedInteraction.status === 'wrapup';

    const buttonConfig = [
      {
        id: wrappingUp ? 'wrapup-button' : 'hang-up-button',
        type: 'primaryRed',
        text: wrappingUp ? messages.endWrapup : messages.hangUp,
        onClick: this.props.endInteraction,
        disabled: isAccepting || this.props.awaitingDisposition,
      },
    ];

    let content;
    if (this.props.selectedInteraction.script !== undefined) {
      content = (
        <div style={this.styles.content}>
          <AgentScript
            interactionId={this.props.selectedInteraction.interactionId}
            script={this.props.selectedInteraction.script}
          />
        </div>
      );
    }
    return (
      <ContentArea
        interaction={this.props.selectedInteraction}
        from={from}
        buttonConfig={buttonConfig}
        details={details}
        content={content}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

VoiceContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps)(Radium(VoiceContentArea))
);
