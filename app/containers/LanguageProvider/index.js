/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `serenova-client-strings/agent-desktop`)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { IntlProvider } from 'react-intl';
import { selectLocale } from './selectors';
import { changeLocale } from './actions';
const storage = window.localStorage;

export class LanguageProvider extends React.PureComponent {
  componentWillMount() {
    const locale = storage.getItem('locale');
    if (locale) {
      this.props.changeLocale(locale);
    }
  }

  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = createSelector(selectLocale(), locale => ({ locale }));

function mapDispatchToProps(dispatch) {
  return {
    changeLocale: locale => dispatch(changeLocale(locale)),
    dispatch,
  };
}

LanguageProvider.propTypes = {
  changeLocale: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageProvider);
