import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import ErrorBoundary from 'components/ErrorBoundary';
import { FormattedMessage } from 'react-intl';
import IconSVG from 'components/IconSVG';
import Icon from 'components/Icon';
import messages from './messages';

export class TransferLists extends React.Component {
  filterTransferListItems = (transferListItems) =>
    transferListItems.filter((transferListItem) => {
      if (this.props.transferSearchInput.trim() !== '') {
        return transferListItem.name
          .toUpperCase()
          .includes(this.props.transferSearchInput.toUpperCase());
      } else {
        return true;
      }
    });

  transferTransferListItem = (name, contactType, endpoint) => {
    if (contactType === 'queue') {
      this.props.transfer(
        this.props.setShowTransferMenu,
        name,
        undefined,
        endpoint
      );
    } else {
      const transferExtension = {
        type: contactType.toLowerCase(),
        value: endpoint,
      };
      this.props.transfer(
        this.props.setShowTransferMenu,
        name,
        undefined,
        undefined,
        transferExtension
      );
    }
  };

  render() {
    const styles = {
      transferListsCheckingTitle: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '-2px',
        display: 'flex',
        borderRadius: '3px',
      },
      hierarchy: {
        fontWeight: 600,
        padding: '6px 8px',
      },
      transferListItem: {
        display: 'flex',
        padding: '6px 20px',
        height: '32px',
        borderRadius: '3px',
        maxWidth: '225px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#DEF8FE',
        },
        ':focus': {
          outline: 'none',
          backgroundColor: '#DEF8FE',
        },
      },
      loadingIcon: {
        height: '40px',
        width: '40px',
      },
      transferListWrapper: {
        marginLeft: '5px',
        paddingLeft: '10px',
        borderLeft: '1px solid rgba(128, 128, 128, 0.2)',
        marginBottom: '30px',
      },
      spacerLineDiv: {
        display: 'inline-block',
        width: '10px',
        height: '5px',
        borderBottom: '1px solid #d1d1d1',
        position: 'relative',
        top: '18px',
        left: '-10px',
      },
      hierarchyListWrapper: {
        marginTop: '-10px',
      },
      transferListName: {
        flexBasis: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    };

    // User Assigned Transfer Lists:
    const userAssignedTransferLists = [];
    if (this.props.userAssignedTransferLists) {
      this.props.userAssignedTransferLists.forEach(
        (transferList, transferListIndex) => {
          const hierarchyMap = new Map();
          transferList.endpoints.forEach((transferListItem) => {
            const { hierarchy } = transferListItem;
            if (!hierarchyMap.has(hierarchy)) {
              hierarchyMap.set(hierarchy, [transferListItem]);
            } else {
              hierarchyMap.get(hierarchy).push(transferListItem);
            }
          });
          const hierarchyList = [];
          hierarchyMap.forEach((transferListItems, hierarchy) => {
            const filteredTransferListItems = this.filterTransferListItems(
              transferListItems
            )
              .filter((transferListItem) => {
                if (this.props.transferTabIndex === 0) {
                  return transferListItem.warmTransfer !== undefined;
                } else {
                  return transferListItem.coldTransfer !== undefined;
                }
              })
              .map((transferListItem, transferListItemIndex) => (
                <div
                  id={`${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  // The list is static, so we can just use the index as the key
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  className="tranferListItem transferItem"
                  onClick={() =>
                    this.transferTransferListItem(
                      transferListItem.name,
                      transferListItem.contactType,
                      transferListItem.endpoint
                    )
                  }
                  title={transferListItem.name}
                  style={styles.transferListItem}
                  tabIndex="0" // eslint-disable-line
                >
                  {transferListItem.name}
                </div>
              ));
            if (filteredTransferListItems.length > 0) {
              hierarchyList.push(
                <div
                  style={styles.hierarchyListWrapper}
                  id={`${transferList.id}-${hierarchy}`}
                  // hierarchy is not the array index. it is the key of the map.
                  // eslint-disable-next-line
                  key={`${transferList.id}-${hierarchy}`}
                >
                  <div style={styles.spacerLineDiv} />
                  <div style={styles.hierarchy}>
                    {hierarchy}
                  </div>
                  {filteredTransferListItems}
                </div>
              );
            }
          });
          if (hierarchyList.length > 0) {
            userAssignedTransferLists.push(
              <div
                key={transferList.id}
                style={this.props.styles.transferListDivContainer}
              >
                <div
                  id={`transferList-${transferListIndex}`}
                  key={`${transferList.id}-title`}
                  style={this.props.styles.collapsedTransferHeading}
                  onClick={() =>
                    this.props.updateUserAssignedTransferListsVisibleState(
                      transferList.id
                    )
                  }
                  title={transferList.name}
                >
                  <span style={styles.transferListName}>
                    {transferList.name}
                  </span>
                  <Icon
                    name="caret"
                    style={
                      this.props.userAssigTransListsVisibleSt &&
                      this.props.userAssigTransListsVisibleSt[transferList.id]
                        ? this.props.styles.iconOpen
                        : this.props.styles.iconClosed
                    }
                  />
                </div>
                {((this.props.userAssigTransListsVisibleSt &&
                  this.props.userAssigTransListsVisibleSt[transferList.id]) ||
                  this.props.transferSearchInput.trim() !== '') && (
                  <div style={styles.transferListWrapper}>
                    {hierarchyList}
                  </div>
                )}
              </div>
            );
          }
        }
      );
    }

    // Interaction Transfer Lists:
    const interactionTransferLists = [];
    if (this.props.interactionTransferLists) {
      this.props.interactionTransferLists.forEach(
        (transferList, transferListIndex) => {
          const hierarchyMap = new Map();
          transferList.endpoints.forEach((transferListItem) => {
            const { hierarchy } = transferListItem;
            if (!hierarchyMap.has(hierarchy)) {
              hierarchyMap.set(hierarchy, [transferListItem]);
            } else {
              hierarchyMap.get(hierarchy).push(transferListItem);
            }
          });
          const hierarchyList = [];
          hierarchyMap.forEach((transferListItems, hierarchy) => {
            const filteredTransferListItems = this.filterTransferListItems(
              transferListItems
            )
              .filter((transferListItem) => {
                if (this.props.transferTabIndex === 0) {
                  return transferListItem.warmTransfer !== undefined;
                } else {
                  return transferListItem.coldTransfer !== undefined;
                }
              })
              .map((transferListItem, transferListItemIndex) => (
                <div
                  id={`interactionTransferList-${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  // The list is static, so we can just use the index as the key
                  // eslint-disable-next-line react/no-array-index-key
                  key={`interactionTransferList-${
                    transferList.id
                  }-${hierarchy}-${transferListItemIndex}`}
                  className="tranferListItem transferItem"
                  onClick={() =>
                    this.transferTransferListItem(
                      transferListItem.name,
                      transferListItem.contactType,
                      transferListItem.endpoint
                    )
                  }
                  title={transferListItem.name}
                  style={styles.transferListItem}
                  tabIndex="0" // eslint-disable-line
                >
                  {transferListItem.name}
                </div>
              ));
            if (filteredTransferListItems.length > 0) {
              hierarchyList.push(
                <div
                  style={styles.hierarchyListWrapper}
                  id={`interactionTransferList-${transferList.id}-${hierarchy}`}
                  // hierarchy is not the array index. it is the key of the map.
                  // eslint-disable-next-line
                  key={`interactionTransferList-${
                    transferList.id
                  }-${hierarchy}`}
                >
                  <div style={styles.spacerLineDiv} />
                  <div style={styles.hierarchy}>
                    {hierarchy}
                  </div>
                  {filteredTransferListItems}
                </div>
              );
            }
          });
          if (hierarchyList.length > 0) {
            interactionTransferLists.push(
              <div
                key={`interactionTransferList-${transferList.id}`}
                style={this.props.styles.transferListDivContainer}
              >
                <div
                  id={`interactionTransferList-${transferListIndex}`}
                  key={`interactionTransferList-${transferList.id}-title`}
                  style={this.props.styles.collapsedTransferHeading}
                  onClick={() =>
                    this.props.updateInteractionTransferListsVisibleState(
                      transferList.id
                    )
                  }
                  title={transferList.name}
                >
                  <span style={styles.transferListName}>
                    {transferList.name}
                  </span>
                  <Icon
                    name="caret"
                    style={
                      this.props.interactionTransListsVisibleSt &&
                      this.props.interactionTransListsVisibleSt[transferList.id]
                        ? this.props.styles.iconOpen
                        : this.props.styles.iconClosed
                    }
                  />
                </div>
                {((this.props.interactionTransListsVisibleSt &&
                  this.props.interactionTransListsVisibleSt[transferList.id]) ||
                  this.props.transferSearchInput.trim() !== '') && (
                  <div style={styles.transferListWrapper}>
                    {hierarchyList}
                  </div>
                )}
              </div>
            );
          }
        }
      );
    }

    return (
      <React.Fragment>
        {this.props.interactionTransListsLoadSt ? (
          <div style={this.props.styles.transferListDivContainer}>
            <div style={this.props.styles.transferListsCheckingTitle}>
              <FormattedMessage
                {...messages.checkingInteractionTransferLists}
              />
            </div>
            <IconSVG
              id="interactionTransferListsLoadingIcon"
              name="loading"
              style={styles.loadingIcon}
            />
          </div>
        ) : (
          this.props.interactionTransferLists && (
            <div style={this.props.styles.transferListDivContainer}>
              <div
                id="interTransferListsCollapExpandBtn"
                key="interactionTransferLists"
                style={
                  this.props.interactionAllTransListsVisibleSt
                    ? this.props.styles.expandedTransferHeading
                    : this.props.styles.collapsedTransferHeading
                }
                onClick={() =>
                  this.props.updateVisibleStateOfAllInteractionTransferlists()
                }
              >
                <FormattedMessage {...messages.interactionTransferLists} />
                <Icon
                  name="caret"
                  style={[
                    this.props.interactionAllTransListsVisibleSt
                      ? this.props.styles.iconOpen
                      : this.props.styles.iconClosed,
                  ]}
                />
              </div>
              {this.props.interactionAllTransListsVisibleSt &&
                interactionTransferLists}
              <div style={this.props.styles.lineSpacer} />
            </div>
          )
        )}
        {this.props.userAssigTransListsLoadSt ? (
          <div style={this.props.styles.transferListDivContainer}>
            <div style={this.props.styles.transferListsCheckingTitle}>
              <FormattedMessage
                {...messages.checkingUserAssignedTransferLists}
              />
            </div>
            <IconSVG
              id="assignedTransferListsLoadingIcon"
              name="loading"
              style={styles.loadingIcon}
            />
          </div>
        ) : (
          this.props.userAssignedTransferLists &&
          this.props.userAssignedTransferLists.length > 0 && (
            <div style={this.props.styles.transferListDivContainer}>
              <div
                id="assignedTransferListsCollapExpandBtn"
                key="assignedTransferLists"
                style={
                  this.props.userAssigAllTransListsVisibleSt
                    ? this.props.styles.expandedTransferHeading
                    : this.props.styles.collapsedTransferHeading
                }
                onClick={() =>
                  this.props.updateVisibleStateOfAllUserAssignedTransferlists()
                }
              >
                <FormattedMessage {...messages.userAssignedTransferLists} />
                <Icon
                  name="caret"
                  style={[
                    this.props.userAssigAllTransListsVisibleSt
                      ? this.props.styles.iconOpen
                      : this.props.styles.iconClosed,
                  ]}
                />
              </div>
              {this.props.userAssigAllTransListsVisibleSt &&
                userAssignedTransferLists}
            </div>
          )
        )}
      </React.Fragment>
    );
  }
}

TransferLists.propTypes = {
  transferTabIndex: PropTypes.number.isRequired,
  transferSearchInput: PropTypes.string,
  transfer: PropTypes.func.isRequired,
  setShowTransferMenu: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  updateUserAssignedTransferListsVisibleState: PropTypes.func.isRequired,
  updateVisibleStateOfAllUserAssignedTransferlists: PropTypes.func.isRequired,
  userAssignedTransferLists: PropTypes.array,
  userAssigTransListsLoadSt: PropTypes.bool,
  userAssigTransListsVisibleSt: PropTypes.object,
  userAssigAllTransListsVisibleSt: PropTypes.bool,
  updateInteractionTransferListsVisibleState: PropTypes.func.isRequired,
  updateVisibleStateOfAllInteractionTransferlists: PropTypes.func.isRequired,
  selectedInteractionId: PropTypes.string,
  interactionTransferLists: PropTypes.array,
  interactionTransListsLoadSt: PropTypes.bool,
  interactionTransListsVisibleSt: PropTypes.object,
  interactionAllTransListsVisibleSt: PropTypes.bool,
};

export default ErrorBoundary(Radium(TransferLists));
