/*
* Copyright © 2015-2017 Serenova, LLC. All rights reserved.
*/

import React from 'react';
import { shallow } from 'enzyme';

import LegalCopyright from '../index';

describe('<LegalCopyright />', () => {
  describe('LegalCopyright in toolbarMode', () => {
    it('renders CXEngage Legal in toolbarMode', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://dev-tb2.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in toolbarMode', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://dev-mitel-skylight.cxengagelabs.net/',
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
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://dev-desktop.cxengagelabs.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in desktop', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://dev-mitel-desktop.cxengagelabs.net/',
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
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://desktop.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in Non-Dev desktop', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://mitel-desktop.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: false },
        })
      ).toMatchSnapshot();
    });

    it('renders CXEngage Legal in Non-Dev toolbarMode', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://skylight.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });

    it('renders Mitel Legal in Non-Dev toolbarMode', () => {
      Object.defineProperty(window.location, 'hostname', {
        writable: true,
        value: 'https://mitel-skylight.cxengage.net/',
      });
      expect(
        shallow(<LegalCopyright />, {
          context: { toolbarMode: true },
        })
      ).toMatchSnapshot();
    });
  });
});
