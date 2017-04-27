/**
*
* ConfirmDialog
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { FormattedMessage } from 'react-intl';
import PopupDialog from 'components/PopupDialog';
import Button from 'components/Button';
import messages from './messages';

const styles = {
  base: {
    borderRadius: '4px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  questionContainer: {
    alignSelf: 'center',
    paddingBottom: '16px',
    fontSize: '16px',
  },
  buttonContainer: {
    display: 'flex',
    borderTop: '1px solid #C5C5C5',
    zIndex: 2,
  },
  leftButton: {
    width: '50%',
  },
  rightButton: {
    width: '50%',
    borderLeft: '1px solid #C5C5C5',
  },
};

function ConfirmDialog(props) {
  return (
    <div style={props.style}>
      <PopupDialog isVisible={props.isVisible} hide={props.hide} widthPx={200} arrowLeftOffsetPx={42} style={styles.base} fadeContent>
        <div style={styles.container}>
          {
            props.questionMessage
            && <div style={styles.questionContainer}>
              <FormattedMessage {...props.questionMessage} />
            </div>
          }
          <div style={styles.buttonContainer}>
            <Button id="leftConfirmButton" onClick={props.leftAction} type="secondary" clear style={styles.leftButton}>
              <FormattedMessage {...props.leftMessage} />
            </Button>
            <Button id="rightConfirmButton" onClick={props.rightAction} type="secondary" clear style={styles.rightButton}>
              <FormattedMessage {...props.rightMessage} />
            </Button>
          </div>
        </div>
      </PopupDialog>
    </div>
  );
}

ConfirmDialog.propTypes = {
  questionMessage: PropTypes.object,
  leftMessage: PropTypes.object,
  rightMessage: PropTypes.object,
  leftAction: PropTypes.func.isRequired,
  rightAction: PropTypes.func.isRequired,
  hide: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

ConfirmDialog.defaultProps = {
  leftMessage: messages.no,
  rightMessage: messages.yes,
};

export default Radium(ConfirmDialog);