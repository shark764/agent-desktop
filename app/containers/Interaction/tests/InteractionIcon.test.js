/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

import React from 'react';
import { shallow } from 'enzyme';

import * as InteractionUtils from 'utils/interaction';

import InteractionIcon from '../InteractionIcon';

describe('<Interaction />', () => {
  let interaction;
  beforeEach(() => {
    interaction = {};
  });
  describe('voice', () => {
    beforeEach(() => {
      interaction.channelType = 'voice';
      interaction.notifications = [];
    });
    it('renders default blue voice icon', () => {
      expect(
        shallow(<InteractionIcon interaction={interaction} />)
      ).toMatchSnapshot();
    });
    describe('with callback notification', () => {
      beforeEach(() => {
        interaction.notifications = [
          {
            messageKey: 'callbackRequest',
          },
        ];
      });
      it('renders callback voice icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />)
        ).toMatchSnapshot();
      });
    });
    describe('with work-initiated status and in toolbar mode', () => {
      beforeEach(() => {
        interaction.status = 'work-initiated';
      });
      it('renders white voice icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />, {
            context: { toolbarMode: true },
          })
        ).toMatchSnapshot();
      });
    });
  });
  describe('messaging/sms', () => {
    beforeEach(() => {
      InteractionUtils.lastMessageFromInteraction = () => ({
        type: 'agent',
      });
    });
    describe('messaging', () => {
      beforeEach(() => {
        interaction.channelType = 'messaging';
      });
      it('renders message icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />)
        ).toMatchSnapshot();
      });
      describe('with work-initiated status and not in toolbar mode', () => {
        beforeEach(() => {
          interaction.status = 'work-initiated';
        });
        it('renders new message icon', () => {
          expect(
            shallow(<InteractionIcon interaction={interaction} />, {
              context: { toolbarMode: false },
            })
          ).toMatchSnapshot();
        });
      });
      describe('with non work-initiated status and last message is from customer', () => {
        beforeEach(() => {
          interaction.status = 'work-accepted';
          InteractionUtils.lastMessageFromInteraction = () => ({
            type: 'customer',
          });
        });
        it('renders new message icon', () => {
          expect(
            shallow(<InteractionIcon interaction={interaction} />)
          ).toMatchSnapshot();
        });
      });
    });
    describe('sms', () => {
      beforeEach(() => {
        interaction.channelType = 'messaging';
      });
      it('renders message icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />)
        ).toMatchSnapshot();
      });
    });
  });
  describe('email', () => {
    beforeEach(() => {
      interaction.channelType = 'email';
    });
    it('renders email icon', () => {
      expect(
        shallow(<InteractionIcon interaction={interaction} />)
      ).toMatchSnapshot();
    });
    describe('with work-initiated status', () => {
      beforeEach(() => {
        interaction.status = 'work-initiated';
      });
      it('renders new email icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />)
        ).toMatchSnapshot();
      });
      describe('in toolbarMode', () => {
        it('renders email icon', () => {
          expect(
            shallow(<InteractionIcon interaction={interaction} />, {
              context: { toolbarMode: true },
            })
          ).toMatchSnapshot();
        });
      });
    });
  });
  describe('work-item', () => {
    beforeEach(() => {
      interaction.channelType = 'work-item';
    });
    it('renders work-item icon', () => {
      expect(
        shallow(<InteractionIcon interaction={interaction} />)
      ).toMatchSnapshot();
    });
    describe('with work-initiated status', () => {
      beforeEach(() => {
        interaction.status = 'work-initiated';
      });
      it('renders new work-item icon', () => {
        expect(
          shallow(<InteractionIcon interaction={interaction} />)
        ).toMatchSnapshot();
      });
      describe('in toolbarMode', () => {
        it('renders work-item icon', () => {
          expect(
            shallow(<InteractionIcon interaction={interaction} />, {
              context: { toolbarMode: true },
            })
          ).toMatchSnapshot();
        });
      });
    });
  });
});
