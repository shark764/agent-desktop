/*
 *
 * AgentConfigMenu
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import pickBy from 'lodash/pickBy';

import Select from 'components/Select';
import Button from 'components/Button';
import { selectEnabledStats, selectAvailableStats } from './selectors';
import messages from './messages';

const MAXIMUM_STATS = 5;

export class AgentConfigMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      statSource: 'resource-id',
      statOption: 'resourceConversationStartsCount',
      statAggregate: 'count',
    };
    this.sourceOptions = [{ value: 'resource-id', label: 'Agent' }, { value: 'queue-id', label: 'Queue' }, { value: 'tenant-id', label: 'Tenant' }];
    this.toggleStat = this.toggleStat.bind(this);
    this.setStatSource = this.setStatSource.bind(this);
    this.setStatOption = this.setStatOption.bind(this);
    this.setStatAggregate = this.setStatAggregate.bind(this);
    this.setQueue = this.setQueue.bind(this);
    this.getQueues = this.getQueues.bind(this);
    this.getStats = this.getStats.bind(this);
    this.getAggregates = this.getAggregates.bind(this);
  }

  styles = {
    statMenuTriangle: {
      position: 'absolute',
      width: '0px',
      height: '0px',
      right: '17px',
      bottom: '60px',
      borderWidth: '8px',
      borderStyle: 'solid',
      borderColor: '#FFF transparent transparent #FFF',
      borderImage: 'initial',
      transform: 'rotate(-134deg)',
      borderRadius: '3px',
      boxShadow: '-6px -6px 6px -4px rgba(0,0,0,0.29)',
      zIndex: '2',
    },
    statMenu: {
      position: 'fixed',
      right: '8px',
      bottom: '66px',
      zIndex: '2',
      width: '230px',
      minHeight: '250px',
      borderRadius: '8px',
      padding: '10px 13px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
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
    statTitle: {
      position: 'relative',
      top: '-3px',
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
  }

  toggleStat() {
    this.props.toggleStat(this.state, this.props.currentAgent.userId);
  }

  setStatSource(value) {
    this.setState({ statSource: value }, () => {
      if (value === 'queue-id') {
        this.setQueue(this.getQueues()[0].value);
      }
      this.setStatOption(this.getStats()[0].value);
    });
  }

  setStatOption(value) {
    this.setState({ statOption: value }, () => {
      this.setStatAggregate(this.getAggregates()[0].value);
    });
  }

  setStatAggregate(value) {
    this.setState({ statAggregate: value });
  }

  setQueue(value) {
    this.setState({ queue: value });
  }

  getQueues() {
    return this.props.queues.map((queue) => ({ value: queue.id, label: queue.name }));
  }

  getStats() {
    let stats;
    if (this.state.statSource === 'tenant-id') {
      stats = this.props.availableStats;
    } else {
      stats = pickBy(this.props.availableStats, (stat) => stat.optionalFilters.includes(this.state.statSource));
    }
    return Object.keys(stats)
        .map((key) => ({ value: key, label: stats[key].userFriendlyName }))
        .sort((a, b) => {
          if (a.label.toUpperCase() > b.label.toUpperCase()) {
            return 1;
          } else if (a.label.toUpperCase() < b.label.toUpperCase()) {
            return -1;
          } return 0;
        });
  }

  getAggregates() {
    return Object.keys(this.props.availableStats[this.state.statOption].responseKeys).map((key) => {
      let label;
      if (key === 'avg') {
        label = 'average';
      } else {
        label = key;
      }
      return { value: key, label: label[0].toUpperCase() + label.slice(1) };
    });
  }

  render() {
    return (
      <span>
        <div id="statMenu" style={this.styles.statMenu}>
          <div style={this.styles.menuGroup}>
            <div style={this.styles.menuHeader}><FormattedMessage {...messages.source} /></div>
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
          {this.state.statSource === 'queue-id' ?
            <div style={this.styles.menuGroup}>
              <div style={this.styles.menuHeader}><FormattedMessage {...messages.queue} /></div>
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
            <div style={this.styles.menuHeader}><FormattedMessage {...messages.statistic} /></div>
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
            <div style={this.styles.menuHeader}><FormattedMessage {...messages.aggregate} /></div>
            <div style={this.styles.statOption}>
              <Select
                id="statAggregate"
                value={this.state.statAggregate}
                style={this.styles.select}
                options={this.getAggregates()}
                onChange={(e) => this.setStatAggregate(e.value || '-1', e.label || '')}
                clearable={false}
              />
            </div>
          </div>
          <div style={this.styles.buttonContainer}>
            {this.props.enabledStats.length === MAXIMUM_STATS
              ? <span><FormattedMessage {...messages.maxStats} /></span>
              : <Button text={messages.add} id="toggleStat" style={this.styles.addButton} type="secondary" onClick={this.toggleStat} />}
          </div>
        </div>
        <span style={this.styles.statMenuTriangle} />
      </span>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    enabledStats: selectEnabledStats(state, props),
    availableStats: selectAvailableStats(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

AgentConfigMenu.propTypes = {
  toggleStat: PropTypes.func,
  enabledStats: PropTypes.array,
  availableStats: PropTypes.object,
  queues: PropTypes.array,
  currentAgent: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentConfigMenu));
