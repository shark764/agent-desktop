import React from 'react';
import { shallow } from 'enzyme';
import { mockStore } from '../../../utils/test';
import TransferDialPadButtonContainer, {
  TransferDialPadButton,
  mapStateToProps,
  mapDispatchToProps,
} from '../index';

jest.mock('../../TransferMenu/selectors', () => ({
  selectShowTransferDialpad: () => 'mock selectShowTransferDialpad',
}));
jest.mock('../../TransferMenu/actions', () => ({
  setShowTransferDialPad: () => 'mock setShowTransferDialPad',
}));

describe('TransferDialPadButton component render', () => {
  it('when showTransferDialpad is false', () => {
    const component = shallow(
      <TransferDialPadButton
        showTransferDialpad={false}
        setShowTransferDialPad={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('when showTransferDialpad is true', () => {
    const component = shallow(
      <TransferDialPadButton
        showTransferDialpad
        setShowTransferDialPad={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
describe('TransferDialPadButton component event handlers', () => {
  it('onClick event', () => {
    const mockSetShowTransferDialPad = jest.fn(() => true);
    const component = shallow(
      <TransferDialPadButton
        showTransferDialpad={false}
        setShowTransferDialPad={mockSetShowTransferDialPad}
      />
    );
    component.find('#transferDialpadButton').simulate('click');
    expect(mockSetShowTransferDialPad).toMatchSnapshot();
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
    shallow(<TransferDialPadButtonContainer store={mockStore} />);
  });
});
