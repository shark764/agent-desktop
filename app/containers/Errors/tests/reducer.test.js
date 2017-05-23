import errorsReducer from '../reducer';

describe('Errors Reducer', () => {
  it('returns the initial state', () => {
    expect(errorsReducer(undefined, {})).toMatchSnapshot();
  });
});
