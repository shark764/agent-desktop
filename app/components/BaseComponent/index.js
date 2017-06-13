/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * BaseComponent
 *
 */

import Raven from 'raven-js';
import React from 'react';
import PropTypes from 'prop-types';

export class BaseComponent extends React.Component {

  constructor(props) {
    super(props);

    if (typeof props.setCriticalError !== 'function') {
      throw new Error('setCriticalError must be defined for BaseComponent');
    }

    const oldRender = this.render;
    this.render = () => {
      try {
        return oldRender.call(this);
      } catch (error) {
        console.error(`${Object.getPrototypeOf(this.constructor).name} render error`);
        console.error(error.stack);
        if (Raven.isSetup()) {
          Raven.captureException(error);
        }
        props.setCriticalError(null, error);
        return <div />;
      }
    };
  }
}

BaseComponent.propTypes = {
  setCriticalError: PropTypes.func.isRequired,
};

export default BaseComponent;
