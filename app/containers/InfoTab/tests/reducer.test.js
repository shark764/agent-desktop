import infoTabReducer from '../reducer';

describe('infoTabReducer', () => {
  it('returns the initial state', () => {
    expect(infoTabReducer(undefined, {})).toMatchSnapshot();
  });
});
