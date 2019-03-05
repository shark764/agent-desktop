import React from 'react';
import { shallow } from 'enzyme';
import { TransferLists } from '../TransferLists';

describe('TransferLists Component render', () => {
  it('renders TransferLists component with user assinged transferlists and interaction transferlists', () => {
    const transferLists = [
      {
        id: 'mockTransferListId',
        name: 'mockTransferListName',
        endpoints: [
          {
            coldTransfer: false,
            contactType: 'queue',
            endpoint: 'mock endPoint',
            hierarchy: 'mock hirerarchy',
            name: 'mock hirerarchy name',
            transferType: 'internal',
            warmTransfer: false,
          },
        ],
      },
    ];
    const component = shallow(
      <TransferLists
        transferSearchInput=""
        transferTabIndex={0}
        selectedInteractionId="mockInteractionId"
        interactionTransferLists={transferLists}
        interactionTransferListsLoadingState={false}
        interactionTransferListsVisibleState={{
          assignedTransferListMockId: true,
        }}
        visibleStateofAllInteractionTrasferLists
        userAssignedTransferLists={transferLists}
        userAssignedTransferListsLoadingState={false}
        userAssignedTransferListsVisibleState={{
          interactionTransferListMockId: true,
        }}
        visibleStateOfAllUserAssignedTransferLists
        setShowTransferMenu={() => 'mock setShowTransferMenu'}
        transfer={() => 'mock transferInteraction'}
        updateUserAssignedTransferListsVisibleState={() =>
          'mock updateAssignedTransferListsVisibleState'
        }
        updateVisibleStateOfAllUserAssignedTransferlists={() =>
          'mock updateAllAssignedTransferListsVisibleState'
        }
        updateInteractionTransferListsVisibleState={() =>
          'mock updateInteractionTransferListsVisibleState'
        }
        updateVisibleStateOfAllInteractionTransferlists={() =>
          'mock updateAllInteractionTransferListsVisibleState'
        }
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('renders TransferLists component when assigned transferlists and flow transferlists are in loading state', () => {
    const component = shallow(
      <TransferLists
        transferSearchInput=""
        transferTabIndex={0}
        selectedInteractionId="mockInteractionId"
        interactionTransferLists={undefined}
        interactionTransferListsLoadingState
        interactionTransferListsVisibleState={undefined}
        visibleStateofAllInteractionTrasferLists={undefined}
        userAssignedTransferLists={undefined}
        userAssignedTransferListsLoadingState
        userAssignedTransferListsVisibleState={undefined}
        visibleStateOfAllUserAssignedTransferLists={undefined}
        setShowTransferMenu={() => 'mock setShowTransferMenu'}
        transfer={() => 'mock transferInteraction'}
        updateUserAssignedTransferListsVisibleState={() =>
          'mock updateAssignedTransferListsVisibleState'
        }
        updateVisibleStateOfAllUserAssignedTransferlists={() =>
          'mock updateAllAssignedTransferListsVisibleState'
        }
        updateInteractionTransferListsVisibleState={() =>
          'mock updateInteractionTransferListsVisibleState'
        }
        updateVisibleStateOfAllInteractionTransferlists={() =>
          'mock updateAllInteractionTransferListsVisibleState'
        }
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
  it('renders TransferLists component when there are no assigned transferlists and flow transfer lists', () => {
    const component = shallow(
      <TransferLists
        transferSearchInput=""
        transferTabIndex={0}
        selectedInteractionId="mockInteractionId"
        interactionTransferLists={undefined}
        interactionTransferListsLoadingState={false}
        interactionTransferListsVisibleState={undefined}
        visibleStateofAllInteractionTrasferLists={undefined}
        userAssignedTransferLists={undefined}
        userAssignedTransferListsLoadingState={false}
        userAssignedTransferListsVisibleState={undefined}
        visibleStateOfAllUserAssignedTransferLists={undefined}
        setShowTransferMenu={() => 'mock setShowTransferMenu'}
        transfer={() => 'mock transferInteraction'}
        updateUserAssignedTransferListsVisibleState={() =>
          'mock updateAssignedTransferListsVisibleState'
        }
        updateVisibleStateOfAllUserAssignedTransferlists={() =>
          'mock updateAllAssignedTransferListsVisibleState'
        }
        updateInteractionTransferListsVisibleState={() =>
          'mock updateInteractionTransferListsVisibleState'
        }
        updateVisibleStateOfAllInteractionTransferlists={() =>
          'mock updateAllInteractionTransferListsVisibleState'
        }
        styles={{}}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
