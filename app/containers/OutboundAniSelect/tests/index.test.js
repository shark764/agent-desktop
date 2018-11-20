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
      />
    );
    expect(rendered).toMatchSnapshot();
  });
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
