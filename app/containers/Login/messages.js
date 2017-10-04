/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 * Login Messages
 *
 * This contains all the text for the Login component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  welcome: {
    id: 'app.containers.Login.welcome',
    defaultMessage: 'Sign in to CxEngage',
  },
  welcomeNoProd: {
    id: 'app.containers.Login.welcomeNoProd',
    defaultMessage: 'Sign in',
  },
  forgot: {
    id: 'app.containers.Login.forgot',
    defaultMessage: 'Forgot your password?',
  },
  forgotInstructions: {
    id: 'app.containers.Login.forgotInstructions',
    defaultMessage:
      "Enter your email address and we'll send you a link to change your password",
  },
  selectButton: {
    id: 'app.containers.Login.selectButton',
    defaultMessage: 'Select',
  },
  signInButton: {
    id: 'app.containers.Login.signInButton',
    defaultMessage: 'Sign In',
  },
  return2Login: {
    id: 'app.containers.Login.return2Login',
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
    id: 'app.containers.Login.password',
    defaultMessage: 'Password',
  },
  rememberMe: {
    id: 'app.containers.Login.rememberMe',
    defaultMessage: 'Remember Me',
  },
  toolbarHasBeenLaunched: {
    id: 'app.containers.Login.toolbarHasBeenLaunched',
    defaultMessage:
      'Toolbar has been launched in a new window. You can no longer login from here.',
  },
  youMayClose: {
    id: 'app.containers.Login.youMayClose',
    defaultMessage: 'You may now close this window.',
  },
  inbound: {
    id: 'app.containers.Login.inbound',
    defaultMessage: 'Inbound',
  },
  outbound: {
    id: 'app.containers.Login.outbound',
    defaultMessage: 'Outbound',
  },
  selectTenantMenu: {
    id: 'app.containers.Login.selectTenantMenu',
    defaultMessage: 'Please Select a Tenant',
  },
  selectTenant: {
    id: 'app.containers.Login.selectTenant',
    defaultMessage: 'Select Tenant...',
  },
  copyright: {
    id: 'app.containers.Login.copyright',
    defaultMessage:
      'Copyright © 2015-{year} Serenova, LLC ("Serenova"). All rights reserved.',
    values: { year: new Date().getFullYear() },
  },
  legal: {
    id: 'app.containers.Login.legal',
    defaultMessage:
      'Access to this site requires separate permission from Serenova, LLC. This site contains confidential information, and may also contain content and enable interaction with users from third-party sites subject to different terms that are outside of Serenova\'s control. By using or accessing this site, you have agreed to the Terms of Service as outlined in the Master Service Agreement ("Agreement"). A copy of this Agreement is available from your Serenova contact.',
  },
});
