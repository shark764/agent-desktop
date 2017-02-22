/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import selectLogin from './selectors';
import messages from './messages';
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
const storage = window.localStorage;

import { loggingIn, loginError, loginSuccess, resetPassword, settingTenant, setTenant } from './actions';

import Radium from 'radium';

export class Login extends React.Component {

  constructor(props) {
    super(props);
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.setRequestingPassword = this.setRequestingPassword.bind(this);
    this.unsetRequestingPassword = this.unsetRequestingPassword.bind(this);
    this.sendForgotRequest = this.sendForgotRequest.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setDirection = this.setDirection.bind(this);
  }

  onLogin() {
    if (this.state.username.trim() !== '' && this.state.password !== '') {
      this.props.loggingIn();
      SDK.auth.login({
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
          this.props.setTenant(this.state.tenantId, this.state.tenantName);
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
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title id={messages.welcome.id} text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <Select id={'app.login.selectTennant.selectbox'} style={{ width: '282px' }} value={this.state.tenantId} onChange={(e) => this.setTenantId(e.value || '-1', e.label || '')} options={tenantOptions} autoFocus />
        { // Inbound / Outbound Select
          // <Radio key={'direction-select'} style={{ marginTop: '20px' }} autocomplete="email" value={this.state.agentDirection} cb={this.setDirection} options={[messages.inbound, messages.outbound]} />
        }
        <Button id={messages.sendButton.id} type="primaryBlueBig" style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onTenantSelect()} />
        {this.state.noTenant
          ? <span style={[this.styles.error, this.styles.errorTenant]}>
            <FormattedMessage style={this.styles.center} {...messages.noTenant} />
          </span>
          : ''
        }
      </div>
    );
  }

  getLoginContent() {
    // TODO when tenants.length == 0, == 1
    return (
      <div id="loginContainerDiv" style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title id={messages.welcome.id} text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <TextInput id={messages.username.id} autoFocus={!this.state.remember} key={'username'} style={{ marginBottom: '11px' }} placeholder={messages.username} autocomplete="email" value={this.state.username} cb={this.setUser} />
        <TextInput id={messages.password.id} autoFocus={this.state.remember} key={'password'} type="password" placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} onKeyUp={this.handleKeyPress} />
        <CheckBox id={messages.rememberMe.id} style={{ marginLeft: '-9.35em', marginBottom: '11px', marginTop: '15px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
        <Button id={messages.signInButton.id} type="primaryBlueBig" style={{ marginTop: '34px' }} text={messages.signInButton} onClick={() => this.onLogin()} />
        <A id={messages.forgot.id} text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.setRequestingPassword()} />
        {this.props.login_error
          ? <span id={messages.error.id} style={[this.styles.error]}>
            <FormattedMessage style={this.styles.center} {...messages.error} />
          </span>
          : ''
        }
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

  handleKeyPress(e) {
    if (e.keyCode === 13) {
      this.onLogin();
    }
  }

  sendForgotRequest() {
    this.props.resetPassword({ email: this.state.email });
  }

  loginCB(agent) {
    this.props.loginSuccess(agent);
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
      height: '31px',
      color: '#FFFFFF',
      fontWeight: 'lighter',
      textAlign: 'center',
      paddingTop: '3px',
      position: 'relative',
      top: '-509px',
    },
    errorTenant: {
      top: '-406.4px',
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
      pageContent = this.getLoggedInContent();
    } else if (this.state.requestingPassword) {
      pageContent = this.getForgotContent();
    } else {
      pageContent = this.getLoginContent();
    }

    return (
      <div style={this.styles.base}>
        <div style={Object.assign({}, this.styles.container, { height: '100vh', minHeight: '800px' })}>
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

const mapStateToProps = selectLogin();

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (email) => dispatch(resetPassword(email)),
    loggingIn: () => dispatch(loggingIn()),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    loginError: () => dispatch(loginError()),
    settingTenant: () => dispatch(settingTenant()),
    setTenant: (id, name) => dispatch(setTenant(id, name)),
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
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Login)));
