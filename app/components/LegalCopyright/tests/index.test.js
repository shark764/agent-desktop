/*
* Copyright © 2015-2017 Serenova, LLC. All rights reserved.
*/

import React from 'react';
import { shallow } from 'enzyme';

import LegalCopyright from '../index';

describe('<LegalCopyright />', () => {
  // Override so snapshots stay the same
  const DATE_TO_USE = new Date('2018-06');
  Date = jest.fn(() => DATE_TO_USE); // eslint-disable-line no-global-assign

  describe('LegalCopyright in toolbarMode', () => {
    it('renders CXEngage Legal in toolbarMode', () => {
      global.jsdom.reconfigure({
        url: 'https://dev-tb2.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in toolbarMode', () => {
      global.jsdom.reconfigure({
        url: 'https://dev-mitel-skylight.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });
  });

  describe('LegalCopyright in desktop', () => {
    it('renders CXEngage Legal in desktop', () => {
      global.jsdom.reconfigure({
        url: 'https://dev-desktop.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in desktop', () => {
      global.jsdom.reconfigure({
        url: 'https://dev-mitel-desktop.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });
  });

  describe('LegalCopyright in Non-Dev URLs', () => {
    it('renders CXEngage Legal in Non-Dev desktop', () => {
      global.jsdom.reconfigure({
        url: 'https://desktop.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in Non-Dev desktop', () => {
      global.jsdom.reconfigure({
        url: 'https://mitel-desktop.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders CXEngage Legal in Non-Dev toolbarMode', () => {
      global.jsdom.reconfigure({
        url: 'https://skylight.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in Non-Dev toolbarMode', () => {
      global.jsdom.reconfigure({
        url: 'https://mitel-skylight.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });
  });
});
