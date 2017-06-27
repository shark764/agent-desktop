/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Interaction
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Dotdotdot from 'react-dotdotdot';

import ErrorBoundary from 'components/ErrorBoundary';

import Icon from 'components/Icon';
import Timer from 'components/Timer';
import TimerMinutes from 'components/TimerMinutes';
import Progress from 'components/Progress';
import Button from 'components/Button';
import { cancelClickToDial } from 'containers/AgentDesktop/actions';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';
import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

import messages from './messages';

const styles = {
  base: {
    cursor: 'pointer',
    padding: '20px 16px 0 16px',
    borderRadius: '3px',
    height: '108px',
    width: '100%',
    borderBottom: '1px solid #141414',
    display: 'flex',
    justifyContent: 'stretch',
    backgroundColor: 'inherit',
  },
  pstnBase: {
    cursor: 'default',
  },
  pendingBase: {
    borderBottom: 'none',
    marginTop: '11px',
    backgroundColor: '#F3F3F3',
  },
  selectedBase: {
    backgroundColor: '#0B424E',
  },
  newInteractionBase: {
    height: '60px',
  },
  mainContainer: {
    marginLeft: '8px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '230px',
    pending: {
      maxWidth: '210px',
    },
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  from: {
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  previewText: {
    height: '36px',
    lineHeight: '18px',
    marginTop: '5px',
  },
  intentText: {
    color: '#979797',
    fontSize: '12px',
    marginTop: '11px',
    display: 'flex',
    flexDirection: 'column',
  },
  timer: {
    marginLeft: '3px',
    flexGrow: 0,
    flexShrink: 0,
  },
  iconContainer: {
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapupContainer: {
    height: '35px',
    marginTop: '7px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cancelInteractionBtn: {
    margin: '10px 0 0 auto',
    padding: '.25em .5em',
    maxWidth: '65px',
  },
  cancelInteractionInProgress: {
    opacity: '.75',
    pointerEvents: 'none',
    cursor: 'default',
  },
};

export class Interaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: Date.now(),
      ageSeconds: 0,
      msIntervalId: setInterval(() => {
        const ageSeconds = Math.round(
          (Date.now() - this.state.startTime) / 1000
        );
        if (
          this.props.status === 'wrapup' &&
          ageSeconds > this.props.wrapupTime
        ) {
          if (!this.props.awaitingDisposition) {
            CxEngage.interactions.endWrapup({
              interactionId: this.props.interactionId,
            });
            clearInterval(this.state.msIntervalId);
          }
        }
        this.setState({
          ageSeconds,
        });
      }, 1000),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.status !== nextProps.status ||
      this.props.previewText !== nextProps.previewText
    ) {
      this.setState({
        startTime: Date.now(),
        ageSeconds: 0,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.msIntervalId);
  }

  getRemainingSeconds = () => {
    switch (this.props.status) {
      case 'pending':
        return Math.max(
          Math.round((this.props.timeout - this.state.startTime) / 1000) -
            this.state.ageSeconds,
          0
        );
      default:
        if (this.state.ageSeconds < this.props.targetWrapupTime) {
          return this.props.targetWrapupTime - this.state.ageSeconds;
        } else if (this.state.ageSeconds < this.props.wrapupTime) {
          return this.props.wrapupTime - this.state.ageSeconds;
        } else {
          return 0;
        }
    }
  };

  getTimer = () => {
    switch (this.props.status) {
      case 'wrapup':
      case 'pending':
        return this.getRemainingSeconds();
      default:
        switch (this.props.channelType) {
          case 'sms':
          case 'messaging':
          case 'email':
            return <TimerMinutes seconds={this.state.ageSeconds} />;
          case 'voice':
          default:
            return <Timer />;
        }
    }
  };

  getTimerColor = () => {
    switch (this.props.status) {
      case 'pending':
        return '#23CEF5';
      case 'wrapup':
        if (
          this.props.targetWrapupTime &&
          this.state.ageSeconds >= this.props.targetWrapupTime
        ) {
          return '#FE4565';
        }
        return '#23CEF5';
      default:
        return 'white';
    }
  };

  getPreviewText = () => {
    if (this.props.status === 'wrapup') {
      return (
        <div style={[styles.wrapupContainer, { color: this.getTimerColor() }]}>
          <div>
            <FormattedMessage {...messages.wrapup} />
          </div>
          <div>
            <Progress
              start={
                this.state.ageSeconds < this.props.targetWrapupTime
                  ? this.state.startTime
                  : this.state.startTime + this.props.targetWrapupTime * 1000
              }
              finish={
                this.state.ageSeconds < this.props.targetWrapupTime
                  ? this.state.startTime + this.props.targetWrapupTime * 1000
                  : this.state.startTime + this.props.wrapupTime * 1000
              }
              barColor={this.getTimerColor()}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      );
    } else if (this.props.status === 'work-ended-pending-script') {
      return (
        <div style={[styles.previewText, { fontStyle: 'italic' }]}>
          <FormattedMessage {...messages.pendingScript} />
        </div>
      );
    } else {
      return (
        <Dotdotdot
          clamp={2}
          className="previewText"
          style={styles.previewText}
          title={this.props.previewText}
        >
          <p style={{ margin: 0 }} title={this.props.previewText}>
            {this.props.previewText}
          </p>
        </Dotdotdot>
      );
    }
  };

  cancelInteraction = (e) => {
    // adding this to prevent other events from bubbling up - namely the
    // event to start the interaction which sits on the same div as the button
    e.stopPropagation();
    this.props.cancelClickToDial(this.props.interactionId);
  };

  render() {
    if (this.props.status !== 'creating-new-interaction') {
      const pendingPSTN =
        this.props.activeExtension.type === 'pstn' &&
        this.props.status === 'pending' &&
        this.props.channelType === 'voice';
      const acceptMessage = pendingPSTN ? messages.PSTN : messages.accept;
      return (
        <div
          id={`${this.props.status}InteractionContainer-${this.props
            .interactionId}`}
          className={`${this.props.status}InteractionContainer`}
          style={[
            styles.base,
            this.props.selected && styles.selectedBase,
            this.props.status === 'pending' && styles.pendingBase,
            pendingPSTN && styles.pstnBase,
            this.props.isCanceled && styles.cancelInteractionInProgress,
          ]}
          key={this.props.interactionId}
          onClick={this.props.onClick}
          disabled={this.props.selected}
        >
          <div style={styles.iconContainer}>
            <Icon name={this.props.icon} />
          </div>
          <div
            style={[
              styles.mainContainer,
              styles.mainContainer[this.props.status],
            ]}
          >
            <div style={styles.headerContainer}>
              <div style={styles.from}>
                {this.props.from}
              </div>
              <div style={[styles.timer, { color: this.getTimerColor() }]}>
                {this.getTimer()}
              </div>
            </div>
            {this.getPreviewText()}
            {this.props.status === 'pending'
              ? <div style={styles.intentText}>
                <FormattedMessage {...acceptMessage} />
                {this.props.interactionDirection === 'outbound' &&
                    this.props.channelType === 'voice'
                    ? <Button
                      id="cancelInteractionBeforeActive"
                      type="primaryRed"
                      text={messages.cancelInteraction}
                      style={styles.cancelInteractionBtn}
                      onClick={this.cancelInteraction}
                    />
                    : undefined}
              </div>
              : undefined}
          </div>
        </div>
      );
    } else {
      return (
        <div
          id={`${this.props.status}InteractionContainer-${this.props
            .interactionId}`}
          className={`${this.props.status}InteractionContainer`}
          style={[
            styles.base,
            this.props.selected && styles.selectedBase,
            styles.newInteractionBase,
          ]}
          key={this.props.interactionId}
          onClick={this.props.onClick}
          disabled={this.props.selected}
        >
          <div style={styles.iconContainer} />
          <div
            style={[
              styles.mainContainer,
              styles.mainContainer[this.props.status],
            ]}
          >
            <div style={styles.headerContainer}>
              <div style={styles.from}>
                New Interaction
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

Interaction.propTypes = {
  interactionId: PropTypes.string,
  from: PropTypes.string,
  previewText: PropTypes.string,
  channelType: PropTypes.string,
  icon: PropTypes.string,
  timeout: PropTypes.number,
  targetWrapupTime: PropTypes.number,
  wrapupTime: PropTypes.number,
  status: PropTypes.oneOf([
    'pending',
    'active',
    'wrapup',
    'creating-new-interaction',
    'work-ended-pending-script',
  ]).isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  activeExtension: PropTypes.object.isRequired,
  isCanceled: PropTypes.bool,
  interactionDirection: PropTypes.string,
  cancelClickToDial: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
  activeExtension: selectActiveExtension(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    cancelClickToDial: (interactionId) =>
      dispatch(cancelClickToDial(interactionId)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(Interaction))
);
