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

import {
  selectAwaitingScript,
  selectIsEndWrapupDisabled,
} from 'containers/AgentDesktop/selectors';

import { selectWrapupBtnTooltipText } from 'containers/ContentAreaTop/selectors';

import messages from './messages';

const styles = {
  content: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    padding: '17px',
  },
  highlightContent: {
    border: '1px solid #FE4565',
  },
};

export function VoiceContentArea(props) {
  const from = has(props.selectedInteraction, 'contact.attributes.name')
    ? props.selectedInteraction.contact.attributes.name
    : props.selectedInteraction.number;

  const details = props.selectedInteraction.customFields ? (
    <CustomFields />
  ) : (
    ''
  );

  const wrappingUp = props.selectedInteraction.status === 'wrapup';

  const buttonConfig = [
    {
      id: wrappingUp ? 'wrapup-button' : 'hang-up-button',
      type: 'primaryRed',
      text: wrappingUp ? messages.endWrapup : messages.hangUp,
      onClick: props.endInteraction,
      disabled: props.isEndWrapupDisabled,
      title:
        Object.keys(props.wrapupBtnTooltipText).length > 0
          ? props.wrapupBtnTooltipText
          : '',
    },
  ];

  let content;
  if (props.selectedInteraction.script !== undefined) {
    content = (
      <div
        style={[
          styles.content,
          props.awaitingScript && styles.highlightContent,
        ]}
      >
        <AgentScript />
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
  awaitingScript: selectAwaitingScript(state, props),
  wrapupBtnTooltipText: selectWrapupBtnTooltipText(state, props),
  isEndWrapupDisabled: selectIsEndWrapupDisabled(state, props),
});

VoiceContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  awaitingScript: PropTypes.bool.isRequired,
  wrapupBtnTooltipText: PropTypes.object.isRequired,
  isEndWrapupDisabled: PropTypes.bool.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps)(Radium(VoiceContentArea))
);
