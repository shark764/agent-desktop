/*
 *
 * ContentArea
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';

function ContentArea(props) {
  const styles = {
    base: {
      display: 'flex',
      flexFlow: 'column',
      backgroundColor: '#F3F3F3',
      height: '100%',
      padding: '5px',
    },
    header: {
      flex: '0 1 auto',
      padding: '0 10px',
    },
    fromButtonsContainer: {
      borderBottom: '1px solid #D0D0D0',
      padding: '10px 5px 15px',
    },
    from: {
      width: 'calc(100% - 160px)',
      display: 'inline-block',
      fontSize: '20px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    buttons: {
      float: 'right',
    },
    details: {
      fontSize: '12px',
      padding: '10px',
    },
    content: {
      flex: '1 1 auto',
      position: 'relative',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E4E4E4',
    },
  };

  return (
    <div style={styles.base}>
      <div style={styles.header}>
        <div style={styles.fromButtonsContainer}>
          <div style={styles.from}>
            {props.from}
          </div>
          <div style={styles.buttons}>
            {props.buttons}
          </div>
        </div>
        <div style={styles.details}>
          {props.details}
        </div>
      </div>
      <div style={styles.content}>
        {props.content}
      </div>
    </div>
  );
}

ContentArea.propTypes = {
  from: PropTypes.node.isRequired,
  buttons: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
};

export default Radium(ContentArea);
