/**
*
* Progress
*
*/

import React from 'react';

import PropTypes from 'prop-types';

import Radium from 'radium';

export class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: Date.now(),
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.update();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.requestAnimationId);
  }

  update() {
    this.setState({
      current: Date.now(),
    });
    this.requestAnimationId = requestAnimationFrame(this.update);
  }

  getBarStyle() {
    const progressDecimal = Math.min((this.props.start - this.state.current) / (this.props.start - this.props.finish), 1);
    return {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${progressDecimal * 100}px`,
      stroke: this.props.barColor,
    };
  }

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
  finish: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  barColor: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default Radium(Progress);
