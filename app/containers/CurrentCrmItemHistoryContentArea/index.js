/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * CurrentCrmItemHistoryContentArea
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import Dotdotdot from 'react-dotdotdot';
import Button from 'components/Button';
import ContactInteractionHistory from 'containers/ContactInteractionHistory';

import {
  closeCurrentCrmItemHistoryPanel,
  loadCrmInteractionHistory,
} from 'containers/AgentDesktop/actions';
import { selectAgentDesktopMap } from 'containers/AgentDesktop/selectors';

import messages from './messages';

const styles = {
  base: {
    padding: '20px 0 0 20px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    float: 'right',
    height: '35px',
    marginRight: '20px',
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    marginRight: '5px',
  },
  message: {
    marginBottom: '5px',
  },
  contactInteractionHistoryContainer: {
    display: 'flex',
    flexGrow: 1,
  },
};

export class CurrentCrmItemHistoryContentArea extends React.Component {
  componentWillMount() {
    // Load history when component is displayed and has not previously been loaded
    this.props.loadCrmInteractionHistory(
      this.props.zendeskActiveTab.get('type'),
      this.props.zendeskActiveTab.get('id')
    );
  }

  componentWillReceiveProps(nextProps) {
    // Update history when active tab changes
    if (
      this.props.zendeskActiveTab.get('id') !==
        nextProps.zendeskActiveTab.get('id') ||
      this.props.zendeskActiveTab.get('type') !==
        nextProps.zendeskActiveTab.get('type')
    ) {
      this.props.loadCrmInteractionHistory(
        nextProps.zendeskActiveTab.get('type'),
        nextProps.zendeskActiveTab.get('id')
      );
    }
  }

  render() {
    return (
      <div style={styles.base}>
        <div style={styles.header}>
          <div style={styles.title}>
            <div style={styles.message}>
              <FormattedMessage {...messages.interactionHistoryFor} />
            </div>
            <div
              className="crmItemName"
              title={this.props.zendeskActiveTab.getIn(['attributes', 'name'])}
            >
              <Dotdotdot clamp={3}>
                {this.props.zendeskActiveTab.getIn(['attributes', 'name'])}
              </Dotdotdot>
            </div>
          </div>
          <Button
            id="cancelCurrentCrmItemHistoryButton"
            type="secondary"
            style={styles.button}
            text={messages.cancel}
            onClick={this.props.closeCurrentCrmItemHistoryPanel}
          />
        </div>
        <div style={styles.contactInteractionHistoryContainer}>
          <ContactInteractionHistory style={{ flex: 1 }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  zendeskActiveTab: selectAgentDesktopMap(state, props).get('zendeskActiveTab'),
});

function mapDispatchToProps(dispatch) {
  return {
    closeCurrentCrmItemHistoryPanel: () =>
      dispatch(closeCurrentCrmItemHistoryPanel()),
    loadCrmInteractionHistory: (subType, id, page) =>
      dispatch(loadCrmInteractionHistory(subType, id, page)),
    dispatch,
  };
}

CurrentCrmItemHistoryContentArea.propTypes = {
  zendeskActiveTab: ImmutablePropTypes.mapContains({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    attributes: ImmutablePropTypes.mapContains({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  closeCurrentCrmItemHistoryPanel: PropTypes.func.isRequired,
  loadCrmInteractionHistory: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(
    Radium(CurrentCrmItemHistoryContentArea)
  )
);
