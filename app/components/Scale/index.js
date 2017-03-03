/**
*
* Scale
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

class Scale extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  styles = {
    base: {
      // styles
    },
  }
  render() {
    return (
      <div style={this.styles.base}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

export default Radium(Scale);
