import React from 'react';
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
    return (
      <>
        <PreferenceOption
          preference={this.props.audio}
          label={this.props.label}
          setPreferenceSelected={this.setOpen}
          caretDirection="down"
          open={this.state.open}
        />
        {this.state.open && (
          <DevicesContainer>
            {this.props.devices.map((device) => (
              <DeviceOption
                key={device.id}
                device={device}
                handleClick={this.props.setDeviceAsActive}
                /**
                 * We disable devices when they're the only
                 * one selected
                 */
                disabled={device.isActive}
              />
            ))}
          </DevicesContainer>
        )}
      </>
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
