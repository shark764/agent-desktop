/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import A from 'components/A';
import Select from 'components/Select';
import IconSVG from 'components/IconSVG';
// import Radio from 'components/Radio';

import selectLogin, { selectRefresh } from './selectors';
import messages from './messages';
import { loggingIn, loginError, loginSuccess, resetPassword, settingTenant, setTenant, tenantError } from './actions';
const storage = window.localStorage;

export class Login extends React.Component {

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
    };
    this.setUser = this.setUser.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setRemember = this.setRemember.bind(this);
    this.loginCB = this.loginCB.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.setRequestingPassword = this.setRequestingPassword.bind(this);
    this.unsetRequestingPassword = this.unsetRequestingPassword.bind(this);
    this.sendForgotRequest = this.sendForgotRequest.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setDirection = this.setDirection.bind(this);
    this.getErrors = this.getErrors.bind(this);
  }

  onLogin() {
    storage.removeItem('ADError');
    if (this.state.username.trim() !== '' && this.state.password !== '') {
      this.props.loggingIn();
      SDK.authentication.login({
        username: this.state.username.trim(),
        password: this.state.password,
        callback: (error, topic, response) => {
          console.log('[Login] SDK.subscribe()', topic, response);
          if (!error && response) {
            this.loginCB(response);
          } else {
            this.handleError();
          }
        },

      });
    } else {
      this.handleError();
    }
  }

  onTenantSelect() {
    if (this.state.tenantId !== '-1') {
      this.props.settingTenant();
      SDK.session.setActiveTenant({
        tenantId: this.state.tenantId,
        callback: (error, topic, response) => {
          console.log('[Login] SDK.subscribe()', topic, response);

          if (error !== null) { // General error check
            switch (error.code) {
              case 1003:
                this.props.tenantError(messages.noPermsError);
                break;
              default:
                console.error('SDK Error:', error.error); // Uncaught error handling
                break;
            }
          } else {
            this.props.setTenant(this.state.tenantId, this.state.tenantName);
          }
        },
      });
    } else {
      this.setState({ noTenant: true });
    }
  }

  setPassword(password) {
    this.setState({ password });
  }

  setEmail(email) {
    this.setState({ email });
  }

  setUser(username) {
    this.setState({ username });
  }

  setRemember(remember) {
    this.setState({ remember });
    storage.setItem('remember', remember);
  }

  getLoadingContent() {
    return (
      <div id="loginContainerDiv" style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <IconSVG id="loadingIcon" name="loading" style={{ marginTop: '50px' }} />
      </div>
    );
  }

  getLoggedInContent() {
    const tenantOptions = this.props.agent.tenants.map((tenant) =>
      ({ value: tenant.tenantId, label: tenant.tenantName })
    );
    return (
      <div id="TSContainerDiv" style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        {this.state.noTenant
          ? <span style={[this.styles.error]}>
            <FormattedMessage style={this.styles.center} {...messages.noTenant} />
          </span>
          : ''
        }
        {this.props.tenant_error
          ? <span id="tenantLoginError" style={[this.styles.error]}>
            <FormattedMessage style={this.styles.center} {...this.props.tenant_error_message} />
          </span>
          : ''
        }
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title id={messages.welcome.id} text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <Select id={'app.login.selectTennant.selectbox'} style={{ width: '282px' }} value={this.state.tenantId} onChange={(e) => this.setTenantId(e.value || '-1', e.label || '')} options={tenantOptions} autoFocus clearable={false} placeholder={<FormattedMessage {...messages.selectTenant} />} />
        { // Inbound / Outbound Select
          // <Radio key={'direction-select'} style={{ marginTop: '20px' }} autocomplete="email" value={this.state.agentDirection} cb={this.setDirection} options={[messages.inbound, messages.outbound]} />
        }
        <Button id={messages.sendButton.id} type="primaryBlueBig" style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onTenantSelect()} />
      </div>
    );
  }

  getErrors() {
    const error = storage.getItem('ADError');
    let errorSpan;
    if (this.props.login_error) {
      errorSpan = (
        <span id={messages.error.id} style={[this.styles.error]}>
          <FormattedMessage style={this.styles.center} {...messages.error} />
        </span>
      );
    } else if (error !== null) {
      switch (error) {
        case 'cxengage/session/heartbeat-response':
          errorSpan = (
            <span id={`${error}:ERROR`} style={[this.styles.error]}>
              <FormattedMessage style={this.styles.center} {...messages.heartbeatError} />
            </span>
          );
          break;
        default:
          errorSpan = (
            <span id={`${error}:ERROR`} style={[this.styles.error]}>
              <FormattedMessage style={this.styles.center} {...messages.generalError} />
            </span>
          );
          break;
      }
    }
    return errorSpan;
  }

  getLoginContent() {
    // TODO when tenants.length == 0, == 1
    return (
      <div id="loginContainerDiv" style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title id={messages.welcome.id} text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <TextInput id={messages.username.id} autoFocus={!this.state.remember} key={'username'} style={{ marginBottom: '11px' }} placeholder={messages.username} autocomplete="email" value={this.state.username} cb={this.setUser} />
        <TextInput id={messages.password.id} autoFocus={this.state.remember} key={'password'} type="password" placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} onEnter={this.onLogin} />
        <CheckBox id={messages.rememberMe.id} style={{ marginLeft: '-9.35em', marginBottom: '11px', marginTop: '15px', width: '130px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
        <Button id={messages.signInButton.id} type="primaryBlueBig" style={{ marginTop: '34px' }} text={messages.signInButton} onClick={() => this.onLogin()} />
        <A id={messages.forgot.id} text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.setRequestingPassword()} />
      </div>
    );
  }

  getForgotContent() {
    return (
      <div style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title text={messages.forgot} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <p style={{ width: '282px', textAlign: 'center' }} >{this.props.intl.formatMessage(messages.forgotInstructions)}</p>
        <TextInput key={'email'} style={{ marginBottom: '11px' }} placeholder={messages.email} autocomplete="email" value={this.state.email} cb={this.setEmail} />
        <Button type="primaryBlueBig" style={{ marginTop: '34px' }} text={messages.sendButton} onClick={this.sendForgotRequest} />
        <A text={messages.return2Login} style={{ marginTop: '17px' }} onClick={this.unsetRequestingPassword} />
      </div>
    );
  }

  setRequestingPassword() {
    this.setState({ requestingPassword: true });
  }

  setTenantId(tenantId, tenantName) {
    this.setState({ tenantId, tenantName });
  }

  setDirection(agentDirection) {
    this.setState({ agentDirection });
  }

  handleError() {
    this.props.loginError();
  }

  unsetRequestingPassword() {
    this.setState({ requestingPassword: false });
  }

  sendForgotRequest() {
    this.props.resetPassword({ email: this.state.email });
  }

  loginCB(agent) {
    this.props.loginSuccess(agent);
    storage.setItem('email1', agent.username); // TODO: REMOVE BEFORE PROD!!!! HACK FOR STATS
    storage.setItem('pass1', this.state.password); // TODO: REMOVE BEFORE PROD!!!! HACK FOR STATS
    if (this.state.remember) {
      storage.setItem('name', `${agent['first-name']}, ${agent['last-name']}`);
      storage.setItem('email', agent.username);
      storage.setItem('remember', true);
    } else {
      storage.setItem('name', '');
      storage.setItem('email', '');
      storage.setItem('remember', false);
    }
  }

  styles = {
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
  };

  render() {
    let pageContent;
    if (this.props.loading) {
      pageContent = this.getLoadingContent();
    } else if (this.props.logged_in && this.props.agent) {
      if (this.props.agent.tenants.length === 1) {
        this.setTenantId(this.props.agent.tenants[0].tenantId, this.props.agent.tenants[0].tenantName);
        this.onTenantSelect();
      } else {
        pageContent = this.getLoggedInContent();
      }
    } else if (this.state.requestingPassword) {
      pageContent = this.getForgotContent();
    } else {
      pageContent = this.getLoginContent();
    }

    return (
      <div style={[this.styles.base, this.props.refreshRequired && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' ? { height: 'calc(100vh - 2em)' } : { height: '100vh' }]}>
        <div style={Object.assign({}, this.styles.container, { height: this.props.refreshRequired && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' ? 'calc(100vh - 2em)' : '100vh', minHeight: '800px' })}>
          {
            this.getErrors()
          }
          <Dialog style={Object.assign({}, this.styles.center)}>
            {pageContent}
          </Dialog>
          <div style={this.styles.copyright}>
            <div style={this.styles.copyrightText}>
              <FormattedMessage {...messages.copyright} />
            </div>
            <div style={this.styles.legalText}>
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
});

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (email) => dispatch(resetPassword(email)),
    loggingIn: () => dispatch(loggingIn()),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    loginError: () => dispatch(loginError()),
    settingTenant: () => dispatch(settingTenant()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
    tenantError: (error) => dispatch(tenantError(error)),
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
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Login)));
