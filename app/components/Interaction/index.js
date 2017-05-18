/**
*
* Interaction
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Dotdotdot from 'react-dotdotdot';

import Icon from 'components/Icon';
import Timer from 'components/Timer';
import TimerMinutes from 'components/TimerMinutes';
import Progress from 'components/Progress';

import { selectAwaitingDisposition } from 'containers/AgentDesktop/selectors';

import messages from './messages';

export class Interaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: Date.now(),
      ageSeconds: 0,
      msIntervalId: setInterval(
        () => {
          const ageSeconds = Math.round((Date.now() - this.state.startTime) / 1000);
          if (this.props.status === 'wrapup' && (ageSeconds > this.props.wrapupTime)) {
            if (!this.props.awaitingDisposition) {
              CxEngage.interactions.endWrapup({ interactionId: this.props.interactionId });
              clearInterval(this.state.msIntervalId);
            }
          }
          this.setState({
            ageSeconds,
          });
        }, 1000
      ),
    };
  }

  getRemainingSeconds() {
    switch (this.props.status) {
      case 'pending':
        return Math.max(Math.round((this.props.timeout - this.state.startTime) / 1000) - this.state.ageSeconds, 0);
      default:
        if (this.state.ageSeconds < this.props.targetWrapupTime) {
          return (this.props.targetWrapupTime - this.state.ageSeconds);
        } else if (this.state.ageSeconds < this.props.wrapupTime) {
          return (this.props.wrapupTime - this.state.ageSeconds);
        } else {
          return 0;
        }
    }
  }

  resetAge() {
    this.setState({
      startTime: Date.now(),
      ageSeconds: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== nextProps.status || this.props.previewText !== nextProps.previewText) {
      this.resetAge();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.msIntervalId);
  }

  pulseKeyframes = Radium.keyframes({
    '0%': { opacity: '0', transform: 'translate(0, -10px)' },
    '100%': { opacity: '1', transform: 'translate(0, -25px)' },
  }, 'fadein');

  styles = {
    base: {
      cursor: 'pointer',
      padding: '20px 16px 0 16px',
      borderRadius: '3px',
      height: '100px',
      width: '100%',
      borderBottom: '1px solid #141414',
      display: 'flex',
      justifyContent: 'stretch',
    },
    pendingBase: {
      height: '123px',
      borderBottom: 'none',
      marginTop: '11px',
    },
    mainContainer: {
      marginLeft: '8px',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: this.props.status === 'pending' ? '210px' : '230px',
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
  };

  getBackgroundColor() {
    if (this.props.status === 'pending') {
      return '#F3F3F3';
    } else if (this.props.selected) {
      return '#0B424E';
    }
    return 'inherit';
  }

  getTimerColor() {
    switch (this.props.status) {
      case 'pending':
        return '#23CEF5';
      case 'wrapup':
        if (this.props.targetWrapupTime && (this.state.ageSeconds >= this.props.targetWrapupTime)) {
          return '#FE4565';
        }
        return '#23CEF5';
      default:
        return 'white';
    }
  }

  getTimer() {
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
  }

  render() {
    return (
      <div
        id={`${this.props.status}InteractionContainer-${this.props.interactionId}`}
        className={`${this.props.status}InteractionContainer`}
        style={[this.styles.base, { backgroundColor: this.getBackgroundColor() }, this.props.status === 'pending' ? this.styles.pendingBase : {}]}
        key={this.props.interactionId}
        onClick={this.props.onClick}
        disabled={this.props.selected}
      >
        <div style={this.styles.iconContainer}>
          <Icon name={this.props.icon} />
        </div>
        <div style={this.styles.mainContainer}>
          <div style={this.styles.headerContainer}>
            <div style={this.styles.from}>
              {this.props.from}
            </div>
            <div style={[this.styles.timer, { color: this.getTimerColor() }]}>
              {this.getTimer()}
            </div>
          </div>
          {this.props.status === 'wrapup'
            ? <div style={[this.styles.wrapupContainer, { color: this.getTimerColor() }]}>
              <div>
                <FormattedMessage {...messages.wrapup} />
              </div>
              <div>
                <Progress
                  start={this.state.ageSeconds < this.props.targetWrapupTime ? this.state.startTime : this.state.startTime + (this.props.targetWrapupTime * 1000)}
                  finish={this.state.ageSeconds < this.props.targetWrapupTime ? this.state.startTime + (this.props.targetWrapupTime * 1000) : this.state.startTime + (this.props.wrapupTime * 1000)}
                  barColor={this.getTimerColor()}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            : <Dotdotdot
              clamp={2}
              className="previewText"
              style={this.styles.previewText}
              title={this.props.previewText}
            >
              <p style={{ margin: 0 }} title={this.props.previewText}>{this.props.previewText}</p>
            </Dotdotdot>}
          {this.props.status === 'pending'
            ? <div style={this.styles.intentText}>
              <FormattedMessage {...messages.accept} />
            </div>
            : undefined
          }
        </div>
      </div>
    );
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
  status: PropTypes.oneOf(['pending', 'active', 'wrapup']).isRequired,
  awaitingDisposition: PropTypes.bool.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

const mapStateToProps = (state, props) => ({
  awaitingDisposition: selectAwaitingDisposition(state, props),
});

export default connect(mapStateToProps)(Radium(Interaction));
