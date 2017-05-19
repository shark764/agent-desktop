/**
*
* ContactSectionHeader
*
*/

import React, { PropTypes } from 'react';


import Radium from 'radium';

function ContactSectionHeader(props) {
  const styles = {
    base: {
      height: '17px',
      fontSize: '15px',
      lineHeight: '18px',
      marginBottom: '8px',
    },
  };

  return (
    <div style={styles.base}>
      {props.label}
    </div>
  );
}

ContactSectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Radium(ContactSectionHeader);
