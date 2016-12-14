import { createSelector } from 'reselect';

/**
 * Direct selector to the login state domain
 */
const selectLoginDomain = () => (state) => state.get('login');
const selectAppDomain = () => (state) => state.get('app');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Login
 */

const selectLogin = () => createSelector(
  selectLoginDomain(),
  (substate) => substate.toJS()
);

export const selectApp = () => createSelector(
  selectAppDomain(),
  (substate) => substate.toJS()
);

export default selectLogin;
export {
  selectLoginDomain,
  selectAppDomain,
};
