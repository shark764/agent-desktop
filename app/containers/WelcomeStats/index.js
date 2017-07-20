/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * WelcomeStats
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import ErrorBoundary from 'components/ErrorBoundary';

import IconSVG from 'components/IconSVG';
import StatValue from 'components/Stat/StatValue';

import { selectWelcomeStats } from 'containers/Toolbar/selectors';

import messages from './messages';
import { statKey, stats as welcomeStatsConfig } from './welcomeStatsConfig';

export class WelcomeStats extends React.Component {
  styles = {
    welcome: {
      fontSize: '24px',
      color: '#50686E',
      lineHeight: '23px',
      position: 'relative',
      top: '25vh',
      height: '300px',
      margin: '50px',
      padding: '1em',
      borderRadius: '10px',
    },
    agentName: {
      display: 'block',
      position: 'relative',
      top: '0.5em',
      left: '1em',
      color: 'white',
    },
    statsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      width: '90%',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      top: '3em',
      lineHeight: '1.15em',
    },
    stat: {
      position: 'relative',
      top: '2em',
      left: '1em',
      fontSize: 'medium',
    },
    statVal: {
      position: 'relative',
      color: 'white',
      top: '1em',
    },
    statLeft: {
      order: '1',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statMid: {
      order: '3',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statRight: {
      order: '2',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statContainer: {
      order: '2',
      flexBias: '100%',
      height: '200px',
      width: '30%',
      margin: '0 auto',
    },
    statTitle: {
      fontWeight: 'bold',
      color: 'rgb(20, 119, 141)',
    },
    loadingIcon: {
      height: '20px',
      position: 'relative',
      top: '-5px',
    },
  };

  getStatBody = (filledStat) => {
    if (filledStat && (filledStat.results || filledStat.isErrored)) {
      return <StatValue stat={filledStat} />;
    } else {
      return this.getLoadingIcon();
    }
  };

  getStatDisplay = (stat, index) =>
    (<div
      style={[this.styles.statContainer, { order: index }]}
      key={stat[statKey]}
    >
      <div style={this.styles.statTitle}>
        <FormattedMessage {...messages[stat[statKey]]} />
      </div>
      <div style={this.styles.statVal}>
        {this.getStatBody(this.props.welcomeStats[stat[statKey]])}
      </div>
    </div>);

  getLoadingIcon = () =>
    (<IconSVG
      style={this.styles.loadingIcon}
      id="loadingIcon"
      name="loadingWhite"
    />);

  render() {
    return (
      <div style={this.styles.welcome}>
        <span style={this.styles.statTitle}>
          <FormattedMessage {...messages.welcome} />
        </span>
        <span style={this.styles.agentName}>
          {this.props.agent.firstName} {this.props.agent.lastName}
        </span>
        <div id="statContainer" style={this.styles.statsContainer}>
          {welcomeStatsConfig.map(this.getStatDisplay)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  welcomeStats: selectWelcomeStats(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

WelcomeStats.propTypes = {
  agent: PropTypes.object.isRequired,
  welcomeStats: PropTypes.object.isRequired,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(WelcomeStats))
);
