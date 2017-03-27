/*
 *
 * AgentStats
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import Stat from 'components/Stat';
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
    const availableStats = this.props.availableStats;
    const currentAgent = this.props.currentAgent.userId;
    this.props.enabledStats.forEach((stat, statIndex) => {
      let statRequestBody;
      if (stat.statSource === 'resource-id') {
        statRequestBody = { statistic: availableStats[stat.statOption].name, resourceId: currentAgent };
      } else if (stat.statSource === 'queue-id') {
        statRequestBody = { statistic: availableStats[stat.statOption].name, queueId: stat.queue };
      } else {
        statRequestBody = { statistic: availableStats[stat.statOption].name };
      }
      SDK.reporting.addStatSubscription(statRequestBody, (err, topics, res) => {
        this.props.setStatId(statIndex, res.statId);
      });
    });
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
  setStatId: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStats));
