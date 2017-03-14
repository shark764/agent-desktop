/*
 *
 * AgentStats
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import Stat from 'components/Stat';
import { startPoll } from 'containers/Toolbar/reducer';
import { selectEnabledStats, selectAvailableStats, selectCurrentAgent } from './selectors';

export class AgentStats extends React.Component { // eslint-disable-line react/prefer-stateless-function

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

  componentDidMount() {
    startPoll(this.props.enabledStats, this.props.availableStats, this.props.currentAgent.userId);
  }

  toggleStat(stat) {
    this.props.toggleStat(stat);
    this.setState({ hoverIndex: -1 });
  }

  generateStat(stat, index, array) {
    const statistic = this.props.availableStats[stat.statOption];
    return (
      <div
        key={stat.statOption + stat.statSource + stat.statAggregate}
        onMouseOver={() => { this.setState({ hoverIndex: index }); }}
        onFocus={() => { this.setState({ hoverIndex: index }); }}
        onMouseLeave={() => { this.setState({ hoverIndex: -1 }); }}
      >
        <Stat
          key={stat.statOption + stat.statSource + stat.statAggregate}
          statistic={statistic}
          hover={this.state.hoverIndex === index}
          index={array.length - index}
          hoverData={stat}
          queues={this.props.queues}
          currentAgent={this.props.currentAgent.userId}
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
    currentAgent: selectCurrentAgent(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

AgentStats.propTypes = {
  enabledStats: PropTypes.array,
  availableStats: PropTypes.object,
  currentAgent: PropTypes.object,
  queues: PropTypes.array,
  toggleStat: PropTypes.func.isRequired,
  readyState: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStats));
