/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';

import PropTypes from 'prop-types';

import Radium from 'radium';

// eslint-disable-next-line react/prefer-stateless-function
class IconCollapse extends React.Component {
  render() {
    const color = '#4B4B4B';

    return (
      <svg
        id={this.props.id}
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 20 20"
        style={[{ enableBackground: 'new 0 0 20 20' }, this.props.style]}
        onClick={this.props.onClick}
      >
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `.st3{fill:none;stroke:${color};stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}
              .st4{fill:none;stroke:${color};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}`,
          }}
        />
        <polyline className="st3" points="6,10 10,13.5 14,10" />
        <line className="st3" x1="10" y1="2.5" x2="10" y2="12.5" />
        <line className="st4" x1="1.6" y1="18" x2="18.2" y2="18" />
      </svg>
    );
  }
}

IconCollapse.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Radium(IconCollapse);
