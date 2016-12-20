/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../assets/js/mcluhan';

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
import Radio from 'components/Radio';

import { setAuthenticated, loginError, loginSuccess, resetPassword, showLogin } from './actions';

import Radium from 'radium';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      remember: false,
      requestingPassword: false,
      tenantId: '-1',
      agentDirection: props.intl.formatMessage(messages.inbound),
      error: false,
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
  }

  componentDidMount() {
    window.SDK = cxSDK.init('https://dev-api.cxengagelabs.net/');
    // console.log('SDK', window.SDK);
  }

  onLogin() {
    if (this.state.username.trim() !== '' && this.state.password !== '') {
      SDK.Agent.login({
        userEmail: this.state.username.trim(),
        userPassword: this.state.password,
        callback: this.loginCB,
      });
    }
  }

  onTenantSelect() {
    if (this.state.tenantId !== -1) {
      this.props.beginSession(this.state.tenantId);
      this.props.showLogin(false);
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
  }

  getLoggedInContent() {
    const tenantOptions = this.props.agent.tenants.map((t) => {
      const tenant = t;
      return { value: tenant['tenant-id'], label: tenant['tenant-name'] };
    });
    return (
      <div style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <Select style={{ width: '282px' }} value={this.state.tenantId} onChange={(e) => this.setTenantId(e.value || '-1')} options={tenantOptions} />
        <Radio key={'direction-select'} style={{ marginTop: '20px' }} autocomplete="email" value={this.state.agentDirection} cb={this.setDirection} options={[messages.inbound, messages.outbound]} />
        <Button style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onTenantSelect()} />
      </div>
    );
  }

  getLoginContent() {
    // TODO when tenants.length == 0, == 1
    return (
      <div style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <TextInput key={'username'} style={{ marginBottom: '11px' }} placeholder={messages.username} autocomplete="email" value={this.state.username} cb={this.setUser} />
        <TextInput key={'password'} type="password" placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} onKeyUp={this.handleKeyPress} />
        <CheckBox style={{ marginLeft: '-9.35em', marginBottom: '11px', marginTop: '15px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
        <Button style={{ marginTop: '34px' }} text={messages.signInButton} onClick={() => this.onLogin()} />
        <A text={messages.forgot} style={{ marginTop: '17px' }} onClick={() => this.setRequestingPassword()} />
        {this.state.error
          ? <span style={[this.styles.error]}>
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
        <Button style={{ marginTop: '34px' }} text={messages.sendButton} onClick={this.sendForgotRequest} />
        <A text={messages.return2Login} style={{ marginTop: '17px' }} onClick={this.unsetRequestingPassword} />
      </div>
    );
  }

  setRequestingPassword() {
    this.setState({ requestingPassword: true });
  }

  setTenantId(tenantId) {
    this.setState({ tenantId });
  }

  setDirection(agentDirection) {
    this.setState({ agentDirection });
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
  }

  styles = {
    base: {
      width: '100vw',
      height: '100vh',
      minHeight: '100%',
      backgroundColor: '#051e24',
      fontSize: '16px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      color: '#494949',
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
  };

  render() {
    let pageContent;
    if (this.props.logged_in && this.props.agent) {
      pageContent = this.getLoggedInContent();
    } else if (this.state.requestingPassword) {
      pageContent = this.getForgotContent();
    } else {
      pageContent = this.getLoginContent();
    }

    return (
      <div style={this.styles.base}>
        <div style={Object.assign({}, this.styles.container, { height: '100vh' })}>
          <Dialog style={Object.assign({}, this.styles.center)}>
            {pageContent}
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = selectLogin();

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (email) => dispatch(resetPassword(email)),
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    setAuthenticated: () => dispatch(setAuthenticated()),
    loginError: () => dispatch(loginError()),
    showLogin: (show) => dispatch(showLogin(show)),
    dispatch,
  };
}

Login.propTypes = {
  intl: intlShape.isRequired,
  resetPassword: PropTypes.func,
  loginSuccess: PropTypes.func,
  agent: PropTypes.object,
  logged_in: PropTypes.bool,
  showLogin: PropTypes.func,
  beginSession: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Radium(Login)));
