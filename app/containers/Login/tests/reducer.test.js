import loginReducer from '../reducer';

describe('loginReducer', () => {
  it('returns the initial state', () => {
    expect(loginReducer(undefined, {})).toMatchSnapshot();
  });
});
