/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Stat
*
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Radium from 'radium';

import IconSVG from 'components/IconSVG';
import StatValue from './StatValue';
import messages from './messages';

function Stat(props) {
  const styles = {
    statBox: {
      width: '104px',
      height: '54px',
      paddingTop: '13px',
      ':hover': {
        boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.34)',
      },
    },
    statValue: {
      height: '19px',
      lineHeight: '19px',
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    statName: {
      width: '100%',
      padding: '0 4px',
      height: '10px',
      lineHeight: '10px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
    },
    loadingIcon: {
      position: 'relative',
      top: '-5px',
      height: '15px',
    },
    hoverBox: {
      position: 'absolute',
      bottom: '66px',
      right: `${((props.index - 1) * 104) + 19}px`,
      zIndex: '2',
      width: '166px',
      borderRadius: '8px',
      padding: '10px 13px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
    },
    hoverHeader: {
      fontSize: '14px',
      lineHeight: '20px',
      color: '#979797',
    },
    stat: {
      fontSize: '14px',
      lineHeight: '20px',
    },
    statRemove: {
      position: 'absolute',
      right: `${((props.index - 1) * 104) + 60}px`,
      bottom: '30px',
      fontSize: '12px',
      zIndex: '2',
      cursor: 'pointer',
      color: props.readyState === 'notready' ? '#000000' : '#FFFFFF',
      ':hover': {
        color: '#ADD8E6',
      },
    },
    hoverBoxTriangle: {
      position: 'absolute',
      width: '0px',
      height: '0px',
      right: `${((props.index - 1) * 104) + 95}px`,
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
  };

  let source;

  switch (props.stat.statSource) {
    case 'resource-id':
      source = 'Agent';
      break;
    case 'queue-id':
      source = props.queues.filter((queue) => queue.id === props.stat.queue)[0].name;
      break;
    case 'tenant-id':
      source = 'Tenant';
      break;
    default:
      console.warn('[Agent Desktop] Agent statistic has unknown source.');
  }

  let aggregate = props.stat.statAggregate;
  if (aggregate === 'avg') {
    aggregate = 'average';
  }
  aggregate = aggregate[0].toUpperCase() + aggregate.slice(1);

  return (
    <div className="stat-box" style={styles.statBox}>
      {props.hover ?
        <span>
          <div style={styles.hoverBox}>
            <div style={styles.hoverHeader}>
              <FormattedMessage {...messages.source} />:
            </div>
            <div style={styles.hoverData}>
              {source}
            </div>
            <div style={styles.hoverHeader}>
              <FormattedMessage {...messages.statistic} />:
            </div>
            <div style={styles.hoverData}>
              {props.userFriendlyName}
            </div>
            <div style={styles.hoverHeader}>
              <FormattedMessage {...messages.aggregate} />:
            </div>
            <div style={styles.hoverData}>
              {aggregate}
            </div>
          </div>
          <span style={styles.hoverBoxTriangle} />
          <span key={props.index} style={styles.statRemove} onClick={() => { props.removeStat(props.stat); }}>X</span>
        </span>
      : ''}
      <div className="stat-value" style={styles.statValue}>
        {(props.stat.results || props.stat.isErrored)
          ? <StatValue stat={props.stat} />
          : <div id="loadingContainer" style={styles.loading}>
            <IconSVG style={styles.loadingIcon} id="loadingIcon" name="loadingWhite" />
          </div>}
      </div>
      <div className="agent-stat" style={styles.statName}>
        {props.userFriendlyName}
      </div>
    </div>
  );
}

Stat.propTypes = {
  userFriendlyName: PropTypes.string.isRequired,
  hover: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  stat: PropTypes.shape({
    queue: PropTypes.string,
    statAggregate: PropTypes.string.isRequired,
    statSource: PropTypes.string.isRequired,
    results: PropTypes.object,
    isErrored: PropTypes.bool,
  }).isRequired,
  removeStat: PropTypes.func.isRequired,
  readyState: PropTypes.string.isRequired,
  queues: PropTypes.array.isRequired,
};

export default Radium(Stat);
