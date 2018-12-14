/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { mockStore } from '../../../utils/test';
import OutboundAniSelectContainer, {
  OutboundAniSelect,
  mapStateToProps,
  actions,
} from '../index';

jest.mock('../selectors', () => ({
  selectOutboundIdentifierListsForChannel: () =>
    'mock SelectOutboundIdentifierListsForChannel',
  getSelectedOutboundIdentifier: () => 'mock SelectedOutboundIdentifier',
}));
jest.mock('../actions', () => ({
  selectOutboundIdentification: () => 'mock selectOutboundIdentification',
  fetchOutboundIdentifierLists: () => 'mock fetchOutboundIdentifierLists',
}));

describe('<OutboundAniSelect />', () => {
  it('rendered correctly for voice channel', () => {
    const rendered = shallow(
      <OutboundAniSelect
        store={mockStore}
        fetchOutboundIdentifierLists={() => {}}
        selectOutboundIdentification={() => {}}
        selectOutboundIdentifierListsForChannel={[
          {
            id: '1',
            value: 'outboundAni1',
          },
          {
            id: '2',
            value: 'outboundAni2',
          },
          {
            id: '3',
            value: 'outboundAni3',
          },
        ]}
        getSelectedOutboundIdentifier={{
          id: '2',
          value: 'outboundAni2',
        }}
        outboundIdentifierListHasBeenFetched
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('if getSelectedOutboundIdentifier is undefined', () => {
    const rendered = shallow(
      <OutboundAniSelect
        store={mockStore}
        fetchOutboundIdentifierLists={() => {}}
        selectOutboundIdentification={() => {}}
        selectOutboundIdentifierListsForChannel={[
          {
            id: '1',
            value: 'outboundAni1',
          },
          {
            id: '2',
            value: 'outboundAni2',
          },
          {
            id: '3',
            value: 'outboundAni3',
          },
        ]}
        getSelectedOutboundIdentifier={{}}
        outboundIdentifierListHasBeenFetched
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("doesn't render if there isn't any Outbound ANI", () => {
    const rendered = shallow(
      <OutboundAniSelect
        store={mockStore}
        fetchOutboundIdentifierLists={() => {}}
        selectOutboundIdentification={() => {}}
        selectOutboundIdentifierListsForChannel={[]}
        getSelectedOutboundIdentifier={{}}
        outboundIdentifierListHasBeenFetched
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('renders a loading icon while fetching outbound identifier lists assigned to the user', () => {
    const rendered = shallow(
      <OutboundAniSelect
        store={mockStore}
        fetchOutboundIdentifierLists={() => {}}
        selectOutboundIdentification={() => {}}
        selectOutboundIdentifierListsForChannel={undefined}
        getSelectedOutboundIdentifier={{}}
        outboundIdentifierListHasBeenFetched={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  describe('mapStateToProps', () => {
    it('maps the selectors to the object correctly', () => {
      expect(mapStateToProps()).toMatchSnapshot();
    });
  });
  describe('actions', () => {
    it('maps the actions to the object correctly', () => {
      expect(actions).toMatchSnapshot();
    });
  });
  describe('OutboundAniSelect with store', () => {
    it('renders', () => {
      shallow(<OutboundAniSelectContainer store={mockStore} />);
    });
  });
});
