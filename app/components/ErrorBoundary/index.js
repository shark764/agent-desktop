/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * ErrorBoundary
 * A higher order component to wrap other components in to handle render and selector errors.
 * https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
 *
 */

import Raven from 'raven-js';
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

    componentDidCatch(error, info) {
      console.error(error, info);
      this.setState({ error });
      Raven.captureException(error, {
        extra: info,
      });
      this.props.setCriticalError();
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

  return connect(
    null,
    mapDispatchToProps
  )(ErrorBoundaryComponent);
}
