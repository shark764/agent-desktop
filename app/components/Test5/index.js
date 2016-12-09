/**
*
* Test5
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Radium from 'radium';

class Test5 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
    const styles = {
      base: {
        // styles
      },
    }
  render() {
    return (
      <div style={styles.base}>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

  export default Radium(Test5);
