/*
 *
 * Login
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import selectLogin from './selectors';
import messages from './messages';

import Dialog from 'components/Dialog';
import Logo from 'components/Logo';
import Title from 'components/Title';
import TextInput from 'components/TextInput';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import A from 'components/A';

import Radium from 'radium';

import { Flex } from 'reflexbox';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = { username: '', password: '', remember: false };
    this.setUser = this.setUser.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  setUser(username) {
    this.setState({ username });
  }

  setPassword(password) {
    this.setState({ password });
  }

  toggleRemember(remember) {
    if (typeof remember !== 'undefined') {
      this.setState({ remember });
    } else {
      this.setState({ remember: !this.state.remember });
    }
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
  }

  render() {
    return (
      <div style={this.styles.base}>
        <Flex align="center" justify="center" style={{ height: '100vh' }}>
          <Dialog>
            <Flex align="center" justify="center" py={3}>
              <Logo style={{ width: '275px' }} />
            </Flex>
            <Flex align="center" justify="center" py={1}>
              <Title text={messages.welcome} style={{ paddingBottom: '23px' }} />
            </Flex>
            <Flex align="center" justify="center" py={1}>
              <TextInput key={'username'} placeholder={messages.username} autocomplete="username" value={this.state.username} cb={this.setUser} />
            </Flex>
            <Flex align="center" justify="center" py={1}>
              <TextInput key={'password'} placeholder={messages.password} autocomplete="password" value={this.state.password} cb={this.setPassword} />
            </Flex>
            <Flex align="center" justify="center" py={1} px={1}>
              <CheckBox style={{ marginLeft: '-9.5em' }} checked={this.state.remember} text={messages.rememberMe} cb={this.toggleRemember} />
            </Flex>
            <Flex align="center" justify="center" py={2}>
              <Button text={messages.sendButton} />
            </Flex>
            <Flex align="center" justify="center" py={1}>
              <A text={messages.forgot} />
            </Flex>
          </Dialog>
        </Flex>
      </div>
    );
  }
}

const mapStateToProps = selectLogin();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Login));
