/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentConfigMenu
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';
import pickBy from 'lodash/pickBy';

import ErrorBoundary from 'components/ErrorBoundary';

import { activateToolbarStat } from 'containers/Toolbar/actions';

import PopupDialog from 'components/PopupDialog';
import Select from 'components/Select';
import Button from 'components/Button';
import { selectAvailableStats } from 'containers/AgentStats/selectors';
import { selectToolbarStatIds } from 'containers/Toolbar/selectors';
import messages from './messages';

const MAXIMUM_STATS = 5;

export class AgentConfigMenu extends React.Component {
  constructor(props) {
    super(props);
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
    statMenu: {
      position: 'absolute',
      width: '230px',
      right: '2px',
      bottom: '56px',
      margin: '10px',
      color: '#4b4b4b',
      padding: '10px 13px',
    },
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
    this.props.hideMenu();
  };

  setStatSource = (value) => {
    this.setState({ statSource: value }, () => {
      if (value === 'queue-id') {
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
    this.props.queues.map((queue) => ({ value: queue.id, label: queue.name }));

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
    ).map((key) => ({ value: key, label: key[0].toUpperCase() + key.slice(1) }));

  render() {
    return (
      <PopupDialog
        id="statMenu"
        style={this.styles.statMenu}
        widthPx={230}
        arrowLeftOffsetPx={198}
        isVisible={this.props.show}
        hide={this.props.hideMenu}
      >
        <div style={this.styles.menuGroup}>
          <div style={this.styles.menuHeader}>
            <FormattedMessage {...messages.source} />
          </div>
          <div style={this.styles.statOption}>
            <Select
              id="statSource"
              value={this.state.statSource}
              style={this.styles.select}
              options={this.sourceOptions}
              onChange={(e) => this.setStatSource(e.value || '-1')}
              clearable={false}
            />
          </div>
        </div>
        {this.state.statSource === 'queue-id'
          ? <div style={this.styles.menuGroup}>
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
          : ''}
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
                this.setStatAggregate(e.value || '-1', e.label || '')}
              clearable={false}
            />
          </div>
        </div>
        <div style={this.styles.buttonContainer}>
          {this.props.toolbarStatIds.length === MAXIMUM_STATS
            ? <span>
              <FormattedMessage {...messages.maxStats} />
            </span>
            : <Button
              text={messages.add}
              id="toggleStat"
              style={this.styles.addButton}
              type="secondary"
              onClick={this.addStat}
            />}
        </div>
      </PopupDialog>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    toolbarStatIds: selectToolbarStatIds()(state, props).toJS(),
    availableStats: selectAvailableStats(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    activateToolbarStat: (stat) => dispatch(activateToolbarStat(stat)),
    dispatch,
  };
}

AgentConfigMenu.propTypes = {
  intl: intlShape.isRequired,
  activateToolbarStat: PropTypes.func,
  toolbarStatIds: PropTypes.array,
  availableStats: PropTypes.object,
  queues: PropTypes.array,
  hideMenu: PropTypes.func,
  show: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Radium(AgentConfigMenu))
  )
);
