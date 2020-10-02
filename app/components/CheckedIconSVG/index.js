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
    (props.checkedIconType === undefined ||
      props.checkedIconType === 'primary') &&
    css`
      fill: ${props.theme.primaryColor};
    `};
  ${(props) =>
    props.checkedIconType === 'secondary' &&
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

function CheckedIconSVG(props) {
  return (
    <>
      <SvgWrapper
        size={props.size}
        className={`CheckedIconSVG ${props.className}`}
        onClick={props.onClick}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 44 44"
        >
          <StyledPath
            checkedIconType={props.checkedIconType}
            className="icon"
            d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,15.1l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.6-0.1-0.7-0.3l-7.8-8.4-.2-.2c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.3 0.4,0.9 0,1.3z"
            fillColor={props.fillColor}
          />
        </svg>
      </SvgWrapper>
    </>
  );
}
CheckedIconSVG.propTypes = {
  checkedIconType: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
  fillColor: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

CheckedIconSVG.defaultProps = {
  checkedIconType: 'primary',
  size: 25,
};

export default CheckedIconSVG;
