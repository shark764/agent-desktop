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

import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

import messages from './messages';

const styles = {
  base: {
    cursor: 'pointer',
    padding: '20px 16px 0 16px',
    borderRadius: '3px',
    height: '108px',
    width: '283px',
    borderBottom: '1px solid #141414',
    display: 'flex',
    justifyContent: 'stretch',
    backgroundColor: 'inherit',
    position: 'relative',
    flexShrink: 0,
  },
  baseToolbar: {
    height: '89px',
    width: '72px',
    padding: '0 0 0 0',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  pendingPstn: {
    pointerEvents: 'none',
  },
  pendingBase: {
    borderBottom: 'none',
    backgroundColor: '#F3F3F3',
    color: '#4B4B4B',
  },
  pendingBaseToolbar: {
    backgroundColor: '#23CEF5',
    padding: '33px 16px 0 16px',
    ':hover': {
      backgroundColor: '#1FB8DC',
    },
  },
  selectedBase: {
    backgroundColor: '#0B424E',
  },
  mainContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '230px',
    marginLeft: '8px',
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
  timerToolbar: {
    marginTop: '7px',
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  wrapUpTimerToolbar: {
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '6px',
    transition: 'height 1s linear',
  },
  wrapupToolbar: {
    fontSize: '13px',
  },
  iconContainer: {
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
  },
  hoverElement: {
    position: 'absolute',
    left: '68px', // TODO: Improve hover action of element so that delete button can easily be accessed on hover
    top: 0,
  },
  hoverTriangle: {
    borderWidth: '8px',
    borderStyle: 'solid',
    borderColor: '#FFF transparent transparent #FFF',
    borderImage: 'initial',
    transform: 'rotate(-45deg)',
    borderRadius: '3px',
    boxShadow: '-6px -6px 6px -5px rgba(0,0,0,0.29)',
    width: '0px',
    height: '0px',
    zIndex: '3',
    position: 'relative',
    bottom: '-30px',
  },
  hoverBox: {
    backgroundColor: '#FFF',
    color: '#4B4B4B',
    borderRadius: '3px',
    boxShadow: '0 0 3px 0 rgba(0,0,0,0.17)',
    padding: '14px 28px',
    position: 'relative',
    left: '7px',
    minWidth: '140px',
    maxWidth: '300px',
    zIndex: '2',
  },
  hoverBoxText: {
    margin: '0',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  hoverBoxTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export class Interaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime:
        this.props.status === 'wrapup'
          ? this.props.interaction.wrapupStarted
          : Date.now(),
      ageSeconds:
        this.props.status === 'wrapup'
          ? Math.round(
              (Date.now() - this.props.interaction.wrapupStarted) / 1000
            )
          : 0,
      msIntervalId: setInterval(() => {
        const ageSeconds = Math.round(
          (Date.now() - this.state.startTime) / 1000
        );
        if (
          this.props.status === 'wrapup' &&
          ageSeconds > this.props.wrapupTime
        ) {
          if (!this.awaitingDisposition(this.props.interaction)) {
            CxEngage.interactions.endWrapup({
              interactionId: this.props.interaction.interactionId,
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
    if (this.props.status !== 'wrapup' && nextProps.status === 'wrapup') {
      this.setState({
        startTime: nextProps.interaction.wrapupStarted,
        ageSeconds: Math.round(
          (Date.now() - nextProps.interaction.wrapupStarted) / 1000
        ),
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.msIntervalId);
  }

  awaitingDisposition = (interaction) =>
    interaction.status === 'wrapup' &&
    interaction.dispositionDetails &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0;

  getRemainingSeconds = () => {
    switch (this.props.status) {
      case 'pending':
        return Math.max(
          Math.round(
            (this.props.interaction.timeout - this.state.startTime) / 1000
          ) - this.state.ageSeconds,
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
        switch (this.props.interaction.channelType) {
          case 'sms':
          case 'messaging':
          case 'email':
            return <TimerMinutes seconds={this.state.ageSeconds} />;
          case 'voice':
          default:
            return <Timer timeSince={this.props.interaction.timeAccepted} />;
        }
    }
  };

  getTimerColor = () => {
    switch (this.props.status) {
      case 'pending':
        return this.context.toolbarMode ? 'white' : '#23CEF5';
      case 'wrapup':
        if (
          this.props.targetWrapupTime &&
          this.state.ageSeconds >= this.props.targetWrapupTime
        ) {
          return '#FE4565';
        }
        return '#23CEF5';
      case 'work-ended-pending-script':
        return '#FE4565';
      default:
        return 'white';
    }
  };

  getTimerHeight = () => {
    // subtract one second from remaining seconds to account for CSS transition
    const remainingSeconds = this.getRemainingSeconds() - 1;

    if (this.props.status === 'work-ended-pending-script') {
      return '100%';
    } else if (this.state.ageSeconds < this.props.targetWrapupTime) {
      return `${remainingSeconds / this.props.targetWrapupTime * 100}%`;
    } else {
      return `${remainingSeconds /
        (this.props.wrapupTime - this.props.targetWrapupTime) *
        100}%`;
    }
  };

  getDetails = () => {
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
    } else if (this.props.status === 'script-only') {
      return (
        <div style={[styles.hoverBoxText, styles.hoverBoxTitle]}>
          <FormattedMessage {...messages.script} />
        </div>
      );
    } else if (this.props.status === 'creating-new-interaction') {
      return (
        <div style={[styles.hoverBoxText, styles.hoverBoxTitle]}>
          <FormattedMessage {...messages.newInteraction} />
        </div>
      );
    } else {
      return this.getPreviewText();
    }
  };

  getPreviewText = () =>
    <Dotdotdot
      clamp={2}
      className="previewText"
      style={styles.previewText}
      title={this.props.previewText}
    >
      <p style={{ margin: 0 }} title={this.props.previewText}>
        {this.props.previewText}
      </p>
    </Dotdotdot>;

  getLabel = () => {
    if (this.props.status === 'creating-new-interaction') {
      if (this.context.toolbarMode) {
        return <Icon name="add_interaction" />;
      } else {
        return <FormattedMessage {...messages.newInteraction} />;
      }
    } else if (this.context.toolbarMode) {
      return <Icon name={this.props.icon} />;
    } else {
      return <FormattedMessage {...messages.script} />;
    }
  };

  cancelInteraction = (e) => {
    // adding this to prevent other events from bubbling up - namely the
    // event to start the interaction which sits on the same div as the button
    e.stopPropagation();
    this.props.cancelClickToDial(this.props.interaction.interactionId);
  };

  handleMouseOver = () => {
    if (!this.state.hover) {
      this.setState({ hover: true });
    }
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  render() {
    const pendingPSTN =
      this.props.activeExtension.type === 'pstn' &&
      this.props.status === 'pending' &&
      this.props.interaction.channelType === 'voice';
    const acceptMessage = pendingPSTN ? messages.PSTN : messages.accept;
    return (
      <div
        id={`${this.props.status}InteractionContainer-${this.props.interaction
          .interactionId}`}
        className={`${this.props.status}InteractionContainer`}
        style={[
          styles.base,
          this.context.toolbarMode && styles.baseToolbar,
          this.props.selected && styles.selectedBase,
          this.props.status === 'pending' && styles.pendingBase,
          this.context.toolbarMode &&
            this.props.status === 'pending' &&
            styles.pendingBaseToolbar,
          pendingPSTN && styles.pendingPstn,
          this.props.interaction.isCancellingInteraction &&
            styles.cancelInteractionInProgress,
          { marginRight: '50px' },
        ]}
        key={this.props.interaction.interactionId}
        onClick={this.props.onClick}
        onMouseOver={this.context.toolbarMode ? this.handleMouseOver : null}
        onFocus={this.context.toolbarMode ? this.handleMouseOver : null}
        onMouseLeave={this.context.toolbarMode ? this.handleMouseLeave : null}
        disabled={this.props.selected}
      >
        {this.context.toolbarMode && [
          this.props.status === 'wrapup' ||
            (this.props.status === 'work-ended-pending-script' &&
              <div
                key={`${this.props.interaction.interactionId}-timerBar`}
                style={[
                  styles.wrapUpTimerToolbar,
                  {
                    backgroundColor: this.getTimerColor(),
                    height: this.getTimerHeight(),
                  },
                ]}
              />),
          this.props.status === 'wrapup' &&
            <div
              key={`${this.props.interaction.interactionId}-wrapupTimer`}
              style={[styles.wrapupToolbar, { color: this.getTimerColor() }]}
            >
              {this.getTimer()}
            </div>,
        ]}
        {this.props.status === 'creating-new-interaction' ||
        this.props.status === 'script-only'
          ? <div>
            <div style={styles.iconContainer} />
            <div style={[styles.mainContainer, { marginLeft: 0 }]}>
              <div style={styles.headerContainer}>
                <div style={styles.from}>
                  {this.getLabel()}
                </div>
              </div>
            </div>
          </div>
          : <div>
            <div style={styles.iconContainer}>
              <Icon name={this.props.icon} />
            </div>
            {this.context.toolbarMode &&
                this.props.status !== 'wrapup' &&
                <div
                  style={[styles.timerToolbar, { color: this.getTimerColor() }]}
                >
                  {this.getTimer()}
                </div>}
          </div>}
        {!this.context.toolbarMode &&
          <div style={styles.mainContainer}>
            <div style={styles.headerContainer}>
              <div style={styles.from}>
                {this.props.from}
              </div>
              <div style={[styles.timer, { color: this.getTimerColor() }]}>
                {this.getTimer()}
              </div>
            </div>
            {this.props.status !== 'creating-new-interaction' &&
              this.props.status !== 'script-only' &&
              this.getDetails()}
            {this.props.status === 'pending' &&
              <div style={styles.intentText}>
                <FormattedMessage {...acceptMessage} />
                {this.props.interaction.direction === 'outbound' &&
                  this.props.interaction.channelType === 'voice' &&
                  <Button
                    id="cancelInteractionBeforeActive"
                    type="primaryRed"
                    text={messages.cancelInteraction}
                    style={styles.cancelInteractionBtn}
                    onClick={this.cancelInteraction}
                  />}
              </div>}
          </div>}
        {this.state.hover &&
          <div style={styles.hoverElement}>
            <div style={styles.hoverTriangle} />
            <div style={styles.hoverBox}>
              {this.props.interaction.contact
                ? <div>
                  <p style={[styles.hoverBoxText, styles.hoverBoxTitle]}>
                    {this.props.from}
                  </p>
                  <p style={styles.hoverBoxText}>
                    {this.props.contactPoint}
                  </p>
                </div>
                : <p style={[styles.hoverBoxText, styles.hoverBoxTitle]}>
                  {this.props.from}
                </p>}
              {this.getDetails()}
              {this.context.toolbarMode &&
                this.props.interaction.direction === 'outbound' &&
                this.props.interaction.channelType === 'voice' &&
                <Button
                  id="cancelInteractionBeforeActive"
                  type="primaryRed"
                  text={messages.cancelInteraction}
                  style={Object.assign({}, styles.cancelInteractionBtn, {
                    position: 'relative',
                    marginLeft: '50%',
                  })}
                  onClick={this.cancelInteraction}
                />}
            </div>
          </div>}
      </div>
    );
  }
}

Interaction.propTypes = {
  from: PropTypes.string,
  previewText: PropTypes.string,
  icon: PropTypes.string,
  targetWrapupTime: PropTypes.number,
  wrapupTime: PropTypes.number,
  status: PropTypes.oneOf([
    'pending',
    'active',
    'wrapup',
    'creating-new-interaction',
    'work-ended-pending-script',
    'script-only',
  ]).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  activeExtension: PropTypes.object.isRequired,
  cancelClickToDial: PropTypes.func,
  contactPoint: PropTypes.string,
  interaction: PropTypes.shape({
    interactionId: PropTypes.string,
    timeout: PropTypes.number,
    channelType: PropTypes.string,
    isCancellingInteraction: PropTypes.bool,
    direction: PropTypes.string,
    contact: PropTypes.object,
    timeAccepted: PropTypes.number,
    wrapupStarted: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = (state, props) => ({
  activeExtension: selectActiveExtension(state, props),
});

Interaction.contextTypes = {
  toolbarMode: PropTypes.bool,
};

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
