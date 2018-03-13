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
  ssoSignIn: {
    id: 'app.containers.Login.ssoSignInTitle',
    defaultMessage: 'Sign in with SSO',
  },
  ssoSignInDescription: {
    id: 'app.containers.Login.ssoSignInDescription',
    defaultMessage:
      "Enter your email address and we'll redirect you to your company's login",
  },
  nextButton: {
    id: 'app.containers.Login.nextButton',
    defaultMessage: 'Next',
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
    defaultMessage: 'Sign in with email and password',
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
  selectTenantMenu: {
    id: 'app.containers.Login.selectTenantMenu',
    defaultMessage: 'Please Select a Tenant',
  },
  selectTenant: {
    id: 'app.containers.Login.selectTenant',
    defaultMessage: 'Select Tenant...',
  },
  authRequired: {
    id: 'app.containers.Login.selectTenantReauthTitle',
    defaultMessage: 'Authentication is required to switch to this tenant',
  },
  privacy: {
    id: 'app.containers.Login.privacy',
    defaultMessage: 'Privacy Policy',
  },
});
