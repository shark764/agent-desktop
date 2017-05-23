import contactsControlReducer from '../reducer';

describe('ContactsControl Reducer', () => {
  it('returns the initial state', () => {
    expect(contactsControlReducer(undefined, {})).toMatchSnapshot();
  });
});
