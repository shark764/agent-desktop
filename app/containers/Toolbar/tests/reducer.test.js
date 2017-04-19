import toolbarReducer from '../reducer';

describe('toolbarReducer', () => {
  it('returns the initial state', () => {
    expect(toolbarReducer(undefined, {})).toMatchSnapshot();
  });
});
