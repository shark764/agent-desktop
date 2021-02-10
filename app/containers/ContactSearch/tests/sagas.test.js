/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import { goSearchContacts } from 'containers/ContactSearch/sagas';
import { createSearchQuery } from 'utils/contact';

describe('goSearchContacts', () => {
  let generator;
  beforeAll(() => {
    global.CxEngage = {
      contacts: {
        search: 'search',
      },
    };
  });
  describe('when a contact search is performed', () => {
    beforeAll(() => {
      generator = goSearchContacts({
        query: {
          page: 1,
          q: 'test',
        },
      });
    });
    it('should select loading', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should select searchPending', () => {
      expect(generator.next(false)).toMatchSnapshot();
    });
    it('should select selectedInteraction', () => {
      expect(generator.next(false)).toMatchSnapshot();
    });
    it('should select nextPage', () => {
      expect(generator.next({ query: { q: 'test' } })).toMatchSnapshot();
    });
    it('should dispatch setSearchPending with true', () => {
      expect(generator.next(1)).toMatchSnapshot();
    });
    it('should call CxEngage.contacts.search', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setSearchResults', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should dispatch setSearchPending with false', () => {
      expect(generator.next()).toMatchSnapshot();
    });
    it('should be done', () => {
      expect(generator.next()).toMatchSnapshot();
    });
  });
});

describe('Helper Functions:', () => {
  describe('createSearchQuery', () => {
    // prettier-ignore
    const query = {
      name: "Test",
      email: "test@email.com",
      phone: "+15555555555",
    };
    const nextPage = 1;
    it('should create a query for the SDK', () => {
      expect(createSearchQuery(query, nextPage)).toMatchSnapshot();
    });
  });
});
