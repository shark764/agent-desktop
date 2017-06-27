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

import Button from 'components/Button';

import AgentScript from 'containers/AgentScript';
import ContentArea from 'containers/ContentArea';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class VoiceContentArea extends React.Component {
  styles = {
    customField: {
      display: 'inline-block',
      width: '50%',
    },
    customFieldLabel: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
    },
    customFieldValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
    },
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
      ? this.props.selectedInteraction.customFields.map((customField) =>
        <div
          key={customField.label + customField.value}
          style={this.styles.customField}
        >
          <div style={this.styles.customFieldLabel}>
            {customField.label}
          </div>
          <div style={this.styles.customFieldValue}>
            {customField.value}
          </div>
        </div>
        )
      : '';

    const wrappingUp = this.props.selectedInteraction.status === 'wrapup';

    const buttons = (
      <Button
        id={wrappingUp ? 'wrapup-button' : 'hang-up-button'}
        key={wrappingUp ? 'wrapup-button' : 'end-chat-button'}
        type="primaryRed"
        text={wrappingUp ? messages.endWrapup : messages.hangUp}
        onClick={this.props.endInteraction}
        disabled={isAccepting || this.props.awaitingDisposition}
      />
    );

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
    } else {
      content = <div id="noContent" />;
    }

    return (
      <ContentArea
        interaction={this.props.selectedInteraction}
        from={from}
        buttons={buttons}
        details={details}
        content={content}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
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
  connect(mapStateToProps, mapDispatchToProps)(Radium(VoiceContentArea))
);
