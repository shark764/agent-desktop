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
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Dotdotdot from 'react-dotdotdot';

import ErrorBoundary from 'components/ErrorBoundary';

import Icon from 'components/Icon';
import Progress from 'components/Progress';
import Timer from 'components/Timer';
import TimerMinutes from 'components/TimerMinutes';
import CancelButton from 'containers/Interaction/CancelButton';
import InteractionIcon from 'containers/Interaction/InteractionIcon';

import { selectCrmModule } from 'containers/AgentDesktop/selectors';
import { selectActiveExtension } from 'containers/AgentStatusMenu/selectors';

import messages from './messages';

const TextOverflowEllipsis = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

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
    marginRight: '50px',
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
    cursor: 'default',
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
    paddingLeft: '8px',
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
  cancelInteractionInProgress: {
    opacity: '.75',
    pointerEvents: 'none',
  },
  hoverElement: {
    position: 'absolute',
    height: '88px',
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
    zIndex: '4',
    position: 'relative',
    bottom: '-16px',
  },
  hoverBox: {
    display: 'inline-block',
    backgroundColor: '#FFF',
    color: '#4B4B4B',
    borderRadius: '3px',
    boxShadow: '0 0 3px 0 rgba(0,0,0,0.17)',
    padding: '14px 28px',
    position: 'absolute',
    left: '7px',
    minWidth: '170px',
    maxWidth: '300px',
    whiteSpace: 'nowrap',
    zIndex: '3',
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
        this.setState((prevState) => {
          const ageSeconds = Math.round(
            (Date.now() - prevState.startTime) / 1000
          );
          return { ageSeconds };
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

  componentWillMount() {
    if (this.props.crmModule === 'zendesk') {
      CxEngage.zendesk.setVisibility({ visibility: true });
    } else if (this.props.crmModule === 'salesforce-classic') {
      CxEngage.salesforceClassic.setVisibility({ visibility: true });
    } else if (this.props.crmModule === 'salesforce-lightning') {
      CxEngage.salesforceLightning.isVisible((e, t, r) => {
        if (!r) {
          CxEngage.salesforceLightning.setVisibility({
            visibility: true,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.msIntervalId);
  }

  awaitingDisposition = (interaction) =>
    interaction.dispositionDetails &&
    interaction.dispositionDetails.forceSelect &&
    interaction.dispositionDetails.selected.length === 0;

  awaitingScript = (interaction) =>
    interaction.script !== undefined && !interaction.script.autoScriptDismiss;

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
          case 'work-item':
            return (
              <TimerMinutes timeSince={this.props.interaction.timeAccepted} />
            );
          case 'voice':
            return <Timer timeSince={this.props.interaction.timeAccepted} />;
          default: {
            return '';
          }
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
      return `${(remainingSeconds / this.props.targetWrapupTime) * 100}%`;
    } else {
      return `${(remainingSeconds /
        (this.props.wrapupTime - this.props.targetWrapupTime)) *
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

  getPreviewText = () => (
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

  getLabel = () => {
    if (this.props.status === 'creating-new-interaction') {
      if (this.context.toolbarMode) {
        return <Icon name="add_interaction" />;
      } else {
        return <FormattedMessage {...messages.newInteraction} />;
      }
    } else if (this.context.toolbarMode) {
      return <InteractionIcon interaction={this.props.interaction} />;
    } else {
      return <FormattedMessage {...messages.script} />;
    }
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

    const pendingSIP =
      this.props.activeExtension.type === 'sip' &&
      this.props.status === 'pending' &&
      this.props.interaction.channelType === 'voice';

    const acceptMessage =
      pendingPSTN || pendingSIP ? messages.PSTN : messages.accept;
    const acceptMessageTitle = this.props.intl.formatMessage(acceptMessage);
    return (
      <div
        id={`${this.props.status}InteractionContainer-${
          this.props.interaction.interactionId
        }`}
        className={`${this.props.status}InteractionContainer`}
        style={[
          styles.base,
          this.context.toolbarMode && styles.baseToolbar,
          this.props.selected && styles.selectedBase,
          this.props.status === 'pending' && styles.pendingBase,
          this.context.toolbarMode &&
            this.props.status === 'pending' &&
            styles.pendingBaseToolbar,
          (pendingPSTN || pendingSIP) && styles.pendingPstn,
          this.props.interaction.isCancellingInteraction &&
            styles.cancelInteractionInProgress,
        ]}
        key={this.props.interaction.interactionId}
        onClick={!(pendingPSTN || pendingSIP) ? this.props.onClick : null}
        onMouseOver={this.context.toolbarMode ? this.handleMouseOver : null}
        onFocus={this.context.toolbarMode ? this.handleMouseOver : null}
        onMouseLeave={this.context.toolbarMode ? this.handleMouseLeave : null}
        disabled={this.props.selected}
      >
        {this.context.toolbarMode && [
          this.props.status === 'wrapup' ||
            (this.props.status === 'work-ended-pending-script' && (
              <div
                key={`${this.props.interaction.interactionId}-timerBar`}
                style={[
                  styles.wrapUpTimerToolbar,
                  {
                    backgroundColor: this.getTimerColor(),
                    height: this.getTimerHeight(),
                  },
                ]}
              />
            )),
          this.props.status === 'wrapup' && (
            <div
              key={`${this.props.interaction.interactionId}-wrapupTimer`}
              style={[styles.wrapupToolbar, { color: this.getTimerColor() }]}
            >
              {this.getTimer()}
            </div>
          ),
        ]}
        {this.props.status === 'creating-new-interaction' ||
        this.props.status === 'script-only' ? (
            <div>
              <div style={styles.iconContainer} />
              <div style={[styles.mainContainer, { marginLeft: 0 }]}>
                <div style={styles.headerContainer}>
                  <div style={styles.from}>
                    {this.getLabel()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={styles.iconContainer}>
                <InteractionIcon interaction={this.props.interaction} />
              </div>
              {this.context.toolbarMode &&
              this.props.status !== 'wrapup' && (
                <div
                  style={[
                    styles.timerToolbar,
                    { color: this.getTimerColor() },
                  ]}
                >
                  {this.getTimer()}
                </div>
              )}
            </div>
          )}
        {!this.context.toolbarMode && (
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
            {this.props.status === 'pending' && (
              <div style={styles.intentText}>
                <TextOverflowEllipsis title={acceptMessageTitle}>
                  <FormattedMessage {...acceptMessage} />
                </TextOverflowEllipsis>
                <CancelButton interaction={this.props.interaction} />
              </div>
            )}
          </div>
        )}
        {this.state.hover && (
          <div style={styles.hoverElement}>
            <div
              style={[
                styles.hoverTriangle,
                this.props.status === 'pending' && { bottom: '-54px' },
              ]}
            />
            <div
              style={[
                styles.hoverBox,
                this.props.status === 'pending'
                  ? { bottom: '0px' }
                  : { top: '4px' },
              ]}
            >
              <p style={[styles.hoverBoxText, styles.hoverBoxTitle]}>
                {this.props.from}
              </p>
              {this.props.interaction.contact &&
                this.props.status === 'pending' &&
                this.props.interaction.channelType !== 'messaging' && (
                <p style={styles.hoverBoxText}>
                  {this.props.contactPoint}
                </p>
              )}
              {this.getDetails()}
              <CancelButton
                interaction={this.props.interaction}
                style={{
                  position: 'relative',
                  margin: '10px 0 auto 30%',
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Interaction.propTypes = {
  intl: PropTypes.object.isRequired,
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
  contactPoint: PropTypes.string,
  crmModule: PropTypes.string,
  interaction: PropTypes.shape({
    interactionId: PropTypes.string,
    timeout: PropTypes.number,
    channelType: PropTypes.string,
    isCancellingInteraction: PropTypes.bool,
    direction: PropTypes.string,
    contact: PropTypes.object,
    timeAccepted: PropTypes.number,
    wrapupStarted: PropTypes.number,
    status: PropTypes.string,
    initiatedByCurrentAgent: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = (state, props) => ({
  activeExtension: selectActiveExtension(state, props),
  crmModule: selectCrmModule(state, props),
});

Interaction.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  connect(mapStateToProps)(injectIntl(Radium(Interaction)))
);
