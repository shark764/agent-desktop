/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * InteractionsBar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Radium from 'radium';
import { injectIntl, intlShape } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import FontAwesomeIcon from 'components/FontAwesomeIcon';

import { selectInteraction } from 'containers/AgentDesktop/actions';
import { selectAgentDesktopMap } from 'containers/AgentDesktop/selectors';
import {
  getSelectedInteractionId,
  selectShowCurrentCrmItemHistoryButton,
} from './selectors';

import messages from './messages';

export class CurrentCrmItemHistoryButton extends React.Component {
  selectCurrentCrmItemHistory = () =>
    this.props.selectInteraction('current-crm-item-history');

  render() {
    return (
      this.props.showCurrentCrmItemHistoryButton && (
        <div
          title={`${this.props.intl.formatMessage(
            messages.currentCrmItemHistory
          )} ${this.props.zendeskActiveTab.getIn([
            'contact',
            'attributes',
            'name',
          ])}`}
          style={[
            {
              padding: '13px',
              flexShrink: 0,
              cursor: 'pointer',
            },
            this.props.selectedInteractionId === 'current-crm-item-history' && {
              backgroundColor: '#0B424E',
            },
          ]}
          onClick={this.selectCurrentCrmItemHistory}
        >
          <FontAwesomeIcon
            id="currentCrmItemHistoryButton"
            name="history"
            style={{
              color: 'white',
              fontSize: '1.5em',
              padding: '5px 12px',
              cursor: 'pointer',
            }}
          />
        </div>
      )
    );
  }
}

const mapStateToProps = (state, props) => ({
  zendeskActiveTab: selectAgentDesktopMap(state, props).get('zendeskActiveTab'),
  selectedInteractionId: getSelectedInteractionId(state, props),
  showCurrentCrmItemHistoryButton: selectShowCurrentCrmItemHistoryButton(
    state,
    props
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    selectInteraction: (interactionId) =>
      dispatch(selectInteraction(interactionId)),
    dispatch,
  };
}

CurrentCrmItemHistoryButton.propTypes = {
  intl: intlShape.isRequired,
  zendeskActiveTab: ImmutablePropTypes.mapContains({
    contact: ImmutablePropTypes.mapContains({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      attributes: ImmutablePropTypes.mapContains({
        name: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }),
  selectedInteractionId: PropTypes.string,
  showCurrentCrmItemHistoryButton: PropTypes.bool.isRequired,
  selectInteraction: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      Radium(CurrentCrmItemHistoryButton)
    )
  )
);
