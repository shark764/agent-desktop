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

import ErrorBoundary from 'components/ErrorBoundary';

import {
  DEFAULT_TOOLBAR_WIDTH,
  DEFAULT_TOOLBAR_HEIGHT,
} from 'containers/AgentDesktop/constants';

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

import { mappedLocales } from 'i18n';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { setNonCriticalError, dismissError } from 'containers/Errors/actions';
import {
  requiredPermissions,
  crmPermissions,
} from 'containers/App/permissions';
import {
  selectAgentDesktopMap,
  selectCrmModule,
} from 'containers/AgentDesktop/selectors';
import selectLogin from './selectors';
import messages from './messages';
import {
  setInitiatedStandalonePopup,
  setLoading,
  errorOccurred,
  loginSuccess,
  resetPassword,
  setTenant,
  setDisplayState,
} from './actions';
import { CX_LOGIN, SSO_LOGIN, FORGOT_PASSWORD } from './constants';
const storage = window.localStorage;

const styles = {
  base: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 550px 1fr 1fr',
    gridTemplateRows: '1fr 540px 1fr',
    gridTemplateAreas: `
      "    .      .        .       .       . "
      "    .      .      main      .       . "
      " locale  legal    legal   legal     . "
    `,
    backgroundColor: '#072931',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    color: '#494949',
  },
  dialogContentContainer: {
    padding: '50px 50px 30px',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 4fr',
    gridTemplateColumns: '100%',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'center',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignItems: 'center',
  },
  toolbarBase: {
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 540px 1fr',
    gridTemplateAreas: `
      " standalonePopup "
      "      main       "
      "     locale      "
    `,
    backgroundColor: '#FFFFFF',
  },
  content: {
    gridArea: 'main',
    justifySelf: 'stretch',
  },
  contentTitle: {
    paddingBottom: '23px',
  },
  logo: {
    width: '275px',
    margin: 'auto',
  },
  usernameInput: {
    marginBottom: '11px',
  },
  rememberMe: {
    marginLeft: '-82px',
    marginBottom: '11px',
    marginTop: '15px',
    width: '200px',
  },
  actionButton: {
    marginTop: '34px',
  },
  ssoLink: {
    marginTop: '34px',
  },
  copyright: {
    gridArea: 'legal',
    alignSelf: 'end',
    width: '100%',
    marginBottom: '15px',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  copyrightText: {
    marginBottom: '1em',
    display: 'block',
  },
  legalText: {
    fontSize: '10px',
  },
  languageMenu: {
    position: 'relative',
    gridArea: 'locale',
    justifySelf: 'start',
    alignSelf: 'end',
    marginLeft: '1.4em',
    marginBottom: '1em',
  },
  languageDialog: {
    position: 'absolute',
    bottom: '38px',
    left: '-17px',
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
};

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: storage.getItem('email') || '',
      rememberEmail: storage.getItem('rememberEmail') === 'true',
      password: '',
      ssoEmail: storage.getItem('ssoEmail') || '',
      rememberSsoEmail: storage.getItem('rememberSsoEmail') === 'true',
      forgotPasswordEmail: storage.getItem('email') || '',
      tenantId: '-1',
      tenantName: '',
      showLanguage: false,
      identityWindowSuccessful: false,
    };
  }

  componentWillMount() {
    if (storage.getItem('login_type') === SSO_LOGIN) {
      window.location = '#sso';
      this.props.setDisplayState(SSO_LOGIN);
    } else if (storage.getItem('login_type') === CX_LOGIN) {
      this.props.setDisplayState(CX_LOGIN);
    }
  }

  // Login Logic

  componentDidMount() {
    const waitingOnSdk = setInterval(() => {
      if (CxEngage.subscribe) {
        CxEngage.subscribe(
          'cxengage/authentication',
          (error, topic, response) => {
            if (error) {
              this.props.setLoading(false);
              // Handled in App
            } else {
              switch (topic) {
                case 'cxengage/authentication/auth-info-response': {
                  CxEngage.authentication.popIdentityPage();
                  break;
                }
                case 'cxengage/authentication/cognito-auth-response': {
                  this.setState({ identityWindowSuccessful: true });
                  if (response) {
                    CxEngage.authentication.login(
                      {
                        token: response,
                      },
                      (cbError, cbTopic, cbResponse) => {
                        if (!cbError) {
                          console.log(
                            '[SSO-Login] CxEngage.subscribe()',
                            cbTopic,
                            cbResponse
                          );
                          this.loginCB(cbResponse, true);
                        } else {
                          this.props.errorOccurred();
                        }
                      }
                    );
                  }
                  break;
                }
                // This will fire when the window is closed by the agent
                // This will act as a CANCEL
                case 'cxengage/authentication/identity-window-response': {
                  // identityWindowSuccessful
                  // false = agent closed the window
                  // true = the window was closed due to a successful auth
                  if (!this.state.identityWindowSuccessful) {
                    this.props.setLoading(false);
                  }
                  break;
                }
                default: {
                  // Do Nothing
                }
              }
            }
          }
        );
        clearInterval(waitingOnSdk);
      }
    }, 200);
  }

  // REMOVE after sso is ready for everyone
  ssoFlag = () => window.location.href.indexOf('sso') > -1;

  loginWithSso = () => {
    this.props.setLoading(true);

    // We have to open this window in the onClick handler to prevent it from being a blocked popup
    // SDK proceeds uses this window with the name "cxengageSsoWindow"
    const ssoWindow = window.open(
      '',
      'cxengageSsoWindow',
      'width=500,height=500'
    );
    CxEngage.authentication.getAuthInfo(
      { username: this.state.ssoEmail },
      (error) => {
        if (error) {
          ssoWindow.close();
        }
      }
    );
  };

  onLogin = () => {
    this.props.setLoading(true);
    CxEngage.authentication.login(
      {
        username: this.state.email.trim(),
        password: this.state.password,
      },
      (error, topic, response) => {
        if (!error) {
          this.props.dismissError();
          console.log('[Login] CxEngage.subscribe()', topic, response);
          this.loginCB(response);
        } else {
          this.props.errorOccurred();
        }
      }
    );
  };

  loginCB = (agent, sso = false) => {
    this.props.loginSuccess(agent);
    const activeTenants = agent.tenants.filter((tenant) => tenant.tenantActive);
    if (activeTenants.length === 1) {
      if (sso) {
        this.props.setLoading(true);
      }
      this.setTenantId(activeTenants[0].tenantId, activeTenants[0].tenantName);
      this.onTenantSelect();
    } else if (activeTenants.length === 0) {
      this.props.setLoading(false);
      this.props.setNonCriticalError({ code: 'AD-1005' });
    } else {
      this.props.setLoading(false);
    }
    if (this.state.rememberEmail) {
      storage.setItem('email', this.state.email);
    } else {
      storage.setItem('email', '');
    }
    if (this.state.rememberSsoEmail) {
      storage.setItem('ssoEmail', this.state.ssoEmail);
    } else {
      storage.setItem('ssoEmail', '');
    }
  };

  onTenantSelect = () => {
    if (this.state.tenantId !== '-1') {
      const selectingTenant = this.props.agent.tenants.find(
        (tenant) => tenant.tenantId === this.state.tenantId
      );
      if (
        selectingTenant &&
        selectingTenant.tenantPermissions &&
        requiredPermissions.every((permission) =>
          selectingTenant.tenantPermissions.includes(permission)
        ) &&
        (this.context.toolbarMode ||
          (!this.context.toolbarMode &&
            crmPermissions.every((permission) =>
              selectingTenant.tenantPermissions.includes(permission)
            )))
      ) {
        this.props.setLoading(true);
        CxEngage.session.setActiveTenant(
          {
            tenantId: this.state.tenantId,
          },
          (error, topic, response) => {
            console.log('[Login] CxEngage.subscribe()', topic, response);
            if (!error) {
              this.props.setTenant(this.state.tenantId, this.state.tenantName);
            } else {
              this.props.errorOccurred();
            }
          }
        );
      } else {
        this.props.setNonCriticalError({ code: 'AD-1004' });
      }
    } else {
      this.props.setNonCriticalError({ code: 'AD-1003' });
    }
  };

  // TODO: Needs SDK call and reducer function when implemented
  sendForgotRequest = () => {
    this.props.resetPassword({ email: this.state.forgotPasswordEmail });
  };

  // Locale Update
  setLocalLocale = (locale) => {
    storage.setItem('locale', locale);
    window.location.reload();
  };

  // Standalone Popup
  openStandalonePopup = () => {
    window.open(
      `${window.location.href}?standalonePopup=true`,
      'toolbar',
      `width=${DEFAULT_TOOLBAR_WIDTH},height=${DEFAULT_TOOLBAR_HEIGHT}`
    );
    this.props.setInitiatedStandalonePopup();
  };

  // Local Container State
  // TODO: Lift state into redux

  setPassword = (password) => {
    this.setState({ password });
  };

  setforgotPasswordEmail = (setforgotPasswordEmail) => {
    this.setState({ setforgotPasswordEmail });
  };

  setEmail = (email) => {
    this.setState({ email });
  };

  setSsoEmail = (ssoEmail) => {
    this.setState({ ssoEmail });
  };

  setRememberEmail = (rememberEmail) => {
    this.setState({ rememberEmail });
    storage.setItem('rememberEmail', rememberEmail);
  };

  setRememberSsoEmail = (rememberSsoEmail) => {
    this.setState({ rememberSsoEmail });
    storage.setItem('rememberSsoEmail', rememberSsoEmail);
  };

  setTenantId = (tenantId, tenantName) => {
    this.setState({ tenantId, tenantName });
  };

  toggleLanguageMenu = () => {
    this.setState({ showLanguage: !this.state.showLanguage });
  };

  // Display States

  showCxLogin = () => {
    storage.setItem('login_type', CX_LOGIN);
    this.props.setDisplayState(CX_LOGIN);
  };

  showSsoLogin = () => {
    storage.setItem('login_type', SSO_LOGIN);
    this.props.setDisplayState(SSO_LOGIN);
  };

  showForgotPassword = () => {
    this.props.setDisplayState(FORGOT_PASSWORD);
  };

  // Layout components
  // TODO: Break out into separate ui view components

  getLoginTitle = () => {
    const parts = window.location.hostname.split('.');
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
          style={styles.contentTitle}
        />
      );
    } else {
      return (
        <Title
          id={messages.welcome.id}
          text={messages.welcome}
          style={styles.contentTitle}
        />
      );
    }
  };

  getLoadingContent = () => (
    <div id="loginContainerDiv" style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <div style={styles.dialogContent}>
        <IconSVG id="loadingIcon" name="loading" width="100px" />
      </div>
    </div>
  );

  getLoggedInContent = () => {
    const tenantOptions = this.props.agent.tenants
      .filter((tenant) => tenant.tenantActive)
      .map((tenant) => ({
        value: tenant.tenantId,
        label: tenant.tenantName,
      }));
    return (
      <div id="TSContainerDiv" style={styles.dialogContentContainer}>
        <Logo style={styles.logo} />
        <div style={styles.dialogContent}>
          <Title
            id={messages.selectTenantMenu.id}
            text={messages.selectTenantMenu}
            style={styles.contentTitle}
          />
          <Select
            id="app.login.selectTennant.selectbox"
            style={{ width: '282px' }}
            value={this.state.tenantId}
            onChange={(e) => this.setTenantId(e.value || '-1', e.label || '')}
            options={tenantOptions}
            autoFocus
            clearable={false}
            placeholder={<FormattedMessage {...messages.selectTenant} />}
          />
          <Button
            id={messages.selectButton.id}
            type="primaryBlueBig"
            style={styles.actionButton}
            text={messages.selectButton}
            onClick={() => this.onTenantSelect()}
          />
        </div>
      </div>
    );
  };

  getLoginContent = () => (
    <div id="loginContainerDiv" style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <div style={styles.dialogContent}>
        {this.getLoginTitle()}
        <TextInput
          id={messages.username.id}
          autoFocus={!this.state.rememberEmail}
          key="username"
          style={styles.usernameInput}
          placeholder={messages.username}
          autocomplete="email"
          value={this.state.email}
          cb={this.setEmail}
        />
        <TextInput
          id={messages.password.id}
          autoFocus={this.state.rememberEmail}
          key="password"
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
          checked={this.state.rememberEmail}
          text={messages.rememberMe}
          cb={this.setRememberEmail}
        />
        <Button
          id={messages.signInButton.id}
          type="primaryBlueBig"
          style={styles.actionButton}
          text={messages.signInButton}
          onClick={() => this.onLogin()}
        />
        {this.ssoFlag() && (
          <A
            id={messages.ssoSignIn.id}
            style={styles.ssoLink}
            onClick={this.showSsoLogin}
            text={messages.ssoSignIn}
          />
        )}
        {/* Hide until we implement the feature
          <A id={messages.forgot.id} text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.showForgotPassword()} />
        */}
      </div>
    </div>
  );

  getSingleSignOnContent = () => (
    <div id="ssoContainer" style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <div style={styles.dialogContent}>
        <Title
          id={messages.ssoSignIn.id}
          text={messages.ssoSignIn}
          style={styles.contentTitle}
        />
        <div style={{ paddingBottom: '23px', textAlign: 'center' }}>
          <FormattedMessage {...messages.ssoSignInDescription} />
        </div>
        <TextInput
          id={messages.email.id}
          autoFocus
          key="email"
          placeholder={messages.email}
          autocomplete="email"
          value={this.state.ssoEmail}
          cb={this.setSsoEmail}
          onEnter={this.loginWithSso}
        />
        <CheckBox
          id={messages.rememberMe.id}
          style={styles.rememberMe}
          checked={this.state.rememberSsoEmail}
          text={messages.rememberMe}
          cb={this.setRememberSsoEmail}
        />
        <Button
          id={messages.nextButton.id}
          type="primaryBlueBig"
          style={styles.actionButton}
          text={messages.nextButton}
          onClick={this.loginWithSso}
        />
        <A
          id={messages.return2Login.id}
          style={styles.ssoLink}
          onClick={this.showCxLogin}
          text={messages.return2Login}
        />
      </div>
    </div>
  );

  getForgotContent = () => (
    <div style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <Title text={messages.forgot} style={styles.contentTitle} />
      <p style={{ width: '282px', textAlign: 'center' }}>
        {this.props.intl.formatMessage(messages.forgotInstructions)}
      </p>
      <TextInput
        key="email"
        style={{ marginBottom: '11px' }}
        placeholder={messages.email}
        autocomplete="email"
        value={this.state.forgotPasswordEmail}
        cb={this.setforgotPasswordEmail}
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
        onClick={this.showCxLogin}
      />
    </div>
  );

  getLanguageSelect = () => (
    <div style={styles.languageMenu}>
      <FontAwesomeIcon
        id="localeIcon"
        name="globe"
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
          id="locale"
          style={styles.languageSelect}
          value={this.props.locale}
          options={mappedLocales} // mappedLocales
          onChange={(e) => {
            this.props.changeLocale(e.value);
            this.setLocalLocale(e.value);
            this.toggleLanguageMenu();
          }}
          clearable={false}
          backspaceRemoves={false}
        />
      </PopupDialog>
    </div>
  );

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
    } else if (this.props.displayState === FORGOT_PASSWORD) {
      pageContent = this.getForgotContent();
    } else if (this.props.initiatedStandalonePopup) {
      pageContent = (
        <div style={styles.dialogContentContainer}>
          <Logo style={styles.logo} />
          <div style={{ textAlign: 'center' }}>
            <div>
              <FormattedMessage {...messages.toolbarHasBeenLaunched} />
            </div>
            <div>
              <FormattedMessage {...messages.youMayClose} />
            </div>
          </div>
        </div>
      );
    } else if (this.props.displayState === SSO_LOGIN) {
      pageContent = this.getSingleSignOnContent();
    } else {
      pageContent = this.getLoginContent();
    }

    // Mitel Branding Color Swap
    const parts = window.location.hostname.split('.');
    if (parts[0].indexOf('mitel') !== -1) {
      styles.base.backgroundColor = '#002855';
    }

    if (this.context.toolbarMode) {
      return (
        <div style={styles.toolbarBase}>
          {this.props.crmModule === 'none' &&
            !this.props.isStandalonePopup &&
            window.location.hash.indexOf('standalonePopup') === -1 &&
            !this.props.initiatedStandalonePopup && (
              <div style={{ gridArea: 'standalonePopup' }}>
                <div style={{ float: 'right', margin: '1em 1.4em 0 0' }}>
                  <FontAwesomeIcon
                    id="standalonePopupIcon"
                    name="window-restore"
                    style={{
                      color: 'gray',
                      cursor: 'pointer',
                      fontSize: '1.5em',
                    }}
                    onclick={this.openStandalonePopup}
                  />
                </div>
              </div>
            )}
          <div style={styles.content}>{pageContent}</div>
          {!this.props.initiatedStandalonePopup && this.getLanguageSelect()}
        </div>
      );
    } else {
      return (
        <div style={styles.base}>
          <Dialog style={styles.content}>{pageContent}</Dialog>
          {this.getLanguageSelect()}
          <div style={styles.copyright}>
            <div style={styles.copyrightText} id="serenova_copyright">
              <FormattedMessage {...messages.copyright} />
            </div>
            <div style={styles.legalText} id="serenova_legal">
              <FormattedMessage {...messages.legal} />
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, props) => ({
  ...selectLogin(state, props),
  locale: selectLocale()(state),
  crmModule: selectCrmModule(state, props),
  isStandalonePopup: selectAgentDesktopMap(state, props).get('standalonePopup'),
});

function mapDispatchToProps(dispatch) {
  return {
    setInitiatedStandalonePopup: () => dispatch(setInitiatedStandalonePopup()),
    resetPassword: (email) => dispatch(resetPassword(email)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    errorOccurred: () => dispatch(errorOccurred()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
    setDisplayState: (displayState) => dispatch(setDisplayState(displayState)),
    changeLocale: (locale) => dispatch(changeLocale(locale)),
    setNonCriticalError: (error) => dispatch(setNonCriticalError(error)),
    dismissError: () => dispatch(dismissError()),
    dispatch,
  };
}

Login.propTypes = {
  intl: intlShape.isRequired,
  setInitiatedStandalonePopup: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  errorOccurred: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  setDisplayState: PropTypes.func.isRequired,
  setNonCriticalError: PropTypes.func.isRequired,
  dismissError: PropTypes.func.isRequired,
  displayState: PropTypes.string,
  loading: PropTypes.bool,
  logged_in: PropTypes.bool,
  agent: PropTypes.object,
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
  crmModule: PropTypes.string,
  isStandalonePopup: PropTypes.bool,
  initiatedStandalonePopup: PropTypes.bool,
};

Login.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Login)))
);
