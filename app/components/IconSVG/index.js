/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Icon
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

export const availableIcons = [
  'dialpad',
  'loading',
  'loadingWhite',
  'add',
  'close',
  'attachment',
];

function IconSVG(props) {
  let icon;
  switch (props.name) {
    case 'dialpad':
      icon = (
        <svg x="0px" y="0px" viewBox="0 0 20 20">
          <path d="M6,5H3V4c0-1.1,0.9-2,2-2h1V5z" />
          <rect x="8" y="2" width="3" height="3" />
          <path d="M16,5h-3V2h1c1.1,0,2,0.9,2,2V5z" />
          <rect x="3" y="7" width="3" height="3" />
          <rect x="8" y="7" width="3" height="3" />
          <rect x="13" y="7" width="3" height="3" />
          <path d="M6,15H4c-0.6,0-1-0.4-1-1v-2h3V15z" />
          <rect x="8" y="12" width="3" height="3" />
          <path d="M15,15h-2v-3h3v2C16,14.6,15.6,15,15,15z" />
          <path d="M10,20H9c-0.6,0-1-0.4-1-1v-2h3v2C11,19.6,10.6,20,10,20z" />
        </svg>
      );
      break;
    case 'loading':
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          className="uil-ring"
        >
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            className="bk"
          />
          <defs>
            <filter
              id="uil-ring-shadow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <path
            d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z"
            fill="#23cef5"
            filter="url(#uil-ring-shadow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
              dur="1.3s"
            />
          </path>
        </svg>
      );
      break;
    case 'loadingWhite':
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          className="uil-ring"
        >
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            className="bk"
          />
          <defs>
            <filter
              id="uil-ring-shadow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <path
            d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z"
            fill="#ffffff"
            filter="url(#uil-ring-shadow)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
              dur="1.3s"
            />
          </path>
        </svg>
      );
      break;
    case 'add':
      icon = (
        <svg viewBox="0 0 40 40">
          {' '}
          <path
            style={{
              stroke: props.color || 'white',
              fill: 'transparent',
              strokeWidth: 5,
              strokeLinecap: 'round',
            }}
            d="M 20,30 L 20,10 M 10,20 L 30,20 "
          />
        </svg>
      );
      break;
    case 'close':
      icon = (
        <svg viewBox="0 0 40 40">
          {' '}
          <path
            style={{
              stroke: props.color || 'white',
              fill: 'transparent',
              strokeWidth: 5,
              strokeLinecap: 'round',
            }}
            d="M 10,10 L 30,30 M 30,10 L 10,30"
          />
        </svg>
      );
      break;
    case 'collapse':
      icon = (
        <svg
          id={props.id}
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 20 20"
          style={[{ enableBackground: 'new 0 0 20 20' }, props.style]}
          onClick={props.onClick}
        >
          <style
            type="text/css"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `.st3{fill:none;stroke:${
                props.color
              };stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;} .st4{fill:none;stroke:${
                props.color
              };stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}`,
            }}
          />
          <polyline className="st3" points="6,10 10,13.5 14,10" />
          <line className="st3" x1="10" y1="2.5" x2="10" y2="12.5" />
          <line className="st4" x1="1.6" y1="18" x2="18.2" y2="18" />
        </svg>
      );
      break;
    case 'attachment':
      icon = (
        <svg
          id={props.id}
          version="1.1"
          x="0px"
          y="0px"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="svg-inline--fa fa-copy fa-w-14 fa-2x"
        >
          <path
            style={{
              stroke: props.color || 'white',
              strokeWidth: 5,
              strokeLinecap: 'round',
            }}
            d="M410.823,21.333c-27.021,0-52.438,10.521-71.542,29.635L106.135,284.115c-13.417,13.417-20.802,31.24-20.802,50.208    c0,39.156,31.854,71.01,71.01,71.01c18.969,0,36.792-7.385,50.208-20.802l216.99-216.99c4.167-4.167,4.167-10.917,0-15.083    c-4.167-4.167-10.917-4.167-15.083,0l-216.99,216.99C182.083,378.833,169.615,384,156.344,384    c-27.396,0-49.677-22.281-49.677-49.677c0-13.271,5.167-25.74,14.552-35.125L354.365,66.052    c15.083-15.083,35.135-23.385,56.458-23.385c44.021,0,79.844,35.823,79.844,79.844c0,21.323-8.302,41.375-23.385,56.458    L209.135,437.115c-20.781,20.781-48.406,32.219-77.792,32.219c-60.656,0-110.01-49.354-110.01-110.01    c0-29.385,11.438-57.01,32.219-77.792l241.99-241.99c4.167-4.167,4.167-10.917,0-15.083c-4.167-4.167-10.917-4.167-15.083,0    l-241.99,241.99C13.656,291.25,0,324.24,0,359.323c0,72.427,58.917,131.344,131.344,131.344c35.083,0,68.073-13.656,92.875-38.469    l258.146-258.146C501.479,174.948,512,149.531,512,122.51C512,66.719,466.615,21.333,410.823,21.333z"
          />
        </svg>
      );
      break;
    default:
      break;
  }

  return (
    <div
      id={props.id}
      style={[
        {
          width: props.width,
          color: props.color,
          cursor: 'pointer',
          margin: '0px auto',
        },
        props.style,
      ]}
      onClick={props.onClick}
    >
      {icon}
    </div>
  );
}

IconSVG.propTypes = {
  color: PropTypes.string,
  width: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.oneOf(availableIcons).isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default Radium(IconSVG);
