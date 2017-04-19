import contactsControlReducer from '../reducer';

describe('contactsControlReducer', () => {
  it('returns the initial state', () => {
    expect(contactsControlReducer(undefined, {})).toMatchSnapshot();
  });
});
