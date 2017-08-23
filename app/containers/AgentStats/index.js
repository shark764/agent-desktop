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

import Icon from 'components/Icon';

import { deactivateToolbarStat } from 'containers/Toolbar/actions';
import { selectToolbarStats } from 'containers/Toolbar/selectors';

import Stat from 'components/Stat';
import { selectAvailableStats } from './selectors';

const styles = {
  statsContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
    overflowX: 'hidden',
    paddingTop: '300px',
    marginTop: '-300px',
  },
  scrollStatsButton: {
    padding: '15px 0',
    zIndex: 2,
    cursor: 'pointer',
  },
  scrollStatsLeft: {
    marginRight: '-19px',
    borderRadius: '0 5px 5px 0',
  },
  scrollStatsRight: {
    marginLeft: '-19px',
    borderRadius: '5px 0 0 5px',
  },
  ready: {
    backgroundColor: '#072931',
    ':hover': {
      backgroundColor: '#093742',
    },
  },
  notReady: {
    backgroundColor: '#FE4565',
    ':hover': {
      backgroundColor: '#E43D5A',
    },
  },
  statsScrollContainer: {
    display: 'flex',
    overflowX: 'hidden',
    paddingTop: '300px',
    marginTop: '-300px',
  },
};

export class AgentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statsHiddenLeft: false,
      statsHiddenRight: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateScrollItems);
    this.updateScrollItems();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScrollItems);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.toolbarStats.length !== this.props.toolbarStats.length) {
      if (prevProps.toolbarStats.length < this.props.toolbarStats.length) {
        // Scroll to the left to see newly added stat
        this.statsScrollContainer.scrollLeft = 0;
      }
      this.updateScrollItems();
    }
  }

  removeStat = (stat) => {
    this.props.deactivateToolbarStat(stat);
  };

  updateScrollItems = () => {
    const scrollableWidth = this.statsScrollContainer.scrollWidth;
    const viewableWidth = this.statsScrollContainer.clientWidth;
    const scrollLeftPosition = this.statsScrollContainer.scrollLeft;

    if (scrollableWidth >= viewableWidth) {
      let statsHiddenLeft = false;
      let statsHiddenRight = false;
      if (scrollLeftPosition > 0) {
        statsHiddenLeft = true;
      }
      if (scrollLeftPosition + viewableWidth < scrollableWidth) {
        statsHiddenRight = true;
      }
      this.setState({ statsHiddenLeft, statsHiddenRight });
    }
  };

  scrollLeft = () => {
    this.statsScrollContainer.scrollLeft =
      this.statsScrollContainer.scrollLeft - 104;
    this.updateScrollItems();
  };

  scrollRight = () => {
    this.statsScrollContainer.scrollLeft =
      this.statsScrollContainer.scrollLeft + 104;
    this.updateScrollItems();
  };

  generateStat = (stat, index) => {
    const userFriendlyName = this.props.availableStats[stat.statOption]
      .userFriendlyName;
    let key;
    if (stat.statSource === 'queue-id') {
      key = stat.statOption + stat.statSource + stat.statAggregate + stat.queue;
    } else {
      key = stat.statOption + stat.statSource + stat.statAggregate;
    }
    const leftOfStatIsVisible =
      this.statsScrollContainer &&
      index * 104 >= this.statsScrollContainer.scrollLeft;
    const rightOfStatIsVisible =
      this.statsScrollContainer &&
      (index + 1) * 104 <=
        this.statsScrollContainer.scrollLeft +
          this.statsScrollContainer.clientWidth +
          1;

    return (
      <Stat
        key={key}
        userFriendlyName={userFriendlyName}
        stat={stat}
        index={index}
        queues={this.props.queues}
        removeStat={this.removeStat}
        readyState={this.props.readyState}
        canShowDetails={leftOfStatIsVisible && rightOfStatIsVisible}
      />
    );
  };

  render() {
    return (
      <div style={styles.statsContainer}>
        {this.state.statsHiddenLeft &&
          <div
            style={{
              paddingRight: '30px',
              marginRight: '-30px',
              background: `linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(0,0,0,${this
                .props.readyState === 'ready'
                ? '0.7'
                : '0.4'}) 100%)`,
              zIndex: 1,
              height: '100%',
            }}
          />}
        {this.state.statsHiddenLeft &&
          <div
            id="scrollStatsLeft"
            key="scrollStatsLeft"
            style={[
              styles.scrollStatsButton,
              styles.scrollStatsLeft,
              this.props.readyState === 'ready'
                ? styles.ready
                : styles.notReady,
            ]}
            onClick={this.scrollLeft}
          >
            <Icon
              name="caret_white"
              style={{
                display: 'block',
                transform: 'rotate(90deg)',
              }}
            />
          </div>}
        <div
          id="agent-stats"
          ref={(statsScrollContainer) => {
            this.statsScrollContainer = statsScrollContainer;
          }}
          style={styles.statsScrollContainer}
        >
          {this.props.toolbarStats.map(this.generateStat)}
        </div>
        {this.state.statsHiddenRight &&
          <div
            style={{
              paddingLeft: '30px',
              marginLeft: '-30px',
              background: `linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(0,0,0,${this
                .props.readyState === 'ready'
                ? '0.7'
                : '0.4'}) 100%)`,
              zIndex: 1,
              height: '100%',
            }}
          />}
        {this.state.statsHiddenRight &&
          <div
            id="scrollStatsRight"
            key="scrollStatsRight"
            style={[
              styles.scrollStatsButton,
              styles.scrollStatsRight,
              this.props.readyState === 'ready'
                ? styles.ready
                : styles.notReady,
            ]}
            onClick={this.scrollRight}
          >
            <Icon
              name="caret_white"
              style={{
                display: 'block',
                transform: 'rotate(-90deg)',
              }}
            />
          </div>}
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
