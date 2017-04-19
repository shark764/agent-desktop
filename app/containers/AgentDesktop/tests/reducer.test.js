import agentDesktopReducer from '../reducer';

describe('agentDesktopReducer', () => {
  it('returns the correct initial state', () => {
    expect(agentDesktopReducer(undefined, {})).toMatchSnapshot();
  });
});
