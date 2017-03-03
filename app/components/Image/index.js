/**
*
* Image
*
*/

import React from 'react';

import Radium from 'radium';

class Image extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      // styles
    },
  }
  render() {
    return (
      <div style={this.styles.base}>
      </div>
    );
  }
}

export default Radium(Image);
