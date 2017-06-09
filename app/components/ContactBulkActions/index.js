/**
*
* ContactBulkActions
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { VelocityTransitionGroup } from 'velocity-react';

import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';

import messages from './messages';

function ContactBulkActions(props) {
  const styles = {
    bulkActionControlBar: {
      display: 'flex',
      flexShrink: '0',
      margin: '12px 0 12px 54px',
    },
    bulkConfirmDialog: {
      position: 'absolute',
      left: '95px',
      bottom: '50px',
    },
  };

  const velocityCleanup = (animatedElements) => {
    const bulkActionBar = animatedElements[0];
    bulkActionBar.style.transform = 'none';
  };

  return (
    <div id="bulk-action-controls" style={styles.bulkActionControlBar}>
      <div key="new-btn-container">
        <Button id="createNewRecord" type="secondary" text="New Record" onClick={props.newContact}></Button>
      </div>
      <VelocityTransitionGroup enter={{ animation: 'transition.slideUpIn', duration: '100', complete: velocityCleanup, display: 'flex' }} leave={{ animation: 'transition.slideDownOut', duration: '100' }}>
        {
          props.selectedContacts.length >= 1 &&
          <div key="delete-btn-container">
            <ConfirmDialog
              questionMessage={
                props.selectedContacts.length === 1
                ? messages.deleteContact
                : { ...messages.deleteContacts, values: { count: props.selectedContacts.length } }
              }
              leftAction={() => props.setConfirmingDelete(false)}
              rightAction={props.deleteContacts}
              isVisible={props.confirmingDelete}
              hide={() => props.setConfirmingDelete(false)}
              style={styles.bulkConfirmDialog}
            />
            <Button style={{ marginLeft: '10px' }} onClick={() => props.setConfirmingDelete(true)} id="delete-btn" text={messages.delete} type="secondary"></Button>
          </div>
        }
      </VelocityTransitionGroup>
      <VelocityTransitionGroup enter={{ animation: 'transition.slideUpIn', duration: '100', complete: velocityCleanup, display: 'flex' }} leave={{ animation: 'transition.slideDownOut', duration: '100' }}>
        {
          props.selectedContacts.length === 2 &&
          <div key="merge-btn-container">
            <Button style={{ marginLeft: '10px' }} onClick={props.setMerging} id="merge" key="merge" text="Merge" type="secondary"></Button>
          </div>
        }
      </VelocityTransitionGroup>
    </div>
  );
}

ContactBulkActions.propTypes = {
  newContact: PropTypes.func,
  selectedContacts: PropTypes.array,
  setConfirmingDelete: PropTypes.func,
  deleteContacts: PropTypes.func,
  confirmingDelete: PropTypes.bool,
  setMerging: PropTypes.func,
};

export default Radium(ContactBulkActions);
