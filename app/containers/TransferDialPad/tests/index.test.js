import React from 'react';
import { shallow } from 'enzyme';
import { mockStore } from '../../../utils/test';
import TransferDialPadContainer, {
  TransferDialPad,
  mapStateToProps,
  mapDispatchToProps,
} from '../index';

jest.mock('../selectors', () => ({
  selectDialpadTextValidity: () => 'mock selectDialpadTextValidity',
  selectDialpadText: () => 'mock selectDialpadText',
}));
jest.mock('../../TransferMenu/selectors', () => ({
  selectTransferTabIndex: () => 'mock selectTransferTabIndex',
}));
jest.mock('../actions', () => ({
  updateDialpadText: () => 'mock updateDialpadText',
}));

describe('TransferDialPad component render', () => {
  it('when transferTabIndex is 0 & dialpadText is invalid', () => {
    const component = shallow(
      <TransferDialPad
        transferTabIndex={0}
        dialpadTextValidity={false}
        dialpadText="mockInvalidDialpadText"
        updateDialpadText={() => {}}
        transferFromDialpad={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('when transferTabIndex is 1 & dialpadText is valid', () => {
    const component = shallow(
      <TransferDialPad
        transferTabIndex={1}
        dialpadTextValidity
        dialpadText="mockValidDialpadText"
        updateDialpadText={() => {}}
        transferFromDialpad={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
describe('TransferDialPad component event handlers', () => {
  it('extParticipantTransferButton onClick event', () => {
    const mockTransferFromDialpad = jest.fn(
      () => 'mockValidTransferToDialpadText'
    );
    const rendered = shallow(
      <TransferDialPad
        transferTabIndex={0}
        dialpadTextValidity
        dialpadText="mockValidDialpadText"
        updateDialpadText={() => {}}
        transferFromDialpad={mockTransferFromDialpad}
      />
    );
    rendered.find('#extParticipantTransferButton').simulate('click');
    expect(mockTransferFromDialpad).toMatchSnapshot();
  });
  it('dialpad onEnter event', () => {
    const mockTransferFromDialpad = jest.fn(
      () => 'mockValidTransferToDialpadText'
    );
    const rendered = shallow(
      <TransferDialPad
        transferTabIndex={0}
        dialpadTextValidity
        dialpadText="mockValidDialpadText"
        updateDialpadText={() => {}}
        transferFromDialpad={mockTransferFromDialpad}
      />
    );
    rendered.find('#dialpad').simulate('enter');
    expect(mockTransferFromDialpad).toMatchSnapshot();
  });
});
describe('mapStateToProps', () => {
  it('should map redux-states from selectors to component-props correctly', () => {
    expect(mapStateToProps()).toMatchSnapshot();
  });
});
describe('mapDispatchToProps', () => {
  it('should map actions from action-creators to component-props correctly', () => {
    expect(mapDispatchToProps()).toMatchSnapshot();
  });
});
describe('TransferDialPadButton connected component render', () => {
  it('renders with store', () => {
    shallow(<TransferDialPadContainer store={mockStore} />);
  });
});
