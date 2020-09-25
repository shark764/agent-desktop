import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from 'utils/constants';

const SvgWrapper = styled.div`
  ${(props) => {
    if (props.size) {
      return `width: ${props.size}px;`;
    } else if (props.type === 'callback') {
      return `width: 32px;`;
    } else {
      return `width: 16px;`;
    }
  }}
  };
`;

export default function VoiceIconSVG({ size, color, type }) {
  let fillColor = colors.skylightBlue;
  let viewBoxWidth = 150;
  if (color === 'white') {
    fillColor = colors.white;
  }
  if (type === 'callback') {
    viewBoxWidth = 300;
  }
  return (
    <SvgWrapper type={type} size={size}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} 200`}
      >
        <line
          x1="36.25"
          y1="197.03"
          x2="110.17"
          y2="197.03"
          style={{
            fill: 'none',
            stroke: fillColor,
            strokeLinecap: 'round',
            strokeMiterlimit: 10,
            strokeWidth: '17px',
          }}
        />
        <rect
          x="26.65"
          y="6"
          width="89.28"
          height="141.11"
          rx="44.64"
          ry="44.64"
          style={{ fill: fillColor }}
        />
        <path
          d="M315.29,238v14.38A65.48,65.48,0,0,1,250,317.68h0a65.48,65.48,0,0,1-65.29-65.29V238"
          transform="translate(-178.71 -148.48)"
          style={{
            fill: 'none',
            stroke: fillColor,
            strokeLinecap: 'round',
            strokeMiterlimit: 10,
            strokeWidth: '12px',
          }}
        />
        {type === 'callback' && (
          <React.Fragment>
            <circle cx="200" cy="100" r="15" style={{ fill: fillColor }} />
            <circle cx="240" cy="100" r="15" style={{ fill: fillColor }} />
            <circle cx="280" cy="100" r="15" style={{ fill: fillColor }} />
          </React.Fragment>
        )}
      </svg>
    </SvgWrapper>
  );
}

VoiceIconSVG.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOf(['blue', 'white']),
  type: PropTypes.oneOf(['default', 'callback']),
};

VoiceIconSVG.defaultProps = {
  color: 'blue',
  type: 'default',
};
