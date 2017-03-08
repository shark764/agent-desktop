/**
*
* Interaction
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Countdown from 'components/Countdown';
import Icon from 'components/Icon';
import Timer from 'components/Timer';
import TimerMinutes from 'components/TimerMinutes';
import Progress from 'components/Progress';

import messages from './messages';

export class Interaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ageSeconds: 0,
      ageIncrementIntervalId: setInterval(
        () => {
          this.setState({ ageSeconds: this.state.ageSeconds + 1 });
        }, 1000
      ),
    };
  }

  resetAge() {
    window.clearInterval(this.state.ageIncrementIntervalId);
    this.setState({
      ageSeconds: 0,
      ageIncrementIntervalId: setInterval(
          () => {
            this.setState({ ageSeconds: this.state.ageSeconds + 1 });
          }, 1000
        ),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== nextProps.status || this.props.previewText !== nextProps.previewText) {
      this.resetAge();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.ageIncrementIntervalId);
  }

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
      overflow: 'hidden',
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
        if (this.state.ageSeconds >= this.props.targetWrapupSeconds) {
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
        return <Countdown id={`countdown-${this.props.interactionId}`} countdownUntil={new Date(this.props.timeout)} />;
      default:
        switch (this.props.channelType) {
          case 'sms':
          case 'messaging':
          case 'email':
            return <TimerMinutes seconds={this.state.ageSeconds} />;
          case 'voice':
          default:
            return <Timer format="mm:ss" />;
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
                  value={this.state.ageSeconds}
                  timeout={new Date(this.props.timeout)}
                  targetSeconds={this.props.targetWrapupSeconds}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            : <div
              className="previewText"
              style={this.styles.previewText}
              dangerouslySetInnerHTML={{ __html: this.props.previewText }}
            ></div>}
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
  interactionId: React.PropTypes.string,
  from: React.PropTypes.string,
  previewText: React.PropTypes.string,
  channelType: React.PropTypes.string,
  icon: React.PropTypes.string,
  timeout: React.PropTypes.number,
  status: React.PropTypes.oneOf(['pending', 'active', 'wrapup']).isRequired,
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  targetWrapupSeconds: React.PropTypes.string,
};

export default Radium(Interaction);
