import { createSelector } from 'reselect';

const selectLoginDomain = (state) => state.get('login');

const selectAgentId = createSelector(
  selectLoginDomain,
  (login) => login.get('agent').get('userId')
);

export {
  selectAgentId,
};
