/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Loading
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

function LoadingText(props) {
  return (
    <div className="_2iwo">
      {props.withSquare ? (
        <div className="_2iwq">
          <div className="_2iwr" />
          <div className="_2iws" />
          <div className="_2iwt" />
          <div className="_2iwu" />
          <div className="_2iwv" />
          <div className="_2iww" />
          <div className="_2iwx" />
        </div>
      ) : (
        <div className="_2iwq">
          <div className="_2iwy" />
          <div className="_2iwz" />
          <div className="_2iw-" />
          <div className="_2iw_" />
          <div className="_2ix0" />
        </div>
      )}
    </div>
  );
}

LoadingText.propTypes = {
  withSquare: PropTypes.bool,
};

export default LoadingText;
