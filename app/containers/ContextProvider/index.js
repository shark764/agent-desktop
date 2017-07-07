/*
 *
 * ContextProvider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

export class ContextProvider extends React.Component { // eslint-disable-line react/prefer-stateless-function

  getChildContext() {
    let toolbarMode = false;

    if (window.location.pathname === '/toolbar') {
      toolbarMode = true;
    }

    return {
      toolbarMode,
    };
  }

  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


ContextProvider.childContextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ContextProvider;
