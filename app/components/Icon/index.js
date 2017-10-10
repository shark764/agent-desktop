/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
*
* Icon
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import caret from 'assets/icons/caret.png';
import caretWhite from 'assets/icons/caret_white.png';
import checkStatus from 'assets/icons/check_status.png';
import checkMark from 'assets/icons/checkMark.png';
import config from 'assets/icons/config.png';
import search from 'assets/icons/search.png';
import close from 'assets/icons/close.png';
import arrowUpDown from 'assets/icons/arrow_up_down.png';
import arrowReturn from 'assets/icons/arrow_return.png';
import attachment from 'assets/icons/attachment.png';
import message from 'assets/icons/message.png';
import messageNew from 'assets/icons/message_new.png';
import messageDark from 'assets/icons/message_dark.png';
import email from 'assets/icons/email.png';
import emailNew from 'assets/icons/email_new.png';
import emailDark from 'assets/icons/email_dark.png';
import voice from 'assets/icons/voice.png';
import voiceWhite from 'assets/icons/inactive_voice_white.png';
import voiceDark from 'assets/icons/voice_dark.png';
import workItem from 'assets/icons/work_item.png';
import workItemNew from 'assets/icons/work_item_new.png';
import workItemDark from 'assets/icons/work_item_dark.png';
import connected from 'assets/icons/connected.png';
import notConnected from 'assets/icons/not_connected.png';
import endCallSprite from 'assets/icons/end_call_sprite.png';
import muteSprite from 'assets/icons/mute_sprite.png';
import holdSprite from 'assets/icons/hold_sprite.png';
import transferSprite from 'assets/icons/transfer_sprite.png';
import transferDarkSprite from 'assets/icons/transfer_dark_sprite.png';
import dialpadSprite from 'assets/icons/dialpad_sprite.png';
import dialpadDarkSprite from 'assets/icons/dialpad_dark_sprite.png';
import addInteraction from 'assets/icons/add_interaction.png';
import resourcesSprite from 'assets/icons/resources_sprite.png';
import scriptOnly from 'assets/icons/script.png';

export const availableIcons = [
  'add_interaction',
  'arrow_return',
  'arrow_up_down',
  'attachment',
  'caret',
  'caret_white',
  'checkStatus',
  'checkMark',
  'close',
  'config',
  'connected',
  'dialpad',
  'dialpad_dark',
  'email',
  'email_dark',
  'email_new',
  'endCall',
  'end_call_resource',
  'hold',
  'hold_resource',
  'message',
  'message_dark',
  'message_new',
  'mute',
  'not_connected',
  'resources',
  'search',
  'script',
  'transfer',
  'transfer_dark',
  'transfer_resource',
  'voice',
  'voice_white',
  'voice_dark',
  'work_item',
  'work_item_new',
  'work_item_dark',
];

export const availableIconsWithActive = [
  'mute',
  'hold',
  'hold_resource',
  'transfer',
  'transfer_dark',
  'dialpad',
  'dialpad_dark',
  'resources',
];

const styles = {
  base: {
    cursor: 'pointer',
  },
  caret: {
    data: { src: caret },
    height: '6px',
    width: '10px',
  },
  caret_white: {
    data: { src: caretWhite },
    height: '10px',
    width: '18px',
  },
  config: {
    data: { src: config },
  },
  search: {
    data: { src: search },
    height: '16px',
    width: '16px',
  },
  checkStatus: {
    data: { src: checkStatus },
    height: '17px',
  },
  checkMark: {
    data: { src: checkMark },
    height: '25px',
  },
  close: {
    data: { src: close },
  },
  arrow_return: {
    data: { src: arrowReturn },
  },
  arrow_up_down: {
    data: { src: arrowUpDown },
  },
  attachment: {
    data: { src: attachment },
    height: '16px',
    width: '16px',
  },
  script: {
    data: { src: scriptOnly },
    height: '22px',
    width: '26px',
  },
  message: {
    data: { src: message },
    height: '15px',
    width: '18px',
  },
  message_new: {
    data: { src: messageNew },
    height: '15px',
    width: '18px',
  },
  message_dark: {
    data: { src: messageDark },
    height: '20px',
    width: '20px',
  },
  email: {
    data: { src: email },
    height: '15px',
    width: '18px',
  },
  email_new: {
    data: { src: emailNew },
    height: '15px',
    width: '18px',
  },
  email_dark: {
    data: { src: emailDark },
    height: '17px',
    width: '20px',
  },
  voice: {
    data: { src: voice },
    height: '20px',
    width: '16px',
  },
  voice_dark: {
    data: { src: voiceDark },
    height: '20px',
    width: '16px',
  },
  voice_white: {
    data: { src: voiceWhite },
    height: '20px',
    width: '16px',
  },
  work_item: {
    data: { src: workItem },
    height: '20px',
    width: '20px',
  },
  work_item_new: {
    data: { src: workItemNew },
    height: '20px',
    width: '20px',
  },
  work_item_dark: {
    data: { src: workItemDark },
    height: '20px',
    width: '20px',
  },
  connected: {
    data: { src: connected },
  },
  not_connected: {
    data: { src: notConnected },
  },
  sprite: {
    height: '40px',
    width: '40px',
    display: 'block',
    borderRadius: '50%',
  },
  endCall: {
    backgroundImage: `url(${endCallSprite})`,
    ':hover': {
      backgroundPosition: '-80px 0',
    },
  },
  end_call_resource: {
    height: '24px',
    width: '24px',
    backgroundSize: '72px 24px',
    backgroundImage: `url(${endCallSprite})`,
    ':hover': {
      backgroundPosition: '-24px 0',
    },
  },
  mute: {
    backgroundImage: `url(${muteSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  hold: {
    backgroundImage: `url(${holdSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  hold_resource: {
    height: '24px',
    width: '24px',
    backgroundSize: '72px 24px',
    backgroundImage: `url(${holdSprite})`,
    ':hover': {
      backgroundPosition: '-24px 0',
    },
    active: {
      backgroundPosition: '-48px 0',
    },
  },
  transfer: {
    backgroundImage: `url(${transferSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  transfer_dark: {
    backgroundSize: '120px 40px',
    backgroundImage: `url(${transferDarkSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  transfer_resource: {
    height: '24px',
    width: '24px',
    backgroundSize: '72px 24px',
    backgroundImage: `url(${transferSprite})`,
    ':hover': {
      backgroundPosition: '-24px 0',
    },
  },
  dialpad: {
    backgroundImage: `url(${dialpadSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  dialpad_dark: {
    backgroundSize: '120px 40px',
    backgroundImage: `url(${dialpadDarkSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  resources: {
    backgroundSize: '120px 40px',
    backgroundImage: `url(${resourcesSprite})`,
    ':hover': {
      backgroundPosition: '-40px 0',
    },
    active: {
      backgroundPosition: '-80px 0',
    },
  },
  add_interaction: {
    data: { src: addInteraction },
  },
};

function Icon(props) {
  if (styles[props.name].backgroundImage) {
    return (
      <span
        id={props.id ? props.id : `${props.name}-icon`}
        className={props.active ? 'active' : ''}
        onClick={props.onclick}
        style={[
          styles.base,
          styles.sprite,
          styles[props.name],
          props.active && styles[props.name].active,
          props.style,
        ]}
      />
    );
  } else {
    return (
      <img
        id={props.id ? props.id : `${props.name}-icon`}
        onClick={props.onclick}
        src={styles[props.name].data.src}
        style={[styles.base, styles[props.name], props.style]}
        alt={props.alt || props.name}
        title={props.alt}
      />
    );
  }
}

Icon.propTypes = {
  name: PropTypes.oneOf(availableIcons).isRequired,
  alt: PropTypes.string,
  active: PropTypes.bool,
  style: PropTypes.object,
  id: PropTypes.string,
  onclick: PropTypes.func,
};

export default Radium(Icon);
