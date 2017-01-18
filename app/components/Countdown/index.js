/**
*
* Countdown
*
*/

import React, { PropTypes } from 'react';

class Countdown extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    const secondsRemaining = parseInt((this.props.countdownUntil.getTime() - new Date().getTime()) / 1000, 10);
    this.state = { secondsRemaining };
    this.tick = this.tick.bind(this);
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div id={this.props.id}>{this.state.secondsRemaining}</div>
    );
  }
}

Countdown.propTypes = {
  countdownUntil: PropTypes.instanceOf(Date).isRequired,
  id: PropTypes.string.isRequired,
};

export default Countdown;
