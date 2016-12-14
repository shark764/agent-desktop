/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import '../../../node_modules/mcluhan/release/mcluhan';

import selectLogin, { selectApp } from './selectors';
import messages from './messages';
import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import A from 'components/A';

import { setAuthenticated, loginError, initSDK, loginSuccess } from './actions';

import Radium from 'radium';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', remember: false };
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setRemember = this.setRemember.bind(this);
    this.loginCB = this.loginCB.bind(this);
  }

  componentDidMount() {
    this.props.initSDK(cxSDK.init('https://dev-api.cxengagelabs.net/v1/'));
  }

  onLogin() {
    const sdk = this.props.sdk;
    sdk.Agent.login({
      userEmail: this.state.username,
      userPassword: this.state.password,
      callback: this.loginCB,
    });
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

  loginCB(stuff) {
    console.log(stuff);
    this.props.dispatch(push('/desktop'));
  }

  styles = {
    base: {
      width: '100vw',
      height: '100vh',
      minHeight: '100%',
      backgroundColor: '#051e24',
      fontFamily: 'ProximaNova',
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
  };

  render() {
    return (
      <div style={this.styles.base}>
        <div style={Object.assign({}, this.styles.container, { height: '100vh' })}>
          <Dialog style={Object.assign({}, this.styles.center)}>
            <div style={Object.assign({}, this.styles.container, { justifyContent: 'center' })}>
              <Logo style={{ marginTop: '50px' }} width="275px" />
              <Title text={messages.welcome} style={[{ paddingBottom: '23px', marginTop: '39px' }, this.styles.center]} />
              <TextInput key={'username'} style={{ marginBottom: '11px' }} placeholder={messages.username} autocomplete="username" value={this.state.username} cb={this.setUser} />
              <TextInput key={'password'} type="password" placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} />
              <CheckBox style={{ marginLeft: '-9.35em', marginBottom: '11px', marginTop: '15px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
              <Button style={{ marginTop: '34px' }} text={messages.sendButton} onClick={() => this.onLogin()} />
              <A text={messages.forgot} style={{ marginTop: '17px' }} />
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = Object.assign(selectLogin(), selectApp());

function mapDispatchToProps(dispatch) {
  return {
    loginSuccess: () => dispatch(loginSuccess()),
    setAuthenticated: () => dispatch(setAuthenticated()),
    loginError: () => dispatch(loginError()),
    initSDK: (sdk) => dispatch(initSDK(sdk)),
    dispatch,
  };
}

Login.propTypes = {
  initSDK: PropTypes.func.isRequired,
  sdk: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Login));
