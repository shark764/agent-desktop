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
import AwaitingDispositionSpinner from 'components/AwaitingDispositionSpinner';

import CustomFields from 'containers/CustomFields';

import AgentScript from 'containers/AgentScript';
import ContentArea from 'containers/ContentArea';

import {
  selectAwaitingScript,
  selectIsEndWrapupDisabled,
  selectAwaitingDisposition,
} from 'containers/AgentDesktop/selectors';

import { selectWrapupBtnTooltipText } from 'containers/ContentAreaTop/selectors';
import { setAwaitingDisposition } from 'containers/AgentDesktop/actions';

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

export class VoiceContentArea extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.awaitingDisposition &&
      this.props.awaitingDisposition !== prevProps.awaitingDisposition
    ) {
      const { interactionId } = this.props.selectedInteraction;
      this.props.setAwaitingDisposition(interactionId);
    }
  }

  render() {
    const { selectedInteraction } = this.props;

    const from = has(selectedInteraction, 'contact.attributes.name')
      ? selectedInteraction.contact.attributes.name
      : selectedInteraction.number;

    let details;
    if (selectedInteraction.customFields) {
      details = <CustomFields />;
    } else if (selectedInteraction.showAwaitingDisposition) {
      details = <div />;
    } else {
      details = '';
    }

    const wrappingUp = selectedInteraction.status === 'wrapup';

    const buttonConfig = [
      {
        id: wrappingUp ? 'wrapup-button' : 'hang-up-button',
        type: 'primaryRed',
        text: wrappingUp ? messages.endWrapup : messages.hangUp,
        onClick: this.props.endInteraction,
        disabled: this.props.isEndWrapupDisabled,
        title:
          Object.keys(this.props.wrapupBtnTooltipText).length > 0
            ? this.props.wrapupBtnTooltipText
            : '',
      },
    ];

    let content;
    if (selectedInteraction.script !== undefined) {
      content = (
        <div
          style={[
            styles.content,
            this.props.awaitingScript && styles.highlightContent,
          ]}
        >
          <AgentScript />
        </div>
      );
    } else if (selectedInteraction.showAwaitingDisposition) {
      // Awaiting Disposition spinner when maximum wrapup time exceeded:
      content = <AwaitingDispositionSpinner />;
    }

    return (
      <ContentArea
        interaction={selectedInteraction}
        from={from}
        buttonConfig={buttonConfig}
        details={details}
        content={content}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({
  awaitingScript: selectAwaitingScript(state, props),
  wrapupBtnTooltipText: selectWrapupBtnTooltipText(state, props),
  isEndWrapupDisabled: selectIsEndWrapupDisabled(state, props),
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

const mapDispatchToProps = dispatch => ({
  setAwaitingDisposition: interactionId =>
    dispatch(setAwaitingDisposition(interactionId)),
});

VoiceContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
  endInteraction: PropTypes.func.isRequired,
  awaitingScript: PropTypes.bool.isRequired,
  wrapupBtnTooltipText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  isEndWrapupDisabled: PropTypes.bool.isRequired,
  awaitingDisposition: PropTypes.bool,
  setAwaitingDisposition: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Radium(VoiceContentArea))
);
