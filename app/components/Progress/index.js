/**
*
* Progress
*
*/

import React from 'react';

import Radium from 'radium';

export class Progress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeoutSeconds: Math.round((props.timeout.valueOf() - new Date().valueOf()) / 1000),
    };
  }

  getBarStyle() {
    const progressDecimal = Math.min((this.props.value * 1.05) / this.state.timeoutSeconds, 1);
    return {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${progressDecimal * 100}px`,
      transition: 'stroke-dashoffset 1s linear',
      stroke: this.props.value >= this.props.targetSeconds ? '#FE4565' : '#23CEF5',
    };
  }

  get

  render() {
    return (
      <div style={this.props.style}>
        <svg
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
        >
          <path
            d="M 1,1 L 99,1"
            strokeLinecap="round"
            stroke="#031417"
            strokeWidth="2"
            fillOpacity="0"
          />
          <path
            d="M 1,1 L 99,1"
            strokeLinecap="round"
            strokeWidth="2"
            fillOpacity="0"
            style={this.getBarStyle()}
          />
        </svg>
      </div>
    );
  }
}

Progress.propTypes = {
  value: React.PropTypes.number.isRequired,
  timeout: React.PropTypes.instanceOf(Date),
  targetSeconds: React.PropTypes.string,
  style: React.PropTypes.object,
};

export default Radium(Progress);
