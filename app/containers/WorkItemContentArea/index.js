/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * WorkItemContentArea
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

const styles = {
  content: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    padding: '17px',
  },
};

export function WorkItemContentArea(props) {
  const isAccepting = props.selectedInteraction.status === 'work-accepting';

  const from = `${
    has(props.selectedInteraction, 'contact.attributes.name')
      ? `${props.selectedInteraction.contact.attributes.name} - `
      : ''
  }${props.selectedInteraction.subject}`;

  const details = props.selectedInteraction.customFields && <CustomFields />;

  const wrappingUp = props.selectedInteraction.status === 'wrapup';

  const buttonConfig = [
    {
      id: wrappingUp ? 'wrapup-button' : 'end-button',
      type: 'primaryRed',
      text: wrappingUp ? messages.endWrapup : messages.end,
      onClick: props.endInteraction,
      disabled: isAccepting || props.awaitingDisposition,
    },
  ];

  let content;
  if (props.selectedInteraction.script !== undefined) {
    content = (
      <div style={styles.content}>
        <AgentScript
          interactionId={props.selectedInteraction.interactionId}
          script={props.selectedInteraction.script}
        />
      </div>
    );
  }
  return (
    <ContentArea
      interaction={props.selectedInteraction}
      from={from}
      buttonConfig={buttonConfig}
      details={details}
      content={content}
    />
  );
}

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

WorkItemContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps)(Radium(WorkItemContentArea))
);
