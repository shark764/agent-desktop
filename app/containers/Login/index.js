/*
 *
 * Login
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import selectLogin from './selectors';
import messages from './messages';
import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';

import { push } from 'react-router-redux';

import Radium from 'radium';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', remember: false };
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.setRemember = this.setRemember.bind(this);
    this.loginAgent();
  }

  setUser(username) {
    this.setState({ username });
  }

  setPassword(password) {
    this.setState({ password });
  }

  setRemember(remember) {
    this.setState({ remember });
  }

  loginAgent() {
    // var foo = SDK;
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
      height: '100vh',
    },
  };

  render() {
    return (
      <div style={this.styles.base}>
        <div style={this.styles.container}>
          <Dialog style={this.styles.center}>
            <div style={Object.assign({}, this.styles.container, { justifyContent: 'flex-start' })}>
              <Logo style={this.styles.center} width="275px" />
              <Title text={messages.welcome} style={[{ paddingBottom: '23px' }, this.styles.center]} />
              <TextInput key={'username'} placeholder={messages.username} autocomplete="username" value={this.state.username} cb={this.setUser} />
              <TextInput key={'password'} placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} />
              <CheckBox style={{ marginLeft: '-6.35em', marginBottom: '11px' }} checked={this.state.remember} text={messages.rememberMe} cb={this.setRemember} />
              <Button text={messages.sendButton} onClick={() => this.props.onLogin()} />
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = selectLogin();

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(push('/desktop')),
    dispatch,
  };
}

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Login));
