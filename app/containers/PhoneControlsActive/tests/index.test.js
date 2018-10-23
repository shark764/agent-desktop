import React from 'react';
import { shallow } from 'enzyme';
import { getIntlContext } from 'utils/test';

import { PhoneControlsActive } from '../index';

describe('<PhoneControlsActive/>', () => {
  it('renders correctly', () => {
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'inbound',
          warmTransfers: [],
          status: 'work-accepted',
          customerConnected: true,
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("when we are doing an outbound interaction and the customer haven't picked up the call we won't show the hold button", () => {
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'outbound',
          customerConnected: false,
          warmTransfers: [],
          status: 'work-accepted',
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('when we are doing an outbound interaction and the customer picked up the call we show the hold button', () => {
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'outbound',
          customerConnected: true,
          status: 'work-accepted',
          warmTransfers: [],
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('if the interaction has warm transfers we show the resources button and the active resources menu', () => {
    Date.now = jest.fn(() => 0);
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'inbound',
          warmTransfers: [
            {
              id: '1111111',
              type: 'agent',
              name: 'Agent with a very very very long name',
              status: 'connected',
              onHold: true,
              targetResource: 'targetResource1',
              addedTimestamp: Date.now() - 10000,
            },
          ],
          status: 'work-accepted',
          customerConnected: true,
        }}
      />
    );
    rendered.setState({ showActiveResourcesMenu: true });
    expect(rendered).toMatchSnapshot();
  });
  it('when agent is on hold we show the resume button', () => {
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'inbound',
          onHold: true,
          meOnHold: true,
          status: 'work-accepted',
          warmTransfers: [],
          customerConnected: true,
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('when have several interactions on hold, we show the resume button', () => {
    Date.now = jest.fn(() => 0);
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          agentRecordingEnabled: true,
          callControls: {
            preventAgentRecordingUpdate: false,
            holdUpdate: true,
            transferUpdate: true,
          },
          direction: 'inbound',
          warmTransfers: [
            {
              id: '1111111',
              type: 'agent',
              name: 'Agent with a very very very long name',
              status: 'connected',
              onHold: true,
              targetResource: 'targetResource1',
              addedTimestamp: Date.now() - 10000,
            },
          ],
          onHold: true,
          meOnHold: true,
          status: 'work-accepted',
          customerConnected: true,
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it('when interaction status is fatal, only EndCall component gets rendered', () => {
    const rendered = shallow(
      <PhoneControlsActive
        intl={getIntlContext()}
        agentId="1"
        activeVoiceInteraction={{
          interactionId: '1',
          status: 'fatal',
          warmTransfers: [],
        }}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  describe('in toolbar mode', () => {
    it('when agent is on hold we show the resume button as the mode requires', () => {
      const rendered = shallow(
        <PhoneControlsActive
          intl={getIntlContext()}
          agentId="1"
          activeVoiceInteraction={{
            interactionId: '1',
            agentRecordingEnabled: true,
            callControls: {
              preventAgentRecordingUpdate: false,
              holdUpdate: true,
              transferUpdate: true,
            },
            direction: 'inbound',
            onHold: true,
            meOnHold: true,
            status: 'work-accepted',
            warmTransfers: [],
            customerConnected: true,
          }}
        />,
        {
          context: {
            toolbarMode: true,
          },
        }
      );
      expect(rendered).toMatchSnapshot();
    });
    it('when have several interactions on hold, we show the resume button as the mode requires', () => {
      Date.now = jest.fn(() => 0);
      const rendered = shallow(
        <PhoneControlsActive
          intl={getIntlContext()}
          agentId="1"
          activeVoiceInteraction={{
            interactionId: '1',
            agentRecordingEnabled: true,
            callControls: {
              preventAgentRecordingUpdate: false,
              holdUpdate: true,
              transferUpdate: true,
            },
            direction: 'inbound',
            warmTransfers: [
              {
                id: '1111111',
                type: 'agent',
                name: 'Agent with a very very very long name',
                status: 'connected',
                onHold: true,
                targetResource: 'targetResource1',
                addedTimestamp: Date.now() - 10000,
              },
            ],
            onHold: true,
            meOnHold: true,
            status: 'work-accepted',
            customerConnected: true,
          }}
        />,
        {
          context: {
            toolbarMode: true,
          },
        }
      );
      rendered.setState({ showActiveResourcesMenu: true });
      expect(rendered).toMatchSnapshot();
    });
  });
});
