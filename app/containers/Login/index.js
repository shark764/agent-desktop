/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * Login
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import BaseComponent from 'components/BaseComponent';
import { setCriticalError } from 'containers/Errors/actions';

import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import A from 'components/A';
import Select from 'components/Select';
import IconSVG from 'components/IconSVG';
import FontAwesomeIcon from 'components/FontAwesomeIcon';
import PopupDialog from 'components/PopupDialog';
import mitelFavicon from 'assets/favicons/mitel.png';
// import Radio from 'components/Radio';

import { mappedLocales } from 'i18n';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import selectLogin, { selectRefresh } from './selectors';
import messages from './messages';
import {
  loggingIn,
  loginError,
  loginSuccess,
  resetPassword,
  settingTenant,
  setTenant,
  tenantError,
} from './actions';
const storage = window.localStorage;

const styles = {
  base: {
    width: '100vw',
    height: '100vh',
    minHeight: '800px',
    backgroundColor: '#072931',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    color: '#494949',
    overflowY: 'auto',
  },
  center: {
    order: '0',
    flex: '0 0 auto',
    alignSelf: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'center',
  },
  error: {
    borderRadius: '3px 3px 0 0',
    backgroundColor: '#FE4565',
    width: '542px',
    color: '#FFFFFF',
    fontWeight: 'lighter',
    textAlign: 'center',
    paddingTop: '3px',
    paddingBottom: '3px',
    position: 'relative',
    top: '0px',
    marginBottom: '-27px',
    lineHeight: '1.5em',
  },
  errorTenant: {
    top: '-361.4px',
  },
  copyright: {
    width: '65vw',
    position: 'absolute',
    bottom: '1em',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  copyrightText: {
    marginBottom: '1em',
    display: 'block',
    position: 'relative',
  },
  legalText: {
    fontSize: '10px',
  },
  languageMenu: {
    position: 'absolute',
    left: '1.4em',
    bottom: '1em',
  },
  languageDialog: {
    position: 'fixed',
    bottom: '55px',
    left: '4px',
  },
  languageSelect: {
    width: '180px',
    top: '0',
    bottom: '10px',
    marginLeft: '10px',
    border: 'none',
  },
  languageIcon: {
    color: 'gray',
    ':hover': {
      color: '#f3f3f3',
      textShadow: '0px 1px 1px #ccc',
      cursor: 'pointer',
    },
  },
  usernameInput: {
    marginBottom: '11px',
  },
  rememberMe: {
    marginLeft: '-9.35em',
    marginBottom: '11px',
    marginTop: '15px',
    width: '130px',
  },
  actionButton: {
    marginTop: '34px',
  },
};

export class Login extends BaseComponent {
  constructor(props) {
    super(props);
    window.onbeforeunload = () => storage.removeItem('ADError'); // Prevent showing error on reload
    this.state = {
      username: storage.getItem('email') || '',
      password: '',
      email: storage.getItem('email') || '',
      remember: storage.getItem('remember') === 'true',
      requestingPassword: false,
      tenantId: '-1',
      tenantName: '',
      agentDirection: props.intl.formatMessage(messages.inbound),
      noTenant: false,
      showLanguage: false,
    };
  }

  componentWillMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    // keyCode 13 === ENTER KEY
    if (
      e.keyCode === 13 &&
      !this.props.loading &&
      !this.state.requestingPassword
    ) {
      if (
        this.props.logged_in &&
        this.props.agent &&
        this.props.agent.tenants.length > 1
      ) {
        this.onTenantSelect();
      } else {
        this.onLogin();
      }
    }
  };

  getLoginTitle = () => {
    const parts = location.hostname.split('.');
    if (parts[0].indexOf('mitel') !== -1) {
      document.title = 'Mitel'; // Change title to match

      // Set favicon
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = mitelFavicon;
      document.getElementsByTagName('head')[0].appendChild(link);
      // ------

      return (
        <Title
          id={messages.welcome.id}
          text={messages.welcomeNoProd}
          style={[{ paddingBottom: '23px', marginTop: '39px' }, styles.center]}
        />
      );
    } else {
      return (
        <Title
          id={messages.welcome.id}
          text={messages.welcome}
          style={[{ paddingBottom: '23px', marginTop: '39px' }, styles.center]}
        />
      );
    }
  };

  onLogin = () => {
    storage.removeItem('ADError');
    if (this.state.username.trim() !== '' && this.state.password !== '') {
      this.props.loggingIn();
      CxEngage.authentication.login(
        {
          username: this.state.username.trim(),
          password: this.state.password,
        },
        (error, topic, response) => {
          if (!error) {
            console.log('[Login] CxEngage.subscribe()', topic, response);
            this.loginCB(response);
          } else if (error.code === 3000) {
            this.handleError();
          }
        }
      );
    } else {
      this.handleError();
    }
  };

  onTenantSelect = () => {
    if (this.state.tenantId !== '-1') {
      this.props.settingTenant();
      CxEngage.session.setActiveTenant(
        {
          tenantId: this.state.tenantId,
        },
        (error, topic, response) => {
          console.log('[Login] CxEngage.subscribe()', topic, response);

          if (error !== null) {
            // General error check
            if (error.code === 2000) {
              this.props.tenantError(messages.noPermsError);
            }
          } else {
            this.props.setTenant(this.state.tenantId, this.state.tenantName);
          }
        }
      );
    } else {
      this.setState({ noTenant: true });
    }
  };

  setPassword = (password) => {
    this.setState({ password });
  };

  setEmail = (email) => {
    this.setState({ email });
  };

  setUser = (username) => {
    this.setState({ username });
  };

  setRemember = (remember) => {
    this.setState({ remember });
    storage.setItem('remember', remember);
  };

  getLoadingContent = () =>
    <div
      id="loginContainerDiv"
      style={Object.assign({}, styles.container, { justifyContent: 'center' })}
    >
      <Logo style={{ marginTop: '50px' }} width="275px" />
      <IconSVG id="loadingIcon" name="loading" style={{ marginTop: '50px' }} />
    </div>;

  getLoggedInContent = () => {
    const tenantOptions = this.props.agent.tenants.map((tenant) => ({
      value: tenant.tenantId,
      label: tenant.tenantName,
    }));
    return (
      <div
        id="TSContainerDiv"
        style={Object.assign({}, styles.container, {
          justifyContent: 'center',
        })}
      >
        {this.state.noTenant
          ? <span style={[styles.error]}>
            <FormattedMessage style={styles.center} {...messages.noTenant} />
          </span>
          : ''}
        {this.props.tenant_error
          ? <span id="tenantLoginError" style={[styles.error]}>
            <FormattedMessage
              style={styles.center}
              {...this.props.tenant_error_message}
            />
          </span>
          : ''}
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title
          id={messages.selectTenantMenu.id}
          text={messages.selectTenantMenu}
          style={[{ paddingBottom: '23px', marginTop: '39px' }, styles.center]}
        />
        <Select
          id={'app.login.selectTennant.selectbox'}
          style={{ width: '282px' }}
          value={this.state.tenantId}
          onChange={(e) => this.setTenantId(e.value || '-1', e.label || '')}
          options={tenantOptions}
          autoFocus
          clearable={false}
          placeholder={<FormattedMessage {...messages.selectTenant} />}
        />
        {
          // Inbound / Outbound Select
          // <Radio key={'direction-select'} style={{ marginTop: '20px' }} autocomplete="email" value={this.state.agentDirection} cb={this.setDirection} options={[messages.inbound, messages.outbound]} />
        }
        <Button
          id={messages.selectButton.id}
          type="primaryBlueBig"
          style={styles.actionButton}
          text={messages.selectButton}
          onClick={() => this.onTenantSelect()}
        />
      </div>
    );
  };

  getErrors = () => {
    const error = storage.getItem('ADError');
    let errorSpan;
    if (this.props.login_error) {
      errorSpan = (
        <span id={messages.error.id} style={[styles.error]}>
          <FormattedMessage style={styles.center} {...messages.error} />
        </span>
      );
    } else if (error !== null) {
      switch (error) {
        case 'reasonListError':
          errorSpan = (
            <span id={`${error}:ERROR`} style={[styles.error]}>
              <FormattedMessage
                style={styles.center}
                {...messages.reasonListError}
              />
            </span>
          );
          break;
        case 'configLoadFailed':
          errorSpan = (
            <span id={`${error}:ERROR`} style={[styles.error]}>
              <FormattedMessage
                style={styles.center}
                {...messages.configLoadFailed}
              />
            </span>
          );
          break;
        default:
          errorSpan = (
            <span id={`${error}:ERROR`} style={[styles.error]}>
              <FormattedMessage
                style={styles.center}
                {...messages.generalError}
              />
            </span>
          );
          break;
      }
    }
    return errorSpan;
  };

  getLoginContent = () =>
    <div
      id="loginContainerDiv"
      style={Object.assign({}, styles.container, { justifyContent: 'center' })}
    >
      {this.props.tenant_error
        ? <span id="tenantLoginError" style={[styles.error]}>
          <FormattedMessage
            style={styles.center}
            {...this.props.tenant_error_message}
          />
        </span>
        : ''}
      <Logo style={{ marginTop: '50px' }} width="275px" />
      {this.getLoginTitle()}
      <TextInput
        id={messages.username.id}
        autoFocus={!this.state.remember}
        key={'username'}
        style={styles.usernameInput}
        placeholder={messages.username}
        autocomplete="email"
        value={this.state.username}
        cb={this.setUser}
      />
      <TextInput
        id={messages.password.id}
        autoFocus={this.state.remember}
        key={'password'}
        type="password"
        placeholder={messages.password}
        autocomplete="password"
        value={this.state.password}
        cb={this.setPassword}
        onEnter={this.onLogin}
      />
      <CheckBox
        id={messages.rememberMe.id}
        style={styles.rememberMe}
        checked={this.state.remember}
        text={messages.rememberMe}
        cb={this.setRemember}
      />
      <Button
        id={messages.signInButton.id}
        type="primaryBlueBig"
        style={styles.actionButton}
        text={messages.signInButton}
        onClick={() => this.onLogin()}
      />
      {/* Hide until we implement the feature
        <A id={messages.forgot.id} text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.setRequestingPassword()} />
      */}
    </div>;

  getForgotContent = () =>
    <div
      style={Object.assign({}, styles.container, { justifyContent: 'center' })}
    >
      <Logo style={{ marginTop: '50px' }} width="275px" />
      <Title
        text={messages.forgot}
        style={[{ paddingBottom: '23px', marginTop: '39px' }, styles.center]}
      />
      <p style={{ width: '282px', textAlign: 'center' }}>
        {this.props.intl.formatMessage(messages.forgotInstructions)}
      </p>
      <TextInput
        key={'email'}
        style={{ marginBottom: '11px' }}
        placeholder={messages.email}
        autocomplete="email"
        value={this.state.email}
        cb={this.setEmail}
      />
      <Button
        type="primaryBlueBig"
        style={{ marginTop: '34px' }}
        text={messages.sendButton}
        onClick={this.sendForgotRequest}
      />
      <A
        text={messages.return2Login}
        style={{ marginTop: '17px' }}
        onClick={this.unsetRequestingPassword}
      />
    </div>;

  setRequestingPassword = () => {
    this.setState({ requestingPassword: true });
  };

  setTenantId = (tenantId, tenantName) => {
    this.setState({ tenantId, tenantName });
  };

  setDirection = (agentDirection) => {
    this.setState({ agentDirection });
  };

  handleError = () => {
    this.props.loginError();
  };

  unsetRequestingPassword = () => {
    this.setState({ requestingPassword: false });
  };

  sendForgotRequest = () => {
    this.props.resetPassword({ email: this.state.email });
  };

  loginCB = (agent) => {
    this.props.loginSuccess(agent);
    if (agent.tenants.length === 1) {
      this.setTenantId(agent.tenants[0].tenantId, agent.tenants[0].tenantName);
      this.onTenantSelect();
    }
    if (this.state.remember) {
      storage.setItem('name', `${agent['first-name']}, ${agent['last-name']}`);
      storage.setItem('email', agent.username);
      storage.setItem('remember', true);
    } else {
      storage.setItem('name', '');
      storage.setItem('email', '');
      storage.setItem('remember', false);
    }
  };

  setLocalLocale = (locale) => {
    storage.setItem('locale', locale);
  };

  toggleLanguageMenu = () => {
    this.setState({ showLanguage: !this.state.showLanguage });
  };

  render() {
    let pageContent;
    if (this.props.loading) {
      pageContent = this.getLoadingContent();
    } else if (
      this.props.logged_in &&
      this.props.agent &&
      this.props.agent.tenants.length > 1
    ) {
      pageContent = this.getLoggedInContent();
    } else if (this.state.requestingPassword) {
      pageContent = this.getForgotContent();
    } else {
      pageContent = this.getLoginContent();
    }

    // Mitel Branding Color Swap
    const parts = location.hostname.split('.');
    if (parts[0].indexOf('mitel') !== -1) {
      styles.base.backgroundColor = '#002855';
    }

    return (
      <div
        style={[
          styles.base,
          this.props.refreshRequired &&
            location.hostname !== 'localhost' &&
            location.hostname !== '127.0.0.1'
            ? { height: 'calc(100vh - 2em)' }
            : { height: '100vh' },
        ]}
      >
        <div
          style={Object.assign({}, styles.container, {
            height: this.props.refreshRequired &&
              location.hostname !== 'localhost' &&
              location.hostname !== '127.0.0.1'
              ? 'calc(100vh - 2em)'
              : '100vh',
            minHeight: '800px',
          })}
        >
          {this.getErrors()}
          <Dialog style={styles.center}>
            {pageContent}
          </Dialog>
          <div style={styles.languageMenu}>
            <FontAwesomeIcon
              id={'localeIcon'}
              name={'globe'}
              style={styles.languageIcon}
              onclick={this.toggleLanguageMenu}
            />
            <PopupDialog
              style={styles.languageDialog}
              isVisible={this.state.showLanguage}
              hide={this.toggleLanguageMenu}
              widthPx={200}
              arrowLeftOffsetPx={14}
            >
              <Select
                id={'locale'}
                style={styles.languageSelect}
                value={this.props.locale}
                options={mappedLocales}
                onChange={(e) => {
                  this.props.changeLocale(e.value);
                  this.setLocalLocale(e.value);
                  this.toggleLanguageMenu();
                }}
                autoFocus
                clearable={false}
              />
            </PopupDialog>
          </div>
          <div style={styles.copyright}>
            <div style={styles.copyrightText}>
              <FormattedMessage {...messages.copyright} />
            </div>
            <div style={styles.legalText}>
              <FormattedMessage {...messages.legal} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  ...selectLogin(state, props),
  refreshRequired: selectRefresh(state, props),
  locale: selectLocale()(state),
});

function mapDispatchToProps(dispatch) {
  return {
    setCriticalError: () => dispatch(setCriticalError()),
    resetPassword: (email) => dispatch(resetPassword(email)),
    loggingIn: () => dispatch(loggingIn()),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    loginError: () => dispatch(loginError()),
    settingTenant: () => dispatch(settingTenant()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
    tenantError: (error) => dispatch(tenantError(error)),
    changeLocale: (locale) => dispatch(changeLocale(locale)),
    dispatch,
  };
}

Login.propTypes = {
  intl: intlShape.isRequired,
  resetPassword: PropTypes.func.isRequired,
  loggingIn: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  loginError: PropTypes.func.isRequired,
  settingTenant: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  login_error: PropTypes.bool,
  logged_in: PropTypes.bool,
  agent: PropTypes.object,
  tenant_error_message: PropTypes.object,
  tenant_error: PropTypes.bool,
  tenantError: PropTypes.func.isRequired,
  refreshRequired: PropTypes.bool.isRequired,
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Radium(Login))
);
