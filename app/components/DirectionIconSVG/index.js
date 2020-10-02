import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const SvgWrapper = styled.div`
  display: inline-block;
  cursor: pointer;
  &:hover > svg > .icon {
    fill: darken(0.3, ${(props) => props.theme.primaryColor});
  }
  ${(props) => props.size && `width: ${props.size}px;`};
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `};
`;
const StyledPath = styled.path`
  fill: ${(props) => props.theme.primaryColor};
  ${(props) =>
    (props.closeIconType === undefined || props.closeIconType === 'primary') &&
    css`
      fill: ${props.theme.primaryColor};
    `};
  ${(props) =>
    props.closeIconType === 'secondary' &&
    css`
      fill: rgb(153, 153, 153);
    `};
  ${(props) =>
    props.fillColor !== undefined &&
    css`
      fill: ${props.fillColor};
    `};
`;

function DirectionIconSVG(props) {
  let iconPath =
    'M21.05,11.07H17.58V7.26a3.16,3.16,0,0,0-3.15-3.15H5.17A3.15,3.15,0,0,0,2,7.26v9.48a3.15,3.15,0,0,0,3.15,3.15h9.26a3.16,3.16,0,0,0,3.15-3.15V12.93h3.47a.93.93,0,0,0,0-1.86Zm-5.53,0H9.05L11,8.9a.92.92,0,0,0-.09-1.3.93.93,0,0,0-1.31.08L5.78,12l3.77,4.32a.93.93,0,0,0,1.31.08A.92.92,0,0,0,11,15.1l-1.9-2.17h6.47v3.81a1.09,1.09,0,0,1-1.09,1.1H5.17a1.09,1.09,0,0,1-1.09-1.1V7.26a1.09,1.09,0,0,1,1.09-1.1h9.26a1.09,1.09,0,0,1,1.09,1.1Z';
  switch (props.directionMode) {
    case 'outbound':
      iconPath =
        'M19.26,7.68A.92.92,0,0,0,17.87,8.9l1.9,2.17H16.52V7.26a3.16,3.16,0,0,0-3.15-3.15H4.11A3.15,3.15,0,0,0,1,7.26v9.48a3.15,3.15,0,0,0,3.15,3.15h9.26a3.16,3.16,0,0,0,3.15-3.15V12.93h3.25l-1.9,2.17a.92.92,0,0,0,1.39,1.22L23,12Zm-4.8,3.39H7.76a.93.93,0,0,0,0,1.86h6.7v3.81a1.09,1.09,0,0,1-1.09,1.1H4.11A1.1,1.1,0,0,1,3,16.74V7.26a1.1,1.1,0,0,1,1.1-1.1h9.26a1.09,1.09,0,0,1,1.09,1.1Z';
      break;
    case 'agent-initiated':
      iconPath =
        'M20.58,6a3.18,3.18,0,0,0-2.89-1.9H6.31A3.15,3.15,0,0,0,3.16,7.26v9.48A3.13,3.13,0,0,0,5,19.58a3.14,3.14,0,0,0,1.34.31H17.69a3.15,3.15,0,0,0,3.15-3.15V7.26A3.21,3.21,0,0,0,20.58,6ZM5.21,16.44V7.26a1.1,1.1,0,0,1,1.1-1.1H17Zm13.58.3a1.1,1.1,0,0,1-1.1,1.1H7L18.79,7.56Z';
      break;
    case 'inbound':
    default:
      break;
  }
  return (
    <>
      <SvgWrapper
        size={props.size}
        className={`DirectionIconSVG ${props.className}`}
        onClick={props.onClick}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 24 24"
        >
          <StyledPath
            directionIconType={props.directionIconType}
            className="icon"
            d={iconPath}
            fillColor={props.fillColor}
          />
        </svg>
      </SvgWrapper>
    </>
  );
}
DirectionIconSVG.propTypes = {
  directionIconType: PropTypes.oneOf(['primary', 'secondary']),
  directionMode: PropTypes.oneOf(['inbound', 'outbound', 'agent-initiated']),
  className: PropTypes.string,
  fillColor: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

DirectionIconSVG.defaultProps = {
  directionIconType: 'primary',
  directionMode: 'inbound',
  size: 25,
};

export default DirectionIconSVG;
