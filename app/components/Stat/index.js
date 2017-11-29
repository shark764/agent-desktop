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

const styles = {
  statBox: {
    width: '104px',
    minWidth: '104px',
    maxWidth: '104px',
    height: '54px',
    paddingTop: '13px',
    position: 'relative',
  },
  statBoxHover: {
    boxShadow: 'inset 0 0 6px 1px rgba(0,0,0,0.34)',
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
  loadingIcon: {
    position: 'relative',
    top: '-5px',
    height: '15px',
    width: '15px',
    display: 'inline-block',
  },
  hoverElement: {
    position: 'absolute',
    bottom: '60px',
    zIndex: 2,
  },
  hoverBoxTriangle: {
    position: 'relative',
    zIndex: '2',
    width: '0px',
    height: '0px',
    left: '44px',
    borderWidth: '8px',
    borderStyle: 'solid',
    borderColor: '#FFF transparent transparent #FFF',
    borderImage: 'initial',
    transform: 'rotate(-134deg)',
    borderRadius: '3px',
    boxShadow: '-6px -6px 6px -4px rgba(0,0,0,0.29)',
  },
  hoverBox: {
    position: 'relative',
    zIndex: '2',
    bottom: '-9px',
    left: '3px',
    width: '130px',
    borderRadius: '8px',
    padding: '10px 13px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 6px 1px rgba(0,0,0,0.29)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
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
    right: '10px',
    top: '6px',
    fontSize: '12px',
    zIndex: '2',
    cursor: 'pointer',
    color: '#FFFFFF',
    ':hover': {
      color: '#ADD8E6',
    },
  },
  statRemoveNotReady: {
    color: '#000000',
  },
};

export class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  handleMouseOver = () => {
    if (!this.state.hover) {
      this.setState({ hover: true });
    }
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  render() {
    let source;

    switch (this.props.stat.statSource) {
      case 'resource-id':
        source = 'Agent';
        break;
      case 'queue-id': {
        const sourceData = this.props.queues.find(
          (queue) => queue.id === this.props.stat.queue
        );

        // in the event that a queue is disabled,
        // don't grab the name
        source =
          sourceData && sourceData.name ? (
            sourceData.name
          ) : (
            <FormattedMessage {...messages.disabledQueue} />
          );
        break;
      }
      case 'tenant-id':
        source = 'Tenant';
        break;
      default:
        console.warn('[Agent Desktop] Agent statistic has unknown source.');
    }

    let aggregate = this.props.stat.statAggregate;
    if (aggregate === 'avg') {
      aggregate = 'average';
    }
    aggregate = aggregate[0].toUpperCase() + aggregate.slice(1);

    return (
      <div
        className="stat-box"
        style={[
          styles.statBox,
          this.props.detailsPosition && this.state.hover && styles.statBoxHover,
        ]}
        onMouseEnter={this.handleMouseOver}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.detailsPosition &&
          this.state.hover && (
            <div
              style={[
                styles.hoverElement,
                this.props.detailsPosition === 'left' && { left: '-32px' },
              ]}
            >
              <div style={styles.hoverBox}>
                <div style={styles.hoverHeader}>
                  <FormattedMessage {...messages.source} />:
                </div>
                <div style={styles.hoverData}>{source}</div>
                <div style={styles.hoverHeader}>
                  <FormattedMessage {...messages.statistic} />:
                </div>
                <div style={styles.hoverData}>
                  {this.props.userFriendlyName}
                </div>
                <div style={styles.hoverHeader}>
                  <FormattedMessage {...messages.aggregate} />:
                </div>
                <div style={styles.hoverData}>{aggregate}</div>
              </div>
              <div
                style={[
                  styles.hoverBoxTriangle,
                  this.props.detailsPosition === 'left' && { left: '76px' },
                ]}
              />
            </div>
          )}
        {this.props.detailsPosition &&
          this.state.hover && (
            <span
              key={this.props.index}
              style={[
                styles.statRemove,
                this.props.readyState === 'notready' &&
                  styles.statRemoveNotReady,
              ]}
              onClick={() => {
                this.props.removeStat(this.props.stat);
              }}
            >
              <IconSVG id="closeStatIcon" name="close" width="10px" />
            </span>
          )}
        <div className="stat-value" style={styles.statValue}>
          {this.props.stat.results || this.props.stat.isErrored ? (
            <StatValue stat={this.props.stat} />
          ) : (
            <div id="loadingContainer" style={styles.loadingIcon}>
              <IconSVG id="loadingIcon" name="loadingWhite" />
            </div>
          )}
        </div>
        <div className="agent-stat" style={styles.statName}>
          {this.props.userFriendlyName}
        </div>
      </div>
    );
  }
}

Stat.propTypes = {
  userFriendlyName: PropTypes.string.isRequired,
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
  detailsPosition: PropTypes.oneOf([false, 'left', 'right']),
};

export default Radium(Stat);
