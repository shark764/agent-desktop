/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* ErrorBoundary
* A higher order component to wrap other components in to handle render and selector errors.
* https://github.com/facebook/react/issues/2461#issuecomment-311077975
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setCriticalError } from 'containers/Errors/actions';

export default function ErrorBoundary(WrappedComponent) {
  class ErrorBoundaryComponent extends React.Component {
    constructor() {
      super();
      this.state = { error: null };
    }

    // eslint-disable-next-line camelcase
    unstable_handleError(error, info) {
      console.error(error, info);
      if (CxEngage !== undefined) {
        CxEngage.logging.error(error, info);
      }
      this.setState({ error });
      this.props.setCriticalError();
      // TODO send error and info to analytics
    }

    render() {
      if (this.state.error) {
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      setCriticalError: () => dispatch(setCriticalError()),
      dispatch,
    };
  }

  ErrorBoundaryComponent.propTypes = {
    setCriticalError: PropTypes.func.isRequired,
  };

  return connect(null, mapDispatchToProps)(ErrorBoundaryComponent);
}
