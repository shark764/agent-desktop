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
import { selectCrmModule } from 'containers/AgentDesktop/selectors';

import messages from './messages';
import { statKey, stats as welcomeStatsConfig } from './welcomeStatsConfig';

export class WelcomeStats extends React.Component {
  setStatsTopPosition = () => {
    if (this.context.toolbarMode) {
      if (this.props.crmModule === 'salesforce-lightning') {
        return '2em';
      }

      return '2.45em';
    }

    return '3em';
  };

  styles = {
    welcome: {
      fontSize: '24px',
      lineHeight: '23px',
      position: 'relative',
      top: this.context.toolbarMode ? 0 : '9%',
      height: this.context.toolbarMode ? 'inherit' : '300px',
      margin: this.context.toolbarMode ? '0 10px 10px' : '50px',
      padding: '1em',
      borderRadius: '10px',
      textAlign: this.context.toolbarMode ? 'center' : 'inherit',
    },
    greetingText: {
      fontWeight: 'bold',
      color: '#14778D',
    },
    agentName: {
      display: 'block',
      position: 'relative',
      top: '0.5em',
      left: this.context.toolbarMode ? 0 : '1em',
      color: 'white',
    },
    statsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: this.context.toolbarMode ? 'column' : 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      top: this.setStatsTopPosition(),
      lineHeight: '1.15em',
      borderRadius: '3px',
      boxShadow: 'inset rgba(0, 0, 0, .75) 0px 0px 10px -2px',
      padding: '0 1em',
    },
    stat: {
      position: 'relative',
      top: '2em',
      left: '1em',
      fontSize: 'medium',
    },
    statVal: {
      position: 'relative',
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: '35px',
    },
    statsSubHead: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#607b81',
      padding: '1.65em 0 2em',
      flex: this.context.toolbarMode ? '1' : '3 100%',
    },
    indivStats: {
      flexBias: '100%',
      height: this.context.toolbarMode ? '110px' : '95px',
      flex: 1,
      margin: '0 auto',
    },
    statTitle: {
      color: '#FFF',
      fontSize: '15px',
      fontWeight: 'normal',
    },
    loadingIcon: {
      display: 'inline-block',
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

  getStatDisplay = (stat, index) => (
    <div style={[{ order: index }, this.styles.indivStats]} key={stat[statKey]}>
      <div style={this.styles.statVal}>
        {this.getStatBody(this.props.welcomeStats[stat[statKey]])}
      </div>
      <div style={this.styles.statTitle}>
        <FormattedMessage {...messages[stat[statKey]]} />
      </div>
    </div>
  );

  getLoadingIcon = () => (
    <div style={this.styles.loadingIcon}>
      <IconSVG id="loadingIcon" name="loadingWhite" width="40px" />
    </div>
  );

  render() {
    return (
      <div style={this.styles.welcome}>
        <span style={this.styles.greetingText}>
          <FormattedMessage {...messages.welcome} />
        </span>
        <span style={this.styles.agentName}>
          {this.props.agent.firstName} {this.props.agent.lastName}
        </span>
        <div id="statContainer" style={this.styles.statsContainer}>
          <div style={this.styles.statsSubHead}>
            <FormattedMessage {...messages.performance} />
          </div>

          {welcomeStatsConfig.map(this.getStatDisplay)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  welcomeStats: selectWelcomeStats(state, props),
  crmModule: selectCrmModule(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

WelcomeStats.propTypes = {
  agent: PropTypes.object.isRequired,
  welcomeStats: PropTypes.object.isRequired,
  crmModule: PropTypes.string,
};

WelcomeStats.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(WelcomeStats))
);
