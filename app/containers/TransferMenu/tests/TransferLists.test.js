import React from 'react';
import { shallow } from 'enzyme';
import { TransferLists } from '../TransferLists';
import { TransferMenu } from '../index';

describe('TransferLists Component render', () => {
  const props = {
    initializeTransferMenuAgentsPreference: jest.fn(
      () => 'mock initializeTransferMenuAgentsPreference'
    ),
  };
  const transferMenu = new TransferMenu(props);
  const voiceinteractionTransLists = [
    {
      id: 'mockVoiceTransferListId',
      name: 'mockVoiceTransferListName',
      endpoints: [
        {
          coldTransfer: false,
          contactType: 'PSTN',
          endpoint: 'mock endPoint',
          hierarchy: 'mock hirerarchy',
          name: 'mock hirerarchy name',
          transferType: 'internal',
          warmTransfer: false,
        },
      ],
    },
  ];
  const nonVoiceInteractionTransLists = [
    {
      id: 'mockNonVoiceTransferListId',
      name: 'mockNonTransferListName',
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

  it('renders TransferLists component with user assinged transferlists and interaction transferlists for the voice interaction', () => {
    let nonVoice;
    const component = shallow(
      <TransferLists
        transferSearchInput=""
        transferTabIndex={0}
        selectedInteractionId="mockInteractionId"
        interactionTransferLists={
          nonVoice === undefined
            ? voiceinteractionTransLists
            : nonVoiceInteractionTransLists
        }
        interactionTransListsLoadSt={nonVoice !== undefined}
        interactionTransListsVisibleSt={{ transferListMockId: true }}
        interactionAllTransListsVisibleSt
        userAssignedTransferLists={
          nonVoice === undefined
            ? voiceinteractionTransLists
            : nonVoiceInteractionTransLists
        }
        userAssigTransListsLoadSt={nonVoice !== undefined}
        userAssigTransListsVisibleSt={{ transferListMockId: true }}
        userAssigAllTransListsVisibleSt
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
  it('renders TransferLists component with user assinged transferlists and interaction transferlists for the non-voice interaction', () => {
    const nonVoice = true;
    const component = shallow(
      <TransferLists
        transferSearchInput=""
        transferTabIndex={0}
        selectedInteractionId="mockInteractionId"
        interactionTransferLists={
          nonVoice !== true
            ? voiceinteractionTransLists
            : nonVoiceInteractionTransLists
        }
        interactionTransListsLoadSt={nonVoice !== true}
        interactionTransListsVisibleSt={{ transferListMockId: true }}
        interactionAllTransListsVisibleSt
        userAssignedTransferLists={
          nonVoice !== true
            ? voiceinteractionTransLists
            : nonVoiceInteractionTransLists
        }
        userAssigTransListsLoadSt={nonVoice !== true}
        userAssigTransListsVisibleSt={{ transferListMockId: true }}
        userAssigAllTransListsVisibleSt
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
        styles={{
          transferListDivContainer:
            transferMenu.styles.transferListDivContainer,
          expandedTransferHeading: transferMenu.styles.expandedTransferHeading,
          collapsedTransferHeading:
            transferMenu.styles.collapsedTransferHeading,
          lineSpacer: transferMenu.styles.lineSpacer,
          iconOpen: transferMenu.styles.iconOpen,
          iconClosed: transferMenu.styles.iconClosed,
        }}
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
        interactionTransListsLoadSt
        interactionTransListsVisibleSt={undefined}
        interactionAllTransListsVisibleSt={undefined}
        userAssignedTransferLists={undefined}
        userAssigTransListsLoadSt
        userAssigTransListsVisibleSt={undefined}
        userAssigAllTransListsVisibleSt={undefined}
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
        interactionTransListsLoadSt={false}
        interactionTransListsVisibleSt={undefined}
        interactionAllTransListsVisibleSt={undefined}
        userAssignedTransferLists={undefined}
        userAssigTransListsLoadSt={false}
        userAssigTransListsVisibleSt={undefined}
        userAssigAllTransListsVisibleSt={undefined}
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
