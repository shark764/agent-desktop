/*
 * Copyright © 2015-2019 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import CollapsibleMultiselect from 'components/CollapsibleMultiselect';

describe('<CollapsibleMultiselect />', () => {
  describe('parent window is the same', () => {
    describe('agent preference menu enabled', () => {
      const title = {
        id: 'abc',
        defaultMessage: 'Single Preference Toggle',
      };
      const rendered = shallow(
        <CollapsibleMultiselect
          title={title}
          toggleSelection={() => {}}
          singleToggleBtn
        />
      );
      it('renders the preference option', () => {
        expect(rendered).toMatchSnapshot();
      });
    });

    const itemList = [
      {
        name: 'item1',
        id: '123',
      },
      {
        name: 'item2',
        id: '321',
      },
    ];
    const selectedItemList = [];
    const title = {
      id: 'abc',
      defaultMessage: 'Multi Preference Toggle',
    };
    describe('multi item preference list rendered', () => {
      describe('preference list rendered', () => {
        const rendered = shallow(
          <CollapsibleMultiselect
            title={title}
            items={itemList}
            toggleSelection={() => {}}
            selectedItems={selectedItemList}
          />
        );
        it('renders the multiple preference options', () => {
          expect(rendered).toMatchSnapshot();
        });
      });
    });
    describe('multi item preference list rendered with select all button', () => {
      describe('preference list rendered', () => {
        const rendered = shallow(
          <CollapsibleMultiselect
            title={title}
            items={itemList}
            toggleSelection={() => {}}
            selectAllBtn
            selectedItems={selectedItemList}
            open
          />
        );
        it('renders the multiple preference options with select all button and open by default', () => {
          expect(rendered).toMatchSnapshot();
        });
      });
    });
  });
});
