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
      current: props.current,
      animationPending: true,
    };
  }

  animate() {
    if (this.state.animationPending) {
      this.setState({
        current: this.props.current - 1,
        animationPending: false,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.current === nextState.current || (nextState.current - nextProps.current) > 1) {
      this.setState({ animationPending: true });
    }
    if (nextProps.current === nextProps.start) {
      this.setState({
        current: nextProps.current,
        animationPending: true,
      });
    }
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate() {
    this.animate();
  }

  getBarStyle() {
    const progressDecimal = Math.min((this.props.start - this.state.current) / this.props.start, 1);
    return {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${progressDecimal * 100}px`,
      transition: 'stroke-dashoffset 1s linear',
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
  current: React.PropTypes.number.isRequired,
  start: React.PropTypes.number.isRequired,
  barColor: React.PropTypes.string,
  style: React.PropTypes.object,
};

export default Radium(Progress);
