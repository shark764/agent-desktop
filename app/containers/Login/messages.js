/*
 * Login Messages
 *
 * This contains all the text for the Login component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.Login.header',
    defaultMessage: 'This is Login container !',
  },
  welcome: {
    id: 'app.containers.Login.welcome',
    defaultMessage: 'Sign in to CXEngage',
  },
  forgot: {
    id: 'app.containers.Login.forgot',
    defaultMessage: 'Forgot your password?',
  },
  forgotInstructions: {
    id: 'app.containers.Login.forgotInstructions',
    defaultMessage: 'Enter your email address and we\'ll send you a link to change your password',
  },
  sendButton: {
    id: 'app.containers.Login.sendButton',
    defaultMessage: 'Send',
  },
  signInButton: {
    id: 'app.containers.Login.signInButton',
    defaultMessage: 'Sign In',
  },
  return2Login: {
    id: 'app.conatainers.Login.return2Login',
    defaultMessage: 'Return to Login',
  },
  email: {
    id: 'app.containers.Login.email',
    defaultMessage: 'Email',
  },
  username: {
    id: 'app.containers.Login.username',
    defaultMessage: 'Username',
  },
  password: {
    id: 'app.contianers.Login.password',
    defaultMessage: 'Password',
  },
  rememberMe: {
    id: 'app.containers.Login.rememberMe',
    defaultMessage: 'Remember Me',
  },
  inbound: {
    id: 'app.containers.Login.inbound',
    defaultMessage: 'Inbound',
  },
  outbound: {
    id: 'app.containers.Login.outbound',
    defaultMessage: 'Outbound',
  },
  error: {
    id: 'app.containers.Login.error',
    defaultMessage: 'The username or password you\'ve entered is not correct',
  },
});
