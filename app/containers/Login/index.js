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
import { has, pick } from 'lodash';

import signIn from 'assets/icons/fa_sign_in.png';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import ErrorBoundary from 'components/ErrorBoundary';

import {
  DEFAULT_TOOLBAR_WIDTH,
  DEFAULT_TOOLBAR_HEIGHT,
  REAUTH_POPUP_OPTIONS,
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
import LegalCopyright from 'components/LegalCopyright';

import { mappedLocales } from 'i18n';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import {
  setNonCriticalError,
  dismissError,
  handleSDKError,
} from 'containers/Errors/actions';
import {
  selectCriticalError,
  selectNonCriticalError,
} from 'containers/Errors/selectors';
import {
  requiredPermissions,
  crmPermissions,
} from 'containers/App/permissions';
import {
  selectAgentDesktopMap,
  selectCrmModule,
} from 'containers/AgentDesktop/selectors';
import { showLoginPopup } from 'containers/AgentDesktop/actions';
import selectLogin from './selectors';
import messages from './messages';
import {
  setInitiatedStandalonePopup,
  setLoading,
  errorOccurred,
  loginSuccess,
  setAccountTenants,
  resetPassword,
  setTenant,
  setDisplayState,
} from './actions';
import { CX_LOGIN, SSO_LOGIN } from './constants';

const storage = window.localStorage;

const styles = {
  base: {
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 550px 1fr 1fr',
    gridTemplateRows: '1fr 540px 1fr',
    gridTemplateAreas: `
      "    .      .        .       .       .    "
      "    .      .      main      .       .    "
      " locale  legal    legal   legal  privacy "
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
      " standalonePopup standalonePopup standalonePopup "
      "      main            main            main       "
      "     locale             .            privacy     "
    `,
    backgroundColor: '#FFFFFF',
  },
  content: {
    gridArea: 'main',
    justifySelf: 'stretch',
  },
  contentTitle: {
    paddingBottom: '23px',
    marginTop: '20px',
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
    textAlign: 'center',
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
  privacy: {
    gridArea: 'privacy',
    margin: '0 15px 15px 0',
    textAlign: 'right',
    alignSelf: 'end',
  },
  privacyLink: {
    color: '#FFFFFF',
  },
  privacyLinkToolbar: {
    color: '#494949',
  },
  reauthOption: {
    backgroundColor: '#ccc',
    backgroundImage: `url(${signIn})`,
    backgroundPosition: '5%',
    paddingLeft: '33px',
    marginLeft: '2%',
    borderBottom: '1px solid #000',
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
      savedTenant: storage.getItem('savedTenant')
        ? JSON.parse(storage.getItem('savedTenant'))
        : {},
      tenantId: '-1',
      tenantName: '',
      showLanguage: false,
      identityWindowSuccessful: false,
      expiredSessionReauth: storage.getItem(REAUTH_POPUP_OPTIONS)
        ? JSON.parse(storage.getItem(REAUTH_POPUP_OPTIONS))
        : {},
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

  componentWillReceiveProps(nextProps) {
    const reauthPassword = nextProps.loginPopup.get('reauthPassword');
    if (reauthPassword && reauthPassword.length) {
      this.setState(
        {
          password: reauthPassword,
        },
        () => {
          this.onLogin();
          this.props.showLoginPopup({
            reauthPassword: '',
            showLoginPopup: false,
          });
        }
      );
    }
  }

  // Login Logic
  componentDidMount() {
    const waitingOnSdk = setInterval(() => {
      // if we are re-logging in after an expired session, then skip the entire
      // reauth user flow and just log the user in
      if (this.isReauthFromExpiredSession()) {
        if (this.state.expiredSessionReauth.isSso === true) {
          this.loginWithSso();
        } else {
          this.props.showLoginPopup({
            showLoginPopup: true,
          });
        }
      }

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
                          const agentData = Object.assign({}, cbResponse, {
                            isSso: true,
                          });
                          this.loginCB(agentData);
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

    this.useDebugTokenExpiration();

    const username = this.isReauthFromExpiredSession()
      ? this.state.expiredSessionReauth.expiredSessionUsername
      : this.state.ssoEmail;

    // We have to open this window in the onClick handler to prevent it from being a blocked popup
    // SDK proceeds uses this window with the name "cxengageSsoWindow"
    const ssoWindow = window.open(
      '',
      'cxengageSsoWindow',
      'width=500,height=500'
    );
    CxEngage.authentication.getAuthInfo({ username }, (error) => {
      if (error) {
        storage.removeItem(REAUTH_POPUP_OPTIONS);
        ssoWindow.close();
      }
    });
  };

  // for the sake of testing the token expiration behavior, we can add
  // a "debugToken" query parameter to the url where we specify a number
  // of seconds until the token expires.
  // For example, to force the token to expire after 60 seconds, use this
  // URL: http://localhost:3000/?debugToken=60&desktop
  // NOTE: will ONLY work w/CxEngage logins for now, for sso debugging, need to
  // use hard-coded workarounds for testing (see example of that in AgentStatusMenu)
  useDebugTokenExpiration = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('debugToken')) {
      storage.setItem('debugTokenVal', params.get('debugToken'));
    } else {
      storage.removeItem('debugTokenVal');
    }
  };

  setLoginParams = (credentials) => {
    // if we have a valid debug token value...
    if (
      storage.getItem('debugTokenVal') &&
      typeof Number(storage.getItem('debugTokenVal')) === 'number'
    ) {
      // add ttl to the credentials
      return Object.assign({}, credentials, {
        ttl: Number(storage.getItem('debugTokenVal')),
      });
    }

    // otherwise, just return the credentials without changing anything
    return credentials;
  };

  onLogin = () => {
    this.props.setLoading(true);
    this.useDebugTokenExpiration();

    let username;
    if (this.isReauthFromExpiredSession()) {
      username = this.state.expiredSessionReauth.expiredSessionUsername;
    } else {
      username = this.state.email.trim();
    }

    const password = this.state.password;

    const loginCredentials = {
      username,
      password,
    };

    CxEngage.authentication.login(
      this.setLoginParams(loginCredentials),
      (error, topic, response) => {
        if (!error) {
          this.props.dismissError();
          console.log('[Login] CxEngage.subscribe()', topic, response);
          this.loginCB(response);
        } else {
          this.setState({
            expiredSessionReauth: {},
          });
          this.props.setLoading(false);
          this.props.errorOccurred();
          storage.removeItem(REAUTH_POPUP_OPTIONS);
        }
      }
    );
  };

  loginCB = (agent) => {
    CxEngage.session.getTenantDetails((error, topic, response) => {
      if (!error) {
        console.log(
          '[Login] CxEngage.session.getTenantDetails()',
          topic,
          response
        );

        response.details.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });

        this.props.setAccountTenants(response.details);
        let targetTenantData = {};

        if (this.isReauthFromExpiredSession()) {
          targetTenantData = this.state.expiredSessionReauth;
        } else if (Object.keys(this.state.savedTenant).length === 2) {
          targetTenantData = this.state.savedTenant;
        } else if (response.details.length) {
          if (response.details.length === 1) {
            targetTenantData = response.details[0];
          } else {
            targetTenantData = response.details.find(
              (val) => val.tenantId === this.state.tenantId
            );
          }
        }

        if (targetTenantData) {
          this.setTenantId(targetTenantData.tenantId, targetTenantData.name);
          this.onTenantSelect();

          storage.removeItem('savedTenant');
          storage.removeItem(REAUTH_POPUP_OPTIONS);
          this.setState({
            expiredSessionReauth: {},
          });
        } else if (response.details.length === 0) {
          this.props.setLoading(false);
          this.props.setNonCriticalError({ code: 'AD-1005' });
        } else {
          this.setTenantId('-1', '');
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
      }
    });

    this.props.loginSuccess(agent);

    if (!this.isReauthFromExpiredSession) {
      this.props.setLoading(false);
    }
  };

  onTenantSelect = () => {
    if (this.state.tenantId !== '-1') {
      const selectingTenant = this.props.agent.accountTenants.find(
        (tenant) => tenant.tenantId === this.state.tenantId
      );

      // if this tenant is not available to use without reauth,
      // store the tenant we will be logging into, and refresh the page
      if (selectingTenant && this.requiresReauth(selectingTenant)) {
        this.setRememberTenant(selectingTenant);

        if (selectingTenant.password) {
          this.showCxLogin();
        } else {
          this.showSsoLogin();
        }

        window.location.reload();
        return;
      }

      const fullTenantData = this.props.agent.tenants.find(
        (tenant) => tenant.tenantId === selectingTenant.tenantId
      );

      if (
        fullTenantData &&
        fullTenantData.tenantPermissions &&
        requiredPermissions.every((permission) =>
          fullTenantData.tenantPermissions.includes(permission)
        ) &&
        (this.context.toolbarMode ||
          (!this.context.toolbarMode &&
            crmPermissions.every((permission) =>
              fullTenantData.tenantPermissions.includes(permission)
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

  setRememberTenant = (savedTenant) => {
    const filteredTenant = JSON.stringify(
      pick(savedTenant, ['tenantId', 'name'])
    );
    storage.setItem('savedTenant', filteredTenant);
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

  isReauthFromExpiredSession = () =>
    this.state.expiredSessionReauth.expiredSessionUsername &&
    this.state.expiredSessionReauth.expiredSessionUsername.length;

  requiresReauth = (currentTenant) => {
    // if it is SSO
    if (this.props.displayState === SSO_LOGIN) {
      // make sure that this is one of the active tenants
      const agentTenant = this.props.agent.tenants.find(
        (tenant) => tenant.tenantId === currentTenant.tenantId
      );
      if (agentTenant) {
        let tenantActiveBool;

        if (typeof agentTenant.tenantActive !== 'boolean') {
          // if we are searching through the accountTenants
          // array (as opposed to the tenants array), then we won't have
          // the tenantActive boolean property we need - so grab it!
          const accountTenant = this.props.agent.accountTenants.find(
            (tenant) => tenant.tenantId === agentTenant.tenantId
          );

          tenantActiveBool = accountTenant.active;
        } else {
          tenantActiveBool = agentTenant.tenantActive;
        }

        // if this is an active tenant, then no need to reauthenticate
        if (tenantActiveBool) {
          return false;
        }

        return true;
      } else {
        return true;
      }
    } else {
      // if it's not SSO, then make sure that there is a password associated
      // with both the selected tenant AND the one you're trying to navigate to
      const targetTenant = this.props.agent.accountTenants.find(
        (tenantObj) => tenantObj.tenantId === currentTenant.tenantId
      );
      return !(
        targetTenant &&
        !!targetTenant.password &&
        !!this.state.password
      );
    }
  };

  setTenantOptionStyle = (currentTenant) => {
    if (
      has(this.props, 'agent.accountTenants') &&
      this.requiresReauth(currentTenant)
    ) {
      return styles.reauthOption;
    }

    return undefined;
  };

  // Layout components
  // TODO: Break out into separate ui view components

  getLoginTitle = () => {
    const parts = window.location.hostname.split('.');
    if (parts[0].indexOf('mitel') !== -1) {
      document.title = 'MiCloud Engage'; // Change title to match

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
    if (!has(this.props, 'agent.accountTenants')) {
      return false;
    }

    // get everything but the selected item
    const tenantOptions = this.props.agent.accountTenants
      .filter((tenant) => tenant.active)
      .map((tenant) => ({
        value: tenant.tenantId,
        label: tenant.name,
        style: this.setTenantOptionStyle(tenant),
        className: 'account-tenant',
        title: this.requiresReauth(tenant)
          ? this.props.intl.formatMessage(messages.authRequired)
          : '',
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

  getLoginContent = () => {
    // if this is a reauth from expired session, we don't need to show
    // the login fields, as we are logging in in the background, so just show
    // the loading spinner...
    if (
      (this.isReauthFromExpiredSession() &&
        !(this.props.criticalError || this.props.nonCriticalError)) ||
      this.props.loading
    ) {
      this.getLoadingContent();
    }

    // ...otherwise, of course show the login fields
    return (
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
        </div>
      </div>
    );
  };

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
      has(this.props, 'agent.accountTenants') &&
      this.props.agent.accountTenants.length
    ) {
      pageContent = this.getLoggedInContent();
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
          <div style={styles.content}>
            {pageContent}
            {!this.props.initiatedStandalonePopup && <LegalCopyright />}
          </div>
          {!this.props.initiatedStandalonePopup && this.getLanguageSelect()}
          <div style={styles.privacy}>
            <a
              target="_blank"
              href="https://www.serenova.com/privacy"
              style={styles.privacyLinkToolbar}
            >
              <FormattedMessage {...messages.privacy} />
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div style={styles.base}>
          <Dialog style={styles.content}>{pageContent}</Dialog>
          {this.getLanguageSelect()}
          <LegalCopyright />
          <div style={styles.privacy}>
            <a
              target="_blank"
              href="https://www.serenova.com/privacy"
              style={styles.privacyLink}
            >
              <FormattedMessage {...messages.privacy} />
            </a>
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
  criticalError: selectCriticalError(state, props),
  nonCriticalError: selectNonCriticalError(state, props),
  loginPopup: selectAgentDesktopMap(state, props).get('loginPopup'),
});

function mapDispatchToProps(dispatch) {
  return {
    setInitiatedStandalonePopup: () => dispatch(setInitiatedStandalonePopup()),
    resetPassword: (email) => dispatch(resetPassword(email)),
    setLoading: (loading) => dispatch(setLoading(loading)),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    setAccountTenants: (tenants) => dispatch(setAccountTenants(tenants)),
    errorOccurred: () => dispatch(errorOccurred()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
    setDisplayState: (displayState) => dispatch(setDisplayState(displayState)),
    changeLocale: (locale) => dispatch(changeLocale(locale)),
    setNonCriticalError: (error) => dispatch(setNonCriticalError(error)),
    dismissError: () => dispatch(dismissError()),
    handleSDKError: (error, topic) => dispatch(handleSDKError(error, topic)),
    showLoginPopup: (popupConfig) => dispatch(showLoginPopup(popupConfig)),
    dispatch,
  };
}

Login.propTypes = {
  intl: intlShape.isRequired,
  setInitiatedStandalonePopup: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  setAccountTenants: PropTypes.func.isRequired,
  errorOccurred: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  setDisplayState: PropTypes.func.isRequired,
  setNonCriticalError: PropTypes.func.isRequired,
  dismissError: PropTypes.func.isRequired,
  handleSDKError: PropTypes.func.isRequired,
  displayState: PropTypes.string,
  loading: PropTypes.bool,
  logged_in: PropTypes.bool,
  agent: PropTypes.object,
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
  crmModule: PropTypes.string,
  isStandalonePopup: PropTypes.bool,
  initiatedStandalonePopup: PropTypes.bool,
  criticalError: PropTypes.any,
  nonCriticalError: PropTypes.any,
  showLoginPopup: PropTypes.func.isRequired,
  loginPopup: PropTypes.object,
};

Login.contextTypes = {
  toolbarMode: PropTypes.bool,
};

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Login)))
);
