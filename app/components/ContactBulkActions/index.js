/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * ContactBulkActions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Button from 'components/Button';
import ConfirmDialog from 'components/ConfirmDialog';

import messages from './messages';

function ContactBulkActions(props) {
  const styles = {
    bulkActionControlBar: {
      display: 'flex',
      flexShrink: '0',
      margin: '12px 0 12px 54px',
      position: 'relative',
    },
    bulkConfirmDialog: {
      position: 'absolute',
      left: '95px',
      bottom: '50px',
    },
  };

  const deleteContacts = () => {
    props.deleteContacts();
    props.setConfirmingDelete(false);
  };

  return (
    <div id="bulk-action-controls" style={styles.bulkActionControlBar}>
      <div key="new-btn-container">
        <Button
          id="createNewRecord"
          type="secondary"
          text={messages.newRecord}
          onClick={props.newContact}
        />
      </div>
      {props.selectedContacts.length >= 1 && (
        <div key="delete-btn-container">
          <ConfirmDialog
            questionMessage={
              props.selectedContacts.length === 1
                ? messages.deleteContact
                : {
                  ...messages.deleteContacts,
                  values: { count: props.selectedContacts.length },
                }
            }
            leftAction={() => props.setConfirmingDelete(false)}
            rightAction={deleteContacts}
            isVisible={props.confirmingDelete}
            hide={() => props.setConfirmingDelete(false)}
            style={styles.bulkConfirmDialog}
          />
          <Button
            style={{ marginLeft: '10px' }}
            onClick={() => props.setConfirmingDelete(true)}
            id="delete-btn"
            text={messages.delete}
            type="secondary"
          />
        </div>
      )}
      {props.selectedContacts.length === 2 && (
        <div key="merge-btn-container">
          <Button
            style={{ marginLeft: '10px' }}
            onClick={props.setMerging}
            id="merge"
            key="merge"
            text={messages.merge}
            type="secondary"
          />
        </div>
      )}
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
