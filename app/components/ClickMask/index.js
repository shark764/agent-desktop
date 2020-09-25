import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ClickMaskDiv = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

function ClickMask(props) {
  return (
    <ClickMaskDiv
      className={props.className}
      onClick={props.onClick ? props.onClick : undefined}
    />
  );
}

ClickMask.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default ClickMask;
