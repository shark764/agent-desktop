/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentStatsMenu
 *
 */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import pickBy from 'lodash/pickBy';

import ErrorBoundary from 'components/ErrorBoundary';

import { activateToolbarStat } from 'containers/Toolbar/actions';

import Select from 'components/Select';
import Button from 'components/Button';
import {
  selectHasAgentExperienceTransferMenuQueuesViewPermission,
  selectHasAgentExperienceTransferMenuAgentsViewPermission,
} from 'containers/TransferMenu/selectors';
import { selectAvailableStats } from 'containers/AgentStats/selectors';
import {
  selectToolbarStatIds,
  selectCurrentAgent,
} from 'containers/Toolbar/selectors';
import { selectVisibleQueues } from 'containers/AgentTransferMenuPreferenceMenu/selectors';
import { initializeTransferMenuPreferences } from 'containers/AgentTransferMenuPreferenceMenu/actions';
import messages from './messages';

const MAXIMUM_STATS = 5;

export class AgentStatsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props.initializeTransferMenuPreferences();
    this.state = {
      statSource: 'resource-id',
    };
    this.sourceOptions = [
      { value: 'resource-id', label: props.intl.formatMessage(messages.agent) },
      { value: 'queue-id', label: props.intl.formatMessage(messages.queue) },
      { value: 'tenant-id', label: props.intl.formatMessage(messages.tenant) },
    ];
  }

  styles = {
    menuGroup: {
      paddingBottom: '11px',
    },
    menuHeader: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#979797',
    },
    statOption: {
      fontSize: '14px',
      lineHeight: '17px',
      color: '#4B4B4B',
    },
    select: {
      height: '17px',
      border: 'none',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      color: 'red',
    },
  };

  addStat = () => {
    this.props.activateToolbarStat(this.state);
  };

  setStatSource = (value) => {
    this.setState({ statSource: value }, () => {
      if (
        this.props.selectVisibleQueues.length > 0 &&
        value === 'queue-id' &&
        this.props.hasAgentExperienceTransferMenuQueuesViewPermission
      ) {
        this.setQueue(this.getQueues()[0].value);
      }
      this.setStatOption(this.getStats()[0].value);
    });
  };

  setStatOption = (value) => {
    this.setState({ statOption: value }, () => {
      this.setStatAggregate(this.getAggregates()[0].value);
    });
  };

  setStatAggregate = (value) => {
    this.setState({ statAggregate: value });
  };

  setQueue = (value) => {
    this.setState({ queue: value });
  };

  getQueues = () =>
    this.props.selectVisibleQueues.map((queue) => ({
      value: queue.id,
      label: queue.name,
    }));

  getSourceOptions = () => {
    const sourceOptions = this.sourceOptions.filter(
      (e) =>
        (e.value === 'queue-id' &&
          this.props.hasAgentExperienceTransferMenuQueuesViewPermission) ||
        (e.value === 'resource-id' &&
          this.props.hasAgentExperienceTransferMenuAgentsViewPermission) ||
        e.value === 'tenant-id'
    );
    this.sourceOptions = sourceOptions;
    return this.sourceOptions;
  };

  getStats = () => {
    let stats;
    if (this.state.statSource === 'tenant-id') {
      stats = this.props.availableStats;
    } else {
      stats = pickBy(this.props.availableStats, (stat) =>
        stat.optionalFilters.includes(this.state.statSource)
      );
    }
    return (
      Object.keys(stats)
        // Some stats userFriendlyName start with a space. Remove that if it is there.
        .map((key) => ({
          value: key,
          label:
            stats[key].userFriendlyName[0] !== ' '
              ? stats[key].userFriendlyName
              : stats[key].userFriendlyName.slice(1),
        }))
        .sort((a, b) => {
          if (a.label.toUpperCase() > b.label.toUpperCase()) {
            return 1;
          } else if (a.label.toUpperCase() < b.label.toUpperCase()) {
            return -1;
          }
          return 0;
        })
    );
  };

  getAggregates = () =>
    this.props.availableStats[this.state.statOption] &&
    Object.keys(
      this.props.availableStats[this.state.statOption].responseKeys
    ).map((key) => ({
      value: key,
      label: key[0].toUpperCase() + key.slice(1),
    }));

  render() {
    return (
      <div id="statMenu">
        {Object.keys(this.props.availableStats).length === 0 ? (
          <FormattedMessage {...messages.loadingStats} />
        ) : (
          <Fragment>
            <div style={this.styles.menuGroup}>
              <div style={this.styles.menuHeader}>
                <FormattedMessage {...messages.source} />
              </div>
              <div style={this.styles.statOption}>
                <Select
                  id="statSource"
                  value={this.state.statSource}
                  style={this.styles.select}
                  options={this.getSourceOptions()}
                  onChange={(e) => this.setStatSource(e.value || '-1')}
                  clearable={false}
                />
              </div>
            </div>
            {this.state.statSource === 'queue-id' && (
              <div style={this.styles.menuGroup}>
                <div style={this.styles.menuHeader}>
                  <FormattedMessage {...messages.queue} />
                </div>
                <div style={this.styles.statOption}>
                  <Select
                    id="queueSelect"
                    value={this.state.queue}
                    style={this.styles.select}
                    options={this.getQueues()}
                    onChange={(e) => this.setQueue(e.value || '-1')}
                    clearable={false}
                  />
                </div>
              </div>
            )}
            <div style={this.styles.menuGroup}>
              <div style={this.styles.menuHeader}>
                <FormattedMessage {...messages.statistic} />
              </div>
              <div style={this.styles.statOption}>
                <Select
                  id="statOption"
                  value={this.state.statOption}
                  style={this.styles.select}
                  options={this.getStats()}
                  onChange={(e) => this.setStatOption(e.value || '-1')}
                  clearable={false}
                />
              </div>
            </div>
            <div style={this.styles.menuGroup}>
              <div style={this.styles.menuHeader}>
                <FormattedMessage {...messages.aggregate} />
              </div>
              <div style={this.styles.statOption}>
                <Select
                  id="statAggregate"
                  value={this.state.statAggregate}
                  style={this.styles.select}
                  options={this.getAggregates()}
                  onChange={(e) =>
                    this.setStatAggregate(e.value || '-1', e.label || '')
                  }
                  clearable={false}
                />
              </div>
            </div>
            <div style={this.styles.buttonContainer}>
              {this.props.toolbarStatIds.length === MAXIMUM_STATS ? (
                <span>
                  <FormattedMessage {...messages.maxStats} />
                </span>
              ) : (
                <Button
                  text={messages.add}
                  id="toggleStat"
                  style={this.styles.addButton}
                  type="secondary"
                  onClick={this.addStat}
                />
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    toolbarStatIds: selectToolbarStatIds()(state, props).toJS(),
    availableStats: selectAvailableStats(state, props),
    currentAgent: selectCurrentAgent(state, props),
    selectVisibleQueues: selectVisibleQueues(state, props),
    hasAgentExperienceTransferMenuQueuesViewPermission: selectHasAgentExperienceTransferMenuQueuesViewPermission(
      state,
      props
    ),
    hasAgentExperienceTransferMenuAgentsViewPermission: selectHasAgentExperienceTransferMenuAgentsViewPermission(
      state,
      props
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    activateToolbarStat: (stat) => dispatch(activateToolbarStat(stat)),
    initializeTransferMenuPreferences: () =>
      dispatch(initializeTransferMenuPreferences()),
    dispatch,
  };
}

AgentStatsMenu.propTypes = {
  intl: intlShape.isRequired,
  activateToolbarStat: PropTypes.func,
  toolbarStatIds: PropTypes.array,
  availableStats: PropTypes.object,
  show: PropTypes.bool,
  selectVisibleQueues: PropTypes.array.isRequired,
  initializeTransferMenuPreferences: PropTypes.func.isRequired,
  hasAgentExperienceTransferMenuQueuesViewPermission: PropTypes.bool.isRequired,
  hasAgentExperienceTransferMenuAgentsViewPermission: PropTypes.bool.isRequired,
};

export default ErrorBoundary(
  injectIntl(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Radium(AgentStatsMenu))
  )
);
