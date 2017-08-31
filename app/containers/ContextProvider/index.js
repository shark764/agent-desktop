/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * ContextProvider
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

export class ContextProvider extends React.Component {
  getChildContext() {
    return {
      toolbarMode: window.location.href.indexOf('tb2') !== -1,
    };
  }

  render() {
    return this.props.children;
  }
}

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

ContextProvider.childContextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ContextProvider;
