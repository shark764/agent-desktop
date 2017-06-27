/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentStats
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import { deactivateToolbarStat } from 'containers/Toolbar/actions';
import { selectToolbarStats } from 'containers/Toolbar/selectors';

import Stat from 'components/Stat';
import { selectAvailableStats } from './selectors';

export class AgentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
    };
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
  };

  removeStat = (stat) => {
    this.props.deactivateToolbarStat(stat);
    this.setState({ hoverIndex: -1 });
  };

  generateStat = (stat, index, array) => {
    const userFriendlyName = this.props.availableStats[stat.statOption]
      .userFriendlyName;
    let key;
    if (stat.statSource === 'queue-id') {
      key = stat.statOption + stat.statSource + stat.statAggregate + stat.queue;
    } else {
      key = stat.statOption + stat.statSource + stat.statAggregate;
    }
    return (
      <div
        key={key}
        onMouseOver={() => {
          this.setState({ hoverIndex: index });
        }}
        onFocus={() => {
          this.setState({ hoverIndex: index });
        }}
        onMouseLeave={() => {
          this.setState({ hoverIndex: -1 });
        }}
      >
        <Stat
          key={key}
          userFriendlyName={userFriendlyName}
          hover={this.state.hoverIndex === index}
          index={array.length - index}
          stat={stat}
          queues={this.props.queues}
          removeStat={this.removeStat}
          readyState={this.props.readyState}
        />
      </div>
    );
  };

  render() {
    return (
      <div id="agent-stats" style={this.styles.statsContainer}>
        {this.props.toolbarStats.map(this.generateStat)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    toolbarStats: selectToolbarStats(state, props),
    availableStats: selectAvailableStats(state, props),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deactivateToolbarStat: (stat) => dispatch(deactivateToolbarStat(stat)),
    dispatch,
  };
}

AgentStats.propTypes = {
  toolbarStats: PropTypes.array,
  availableStats: PropTypes.object,
  queues: PropTypes.array,
  deactivateToolbarStat: PropTypes.func.isRequired,
  readyState: PropTypes.string.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(AgentStats))
);
