import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import CheckedIconSVG from 'components/CheckedIconSVG';

const Device = styled.div`
  padding: 5px;
  cursor: pointer;
  text-overflow: ellipsis;
  &:not([disabled]):hover {
    background-color: #def8fe;
  }
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      color: rgb(151, 151, 151);
    `};
`;

const CheckStatusIconSVG = styled(CheckedIconSVG)`
  float: right;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

export const DeviceOption = ({ device, handleClick, disabled }) => (
  <Device
    id={`audiooutput-DeviceOption-${device.id}`}
    onClick={!disabled ? () => handleClick(device.id) : undefined}
    disabled={disabled}
  >
    {device.label}

    {device.isActive && (
      <CheckStatusIconSVG
        size={17}
        alt="selected"
        fillColor="black"
        disabled={disabled}
      />
    )}
  </Device>
);

DeviceOption.propTypes = {
  device: PropTypes.shape({
    label: PropTypes.string,
    isActive: PropTypes.bool,
    id: PropTypes.string,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

DeviceOption.defaultProps = {
  disabled: false,
};

export default DeviceOption;
