/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * Tabs
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { Tabs as ReactTabs } from 'react-tabs';

function Tabs(props) {
  const commonTabStyles = {
    '.react-tabs__tab:first-child': {
      paddingLeft: 0,
    },
    '.react-tabs__tab--selected:first-child::after': {
      content: "''",
      width: 'calc(100% - 12px)',
      left: '0px',
    },
    '.react-tabs__tab:not(.react-tabs__tab--selected)': {
      color: '#979797',
    },
    '.react-tabs__tab--disabled': {
      cursor: 'default',
    },
    '.react-tabs__tab:focus': {
      boxShadow: '0 0 0',
      border: 'none',
      outline: 'none',
    },
    '.react-tabs__tab:focus::after': {
      boxShadow: '0 0 5px hsl(208, 99%, 50%)',
      borderColor: 'hsl(208, 99%, 50%)',
      outline: 'none',
    },
  };

  let tabsStyleElement;
  if (props.type === 'small') {
    tabsStyleElement = (
      <Radium.Style
        scopeSelector={`#${props.id} .react-tabs`}
        rules={({
          color: '#4B4B4B',
          '.react-tabs__tab-list': {
            backgroundColor: '#F3F3F3',
            borderBottom: '1px solid #D0D0D0',
            padding: '0 32px',
            margin: '0',
            maxHeight: 100,
            boxSizing: 'border-box',
          },
          '.react-tabs__tab': {
            fontWeight: 'bold',
            backgroundColor: '#F3F3F3',
            display: 'inline-block',
            border: '1px solid transparent',
            borderBottom: 'none',
            bottom: '-1px',
            position: 'relative',
            listStyle: 'none',
            padding: '10px 12px',
            marginBottom: '1px',
            cursor: 'pointer',
          },
          '.react-tabs__tab--selected::after': {
            content: "''",
            width: 'calc(100% - 24px)',
            left: '12px',
            height: '3px',
            background: '#4B4B4B',
            position: 'absolute',
            bottom: 0,
          },
          ...commonTabStyles,
        })}
      />
    );
  } else {
    tabsStyleElement = (
      <Radium.Style
        scopeSelector={`#${props.id} .react-tabs`}
        rules={({
          color: '#4B4B4B',
          '.react-tabs__tab-list': {
            flexGrow: '0',
            flexShrink: '0',
            order: '0',
            borderBottom: '1px solid #D0D0D0',
            padding: '10px 5px 15px 0',
            margin: '0',
            height: `${props.topBarHeightPx}px`,
            boxSizing: 'border-box',
          },
          '.react-tabs__tab-panel--selected': {
            height: `calc(100% - ${props.topBarHeightPx}px)`,
            alignSelf: 'stretch',
          },
          '.react-tabs__tab': {
            fontWeight: 'bold',
            backgroundColor: '#FFFFFF',
            display: 'inline-block',
            border: '1px solid transparent',
            borderBottom: 'none',
            bottom: '-1px',
            position: 'relative',
            listStyle: 'none',
            padding: '6px 12px',
            cursor: 'pointer',
          },
          '.react-tabs__tab--selected::after': {
            content: "''",
            width: 'calc(100% - 24px)',
            left: '12px',
            height: '4px',
            background: '#4B4B4B',
            position: 'absolute',
            bottom: '-14px',
          },
          ...commonTabStyles,
        })}
      />
    );
  }

  return (
    <div id={props.id} style={[props.style, { width: '100%' }]}>
      {tabsStyleElement}
      <ReactTabs
        selectedIndex={props.selectedIndex}
        onSelect={props.onSelect}
        style={props.tabsRootStyle}
      >
        {props.children}
      </ReactTabs>
    </div>
  );
}

Tabs.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['big', 'small']).isRequired,
  children: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  onSelect: PropTypes.func,
  style: PropTypes.object,
  tabsRootStyle: PropTypes.object,
  topBarHeightPx: PropTypes.number,
};

export default Radium(Tabs);
