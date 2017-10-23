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

import { clearUrlHash } from 'utils/url';

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
  loggingIn,
  errorOccurred,
  loginSuccess,
  resetPassword,
  settingTenant,
  setTenant,
} from './actions';
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
      username: storage.getItem('email') || '',
      password: '',
      email: storage.getItem('email') || '',
      ssoEmail: '',
      remember: storage.getItem('remember') === 'true',
      requestingPassword: false,
      usingSingleSignOn: false,
      tenantId: '-1',
      tenantName: '',
      agentDirection: props.intl.formatMessage(messages.inbound),
      showLanguage: false,
    };
  }

  componentDidMount() {
    const waitingOnSdk = setInterval(() => {
      if (CxEngage.subscribe) {
        CxEngage.subscribe(
          'cxengage/authentication',
          (authError, authTopic) => {
            if (authError) {
              // Handled in App
            } else {
              switch (authTopic) {
                case 'cxengage/authentication/cognito-initialized-response': {
                  CxEngage.authentication.ssoLogin((error, topic, response) => {
                    if (!error) {
                      this.props.dismissError();
                      clearUrlHash();
                      console.log(
                        '[SSO-Login] CxEngage.subscribe()',
                        topic,
                        response
                      );
                      this.loginCB(response);
                    } else {
                      this.props.errorOccurred();
                    }
                  });
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
    this.props.loggingIn();
    CxEngage.authentication.getAuthInfo({ username: this.state.ssoEmail });
  };

  onLogin = () => {
    this.props.loggingIn();
    CxEngage.authentication.login(
      {
        username: this.state.username.trim(),
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
        this.props.settingTenant();
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

  setPassword = (password) => {
    this.setState({ password });
  };

  setEmail = (email) => {
    this.setState({ email });
  };

  setUser = (username) => {
    this.setState({ username });
  };

  setSsoEmail = (ssoEmail) => {
    this.setState({ ssoEmail });
  };

  setRemember = (remember) => {
    this.setState({ remember });
    storage.setItem('remember', remember);
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

  getLoadingContent = () =>
    (<div id="loginContainerDiv" style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <div style={styles.dialogContent}>
        <IconSVG id="loadingIcon" name="loading" />
      </div>
    </div>);

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
      </div>
    );
  };

  getLoginContent = () =>
    (<div id="loginContainerDiv" style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <div style={styles.dialogContent}>
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
        {this.ssoFlag() &&
          <A
            id={messages.ssoSignIn.id}
            style={styles.ssoLink}
            onClick={() => this.toggleUsingSingleSignOn()}
            text={messages.ssoSignIn}
          />}
        {/* Hide until we implement the feature
          <A id={messages.forgot.id} text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.setRequestingPassword()} />
        */}
      </div>
    </div>);

  getSingleSignOnContent = () =>
    (<div id="ssoContainer" style={styles.dialogContentContainer}>
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
          key={'email'}
          placeholder={messages.email}
          autocomplete="email"
          value={this.state.ssoEmail}
          cb={this.setSsoEmail}
        />
        <Button
          id={messages.nextButton.id}
          type="primaryBlueBig"
          style={styles.actionButton}
          text={messages.nextButton}
          onClick={() => this.loginWithSso()}
        />
        <A
          id={messages.return2Login.id}
          style={styles.ssoLink}
          onClick={() => this.toggleUsingSingleSignOn()}
          text={messages.return2Login}
        />
      </div>
    </div>);

  getForgotContent = () =>
    (<div style={styles.dialogContentContainer}>
      <Logo style={styles.logo} />
      <Title text={messages.forgot} style={styles.contentTitle} />
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
    </div>);

  getLanguageSelect = () =>
    (<div style={styles.languageMenu}>
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
    </div>);

  setRequestingPassword = () => {
    this.setState({ requestingPassword: true });
  };

  setTenantId = (tenantId, tenantName) => {
    this.setState({ tenantId, tenantName });
  };

  setDirection = (agentDirection) => {
    this.setState({ agentDirection });
  };

  unsetRequestingPassword = () => {
    this.setState({ requestingPassword: false });
  };

  sendForgotRequest = () => {
    this.props.resetPassword({ email: this.state.email });
  };

  toggleUsingSingleSignOn = () => {
    this.setState({ usingSingleSignOn: !this.state.usingSingleSignOn });
  };

  loginCB = (agent) => {
    this.props.loginSuccess(agent);
    const activeTenants = agent.tenants.filter((tenant) => tenant.tenantActive);
    if (activeTenants.length === 1) {
      this.setTenantId(activeTenants[0].tenantId, activeTenants[0].tenantName);
      this.onTenantSelect();
    } else if (activeTenants.length === 0) {
      this.props.setNonCriticalError({ code: 'AD-1005' });
    }
    if (this.state.remember) {
      storage.setItem('email', agent.username);
      storage.setItem('remember', true);
    } else {
      storage.setItem('email', '');
      storage.setItem('remember', false);
    }
  };

  setLocalLocale = (locale) => {
    storage.setItem('locale', locale);
    location.reload();
  };

  toggleLanguageMenu = () => {
    this.setState({ showLanguage: !this.state.showLanguage });
  };

  openStandalonePopup = () => {
    window.open(
      `${window.location.href}?standalonePopup=true`,
      'toolbar',
      'width=400,height=800'
    );
    this.props.setInitiatedStandalonePopup();
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
    } else if (this.state.usingSingleSignOn) {
      pageContent = this.getSingleSignOnContent();
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
    } else {
      pageContent = this.getLoginContent();
    }

    // Mitel Branding Color Swap
    const parts = location.hostname.split('.');
    if (parts[0].indexOf('mitel') !== -1) {
      styles.base.backgroundColor = '#002855';
    }

    if (this.context.toolbarMode) {
      return (
        <div style={styles.toolbarBase}>
          {!this.props.crmModule &&
            !this.props.isStandalonePopup &&
            !this.props.initiatedStandalonePopup &&
            <div style={{ gridArea: 'standalonePopup' }}>
              <div style={{ float: 'right', margin: '1em 1.4em 0 0' }}>
                <FontAwesomeIcon
                  id={'standalonePopupIcon'}
                  name={'window-restore'}
                  style={{
                    color: 'gray',
                    cursor: 'pointer',
                    fontSize: '1.5em',
                  }}
                  onclick={this.openStandalonePopup}
                />
              </div>
            </div>}
          <div style={styles.content}>
            {pageContent}
          </div>
          {!this.props.initiatedStandalonePopup && this.getLanguageSelect()}
        </div>
      );
    } else {
      return (
        <div style={styles.base}>
          <Dialog style={styles.content}>
            {pageContent}
          </Dialog>
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
    loggingIn: () => dispatch(loggingIn()),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    errorOccurred: () => dispatch(errorOccurred()),
    settingTenant: () => dispatch(settingTenant()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
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
  loggingIn: PropTypes.func.isRequired,
  loginSuccess: PropTypes.func.isRequired,
  errorOccurred: PropTypes.func.isRequired,
  settingTenant: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  setNonCriticalError: PropTypes.func.isRequired,
  dismissError: PropTypes.func.isRequired,
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
