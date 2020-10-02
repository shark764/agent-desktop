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

const presenceStateIconColor = (presenceStateIconType, primaryColor) => {
  switch (presenceStateIconType) {
    case 'secondary':
      return 'rgb(153, 153, 153)';
    case 'offline':
      return 'rgb(96, 106, 109)';
    case 'ready':
      return 'rgb(76, 192, 131)';
    case 'notready':
      return 'rgb(167, 62, 83)';
    case 'primary':
    default:
      return primaryColor;
  }
};

const SVGStyles = css`
  fill: ${(props) =>
    presenceStateIconColor(
      props.presenceStateIconType,
      props.theme.primaryColor
    )};
`;
const StyledPath = styled.path`
  ${SVGStyles};
`;

const StyledPolyline = styled.polyline`
  ${SVGStyles};
`;
const StyledRect = styled.rect`
  ${SVGStyles};
`;

function PresenceStateIconSVG(props) {
  let iconPath =
    'm20 12a8 8 0 1 1 -5.8-7.69l1.57-1.57a9.82 9.82 0 0 0 -3.77-.74 10 10 0 1 0 10 10m-14.09-1.92-1.41 1.42 4.5 4.5 10-10-1.41-1.42-8.59 8.59z';
  switch (props.presenceStateMode) {
    case 'notready':
      iconPath =
        'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z';
      break;
    case 'offline':
      iconPath =
        'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z';
      break;
    case 'ready':
    default:
      break;
  }
  return (
    <>
      <SvgWrapper
        size={props.size}
        className={`PresenceStateIconSVG ${props.className}`}
        onClick={props.onClick}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 24 24"
        >
          {props.presenceStateMode === 'offline' && (
            <StyledPolyline
              presenceStateIconType={props.presenceStateIconType}
              xmlns="http://www.w3.org/2000/svg"
              points="7.74 14.84 10.6 12 7.74 9.16 9.16 7.74 12.03 10.56 14.84 7.74 16.26 9.16 13.44 12 16.26 14.84 14.84 16.26 12.03 13.41 9.16 16.26 7.74 14.84"
            />
          )}
          <StyledPath
            presenceStateIconType={props.presenceStateIconType}
            className="icon"
            d={iconPath}
          />
          {props.presenceStateMode === 'notready' && (
            <StyledRect
              presenceStateIconType={props.presenceStateIconType}
              xmlns="http://www.w3.org/2000/svg"
              x="7.41"
              y="11"
              width="9.17"
              height="2"
            />
          )}
        </svg>
      </SvgWrapper>
    </>
  );
}
PresenceStateIconSVG.propTypes = {
  presenceStateIconType: PropTypes.oneOf([
    'primary',
    'secondary',
    'ready',
    'notready',
    'offline',
  ]),
  presenceStateMode: PropTypes.oneOf(['ready', 'notready', 'offline']),
  className: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

PresenceStateIconSVG.defaultProps = {
  presenceStateIconType: 'primary',
  presenceStateMode: 'inbound',
  size: 25,
};

export default PresenceStateIconSVG;
