import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PreferenceOption from 'components/PreferenceOption';

import DeviceOption from './DeviceOption';

const DevicesContainer = styled.div`
  margin-left: 15px;
`;

/**
 * 'media' | 'notifications' | 'voice'
 */
export class DeviceMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  setOpen = () => {
    this.setState((state) => ({
      open: !state.open,
    }));
  };

  render() {
    const activeDevicesCount = this.props.devices.filter(
      (device) => device.isActive
    ).length;

    return (
      <Fragment>
        <PreferenceOption
          preference={this.props.audio}
          label={this.props.label}
          setPreferenceSelected={this.setOpen}
          caretDirection="down"
          open={this.state.open}
        />
        {this.state.open && (
          <DevicesContainer>
            {this.props.devices.map((device) => {
              /**
               * We disable devices when they're the only
               * one selected
               */
              const disabled = device.isActive && activeDevicesCount === 1;

              return (
                <DeviceOption
                  key={device.id}
                  device={device}
                  handleClick={this.props.setDeviceAsActive}
                  disabled={disabled}
                />
              );
            })}
          </DevicesContainer>
        )}
      </Fragment>
    );
  }
}

DeviceMenu.propTypes = {
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      isActive: PropTypes.bool,
      id: PropTypes.string,
    })
  ).isRequired,
  audio: PropTypes.string.isRequired,
  label: PropTypes.object.isRequired,
  setDeviceAsActive: PropTypes.func.isRequired,
};

export default DeviceMenu;
