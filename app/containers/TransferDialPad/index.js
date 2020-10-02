import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ErrorBoundary from 'components/ErrorBoundary';

import Dialpad from 'components/Dialpad';
import Button from 'components/Button';

import messages from 'containers/TransferMenu/messages';
import {selectTransferTabIndex} from '../TransferMenu/selectors';
import { updateDialpadText } from './actions';
import { selectDialpadTextValidity, selectDialpadText } from './selectors';

const DialpadContainer = styled.div`
  padding: 24px 12px;
`;

export class TransferDialPad extends React.Component {
  componentDidMount() {
    this.props.updateDialpadText('');
  }

  render() {
    return (
      <div>
        <DialpadContainer>
          <Dialpad
            id="dialpad"
            setDialpadText={(dialpadText) =>
              this.props.updateDialpadText(dialpadText)}
            onEnter={() =>
              this.props.transferFromDialpad(this.props.dialpadText)}
            dialpadText={this.props.dialpadText}
            active={false}
            transfer
          />
          <Button
            id="extParticipantTransferButton"
            text={
              this.props.transferTabIndex === 0
                ? messages.addParticipant
                : messages.transfer
            }
            disabled={!this.props.dialpadTextValidity}
            onClick={() =>
              this.props.transferFromDialpad(this.props.dialpadText)}
            type="primaryBlue"
            style={{
              display: 'block',
              margin: '24px auto 0',
              width: '134px',
            }}
          />
        </DialpadContainer>
      </div>
    );
  }
}

export const mapStateToProps = (state, props) => ({
  dialpadTextValidity: selectDialpadTextValidity(state, props),
  dialpadText: selectDialpadText(state, props),
  transferTabIndex: selectTransferTabIndex(state, props),  
});

export const mapDispatchToProps = (dispatch) => ({
  updateDialpadText: (dialpadText) => dispatch(updateDialpadText(dialpadText)),
});

TransferDialPad.propTypes = {
  dialpadTextValidity: PropTypes.bool.isRequired,
  dialpadText: PropTypes.string.isRequired,
  updateDialpadText: PropTypes.func.isRequired,
  transferTabIndex: PropTypes.number.isRequired,
  transferFromDialpad: PropTypes.func.isRequired,
};

export default ErrorBoundary(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferDialPad)
);
