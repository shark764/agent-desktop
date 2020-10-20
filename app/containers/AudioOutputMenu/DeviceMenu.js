import React, { useState } from 'react';
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
export const DeviceMenu = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PreferenceOption
        preference={props.audio}
        label={props.label}
        setPreferenceSelected={() => setOpen((isOpen) => !isOpen)}
        caretDirection="down"
        open={open}
      />
      {open && (
        <DevicesContainer>
          {props.devices.map((device) => (
            <DeviceOption
              key={device.id}
              device={device}
              handleClick={props.setDeviceAsActive}
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
};

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
