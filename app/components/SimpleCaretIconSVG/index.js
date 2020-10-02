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
const SVGStyles = css`
  fill: ${(props) => props.theme.primaryColor};
  ${(props) =>
    (props.simpleCaretIconType === undefined ||
      props.simpleCaretIconType === 'primary') &&
    css`
      fill: ${props.theme.primaryColor};
    `};
  ${(props) =>
    props.simpleCaretIconType === 'secondary' &&
    css`
      fill: rgb(153, 153, 153);
    `};
  ${(props) =>
    props.fillColor !== undefined &&
    css`
      fill: ${props.fillColor};
    `};
`;
const StyledPath = styled.path`
  ${SVGStyles};
`;

function SimpleCaretIconSVG(props) {
  let iconPath =
    'M213.13,222.409L351.88,83.653c7.05-7.043,10.567-15.657,10.567-25.841c0-10.183-3.518-18.793-10.567-25.835   l-21.409-21.416C323.432,3.521,314.817,0,304.637,0s-18.791,3.521-25.841,10.561L92.649,196.425   c-7.044,7.043-10.566,15.656-10.566,25.841s3.521,18.791,10.566,25.837l186.146,185.864c7.05,7.043,15.66,10.564,25.841,10.564   s18.795-3.521,25.834-10.564l21.409-21.412c7.05-7.039,10.567-15.604,10.567-25.697c0-10.085-3.518-18.746-10.567-25.978   L213.13,222.409z';
  let iconViewBox = '0 0 444.531 444.531';
  switch (props.direction) {
    case 'right':
      iconPath =
        'M352.025,196.712L165.884,10.848C159.029,3.615,150.469,0,140.187,0c-10.282,0-18.842,3.619-25.697,10.848L92.792,32.264   c-7.044,7.043-10.566,15.604-10.566,25.692c0,9.897,3.521,18.56,10.566,25.981l138.753,138.473L92.786,361.168   c-7.042,7.043-10.564,15.604-10.564,25.693c0,9.896,3.521,18.562,10.564,25.98l21.7,21.413   c7.043,7.043,15.612,10.564,25.697,10.564c10.089,0,18.656-3.521,25.697-10.564l186.145-185.864   c7.046-7.423,10.571-16.084,10.571-25.981C362.597,212.321,359.071,203.755,352.025,196.712z';
      iconViewBox = '0 0 444.819 444.819';
      break;
    case 'up':
      iconPath =
        'M433.968,278.657L248.387,92.79c-7.419-7.044-16.08-10.566-25.977-10.566c-10.088,0-18.652,3.521-25.697,10.566   L10.848,278.657C3.615,285.887,0,294.549,0,304.637c0,10.28,3.619,18.843,10.848,25.693l21.411,21.413   c6.854,7.23,15.42,10.852,25.697,10.852c10.278,0,18.842-3.621,25.697-10.852L222.41,213.271L361.168,351.74   c6.848,7.228,15.413,10.852,25.7,10.852c10.082,0,18.747-3.624,25.975-10.852l21.409-21.412   c7.043-7.043,10.567-15.608,10.567-25.693C444.819,294.545,441.205,285.884,433.968,278.657z';
      iconViewBox = '0 0 444.819 444.819';
      break;
    case 'down':
      iconPath =
        'M434.252,114.203l-21.409-21.416c-7.419-7.04-16.084-10.561-25.975-10.561c-10.095,0-18.657,3.521-25.7,10.561   L222.41,231.549L83.653,92.791c-7.042-7.04-15.606-10.561-25.697-10.561c-9.896,0-18.559,3.521-25.979,10.561l-21.128,21.416   C3.615,121.436,0,130.099,0,140.188c0,10.277,3.619,18.842,10.848,25.693l185.864,185.865c6.855,7.23,15.416,10.848,25.697,10.848   c10.088,0,18.75-3.617,25.977-10.848l185.865-185.865c7.043-7.044,10.567-15.608,10.567-25.693   C444.819,130.287,441.295,121.629,434.252,114.203z';
      iconViewBox = '0 0 444.819 444.819';
      break;
    case 'left':
    default:
      break;
  }
  return (
    <>
      <SvgWrapper
        size={props.size}
        className={`SimpleCaretIconSVG ${props.className}`}
        onClick={props.onClick}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox={iconViewBox}
        >
          <StyledPath
            simpleCaretIconType={props.simpleCaretIconType}
            className="icon"
            d={iconPath}
            fillColor={props.fillColor}
          />
        </svg>
      </SvgWrapper>
    </>
  );
}
SimpleCaretIconSVG.propTypes = {
  simpleCaretIconType: PropTypes.oneOf(['primary', 'secondary']),
  direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  className: PropTypes.string,
  fillColor: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

SimpleCaretIconSVG.defaultProps = {
  simpleCaretIconType: 'primary',
  direction: 'inbound',
  size: 25,
};

export default SimpleCaretIconSVG;
