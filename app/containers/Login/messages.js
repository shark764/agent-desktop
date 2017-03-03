/*
 * Login Messages
 *
 * This contains all the text for the Login component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
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
  noTenant: {
    id: 'app.containers.Login.noTenant',
    defaultMessage: 'You must first select a tenant',
  },
  copyright: {
    id: 'app.containers.Login.copyright',
    defaultMessage: 'Copyright © 2015-{year} Serenova, LLC ("Serenova"). All rights reserved.',
    values: { year: new Date().getFullYear() },
  },
  legal: {
    id: 'app.containers.Login.legal',
    defaultMessage: 'Access to this site requires separate permission from Serenova, LLC. This site contains confidential information, and may also contain content and enable interaction with users from third-party sites subject to different terms that are outside of Serenova\'s control. By using or accessing this site, you have agreed to the Terms of Service as outlined in the Master Service Agreement ("Agreement"). A copy of this Agreement is available from your Serenova contact.',
  },
});
