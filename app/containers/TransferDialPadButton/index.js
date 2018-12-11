import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import CircleIconButton from 'components/CircleIconButton';
import { selectShowTransferDialpad } from '../TransferMenu/selectors';
import { setShowTransferDialPad } from '../TransferMenu/actions';
import messages from './messages';

const DialpadButtonContainer = styled.div`
  background: #f3f3f3;
  border-top: 1px solid #d0d0d0;
  padding: 10px 0;
`;

export class TransferDialPadButton extends React.PureComponent {
  render() {
    return (
      <DialpadButtonContainer>
        <CircleIconButton
          id="transferDialpadButton"
          title={
            !this.props.showTransferDialpad
              ? messages.externalParticipantDialpad
              : messages.backtoTransferMenu
          }
          name={
            this.props.showTransferDialpad ? 'transfer_dark' : 'dialpad_dark'
          }
          active={false}
          onClick={() =>
            !this.props.showTransferDialpad
              ? this.props.setShowTransferDialPad(true)
              : this.props.setShowTransferDialPad(false)
          }
          style={{ display: 'block', margin: '0 auto' }}
        />
      </DialpadButtonContainer>
    );
  }
}
export const mapStateToProps = (state, props) => ({
  showTransferDialpad: selectShowTransferDialpad(state, props),
});
export const mapDispatchToProps = (dispatch) => ({
  setShowTransferDialPad: (showTransferDialpad) =>
    dispatch(setShowTransferDialPad(showTransferDialpad)),
});
TransferDialPadButton.propTypes = {
  showTransferDialpad: PropTypes.bool.isRequired,
  setShowTransferDialPad: PropTypes.func.isRequired,
};
export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferDialPadButton)
);
