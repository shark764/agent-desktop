/*
 *
 * AgentStats
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Stat from 'components/Stat';
import { selectEnabledStats, selectAvailableStats } from './selectors';

export class AgentStats extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
    };
    this.generateStat = this.generateStat.bind(this);
    this.toggleStat = this.toggleStat.bind(this);
  }

  styles = {
    statsContainer: {
      alignItems: 'center',
      display: 'flex',
      minHeight: '54px',
      flex: '1 1 auto',
      justifyContent: 'flex-end',
      order: '0',
    },
    button: {
      cursor: 'pointer',
    },
  }

  toggleStat(stat) {
    this.props.toggleStat(stat);
    this.setState({ hoverIndex: -1 });
  }

  generateStat(stat, index, array) {
    const statistic = this.props.availableStats[stat.statOption];
    let key;
    if (stat.statSource === 'queue-id') {
      key = stat.statOption + stat.statSource + stat.statAggregate + stat.queue;
    } else {
      key = stat.statOption + stat.statSource + stat.statAggregate;
    }
    return (
      <div
        key={key}
        onMouseOver={() => { this.setState({ hoverIndex: index }); }}
        onFocus={() => { this.setState({ hoverIndex: index }); }}
        onMouseLeave={() => { this.setState({ hoverIndex: -1 }); }}
      >
        <Stat
          key={key}
          statistic={statistic}
          hover={this.state.hoverIndex === index}
          index={array.length - index}
          hoverData={stat}
          queues={this.props.queues}
          toggleStat={this.toggleStat}
          readyState={this.props.readyState}
        />
      </div>
    );
  }

  render() {
    return (
      <div id="agent-stats" style={this.styles.statsContainer}>
        {this.props.enabledStats.map(this.generateStat)}
      </div>
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
    setCriticalError: () => dispatch(setCriticalError()),
    dispatch,
  };
}

AgentStats.propTypes = {
  enabledStats: PropTypes.array,
  availableStats: PropTypes.object,
  queues: PropTypes.array,
  toggleStat: PropTypes.func.isRequired,
  readyState: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStats));
