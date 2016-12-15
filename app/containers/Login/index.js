/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../node_modules/mcluhan/release/mcluhan';

import selectLogin from './selectors';
import selectAgentDesktop from '../AgentDesktop/selectors';
import messages from './messages';
import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import A from 'components/A';
import Select from 'components/Select';

import { setAuthenticated, loginError, loginSuccess } from './actions';

import Radium from 'radium';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', remember: false };
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setRemember = this.setRemember.bind(this);
    this.loginCB = this.loginCB.bind(this);
    this.onTenantSelect = this.onTenantSelect.bind(this);
  }

  componentDidMount() {
    window.SDK = cxSDK.init('https://dev-api.cxengagelabs.net/v1/');
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
      const sessionParams = {
        'tenant-id': this.state.tenantId,
        'on-notification': function handleSqsMessage() {
          // console.log('handleSqsMessage');
        },
        callback: function sessionBeginCallback() {
          // console.log('SESSION BEGIN CB FIRED');
          // changeState('notready');
        },
      };
      SDK.Agent.Session.beginSession(sessionParams);
    }
  }

  setPassword(password) {
    this.setState({ password });
  }

  setUser(username) {
    this.setState({ username });
  }

  setRemember(remember) {
    this.setState({ remember });
  }

  setTenantId(tenantId) {
    this.setState({ tenantId });
  }

  getContent() {
    // TODO when tenants.length == 0, == 1
    if (this.props.logged_in && this.props.agent) {
      // console.log('getContent agent', this.props.agent);
      const tenantOptions = this.props.agent.tenants.map((tenant) => <option key={tenant['tenant-id']} value={tenant['tenant-id']}>{tenant['tenant-name']}</option>);
      return (
        // TODO components for option
        <div>
          <Select style={{ width: '282px' }} onChange={(e) => this.setTenantId(e.target.value)}>
            <option style={this.styles.selectOptions} key={'default-tennant-select'} value={-1}> Please select tenant</option>
            {tenantOptions}
          </Select>
          <Button style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onTenantSelect()} />
        </div>
      );
    }
    return (
      <div style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
        <Logo style={{ marginTop: '50px' }} width="275px" />
        <Title text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
        <TextInput key={'username'} style={{ marginBottom: '11px' }} placeholder={messages.username} autocomplete="email" value={this.state.username} cb={this.setUser} />
        <TextInput key={'password'} type="password" placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} />
        <CheckBox style={{ marginLeft: '-9.35em', marginBottom: '11px', marginTop: '15px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
        <Button style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onLogin()} />
        <A text={messages.forgot} style={{ marginTop: '17px' }} />
      </div>
    );
  }

  loginCB(agent) {
    //  this.props.dispatch(push('/desktop'));
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
    selectOptions: {
      boxShadow: '0 0 6px 1px rgba(0,0,0,0.08)',
      border: '1px solid #EAE AEA',
      borderRadius: 'px',
      width: '282px',
      backgroundColor: '#FFFFFF',
    },
  };

  render() {
    return (
      <div style={this.styles.base}>
        <div style={Object.assign({}, this.styles.container, { height: '100vh' })}>
          <Dialog style={Object.assign({}, this.styles.center)}>
            {this.getContent()}
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = Object.assign(selectLogin(), selectAgentDesktop());

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: (agent) => dispatch(loginSuccess(agent)),
    setAuthenticated: () => dispatch(setAuthenticated()),
    loginError: () => dispatch(loginError()),
    // initSDK: (sdk) => dispatch(initSDK(sdk)),
    dispatch,
  };
}

Login.propTypes = {
  // dispatch: PropTypes.func,
  loginSuccess: PropTypes.func,
  agent: PropTypes.object,
  logged_in: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Login));
