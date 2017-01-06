/**
*
* Avatar
*
*/

import React, { PropTypes } from 'react';

import agentAvatar from 'assets/avatars/AgentAvatar.png';
import customerAvatar1 from 'assets/avatars/CustomerAvatar1.png';
import customerAvatar2 from 'assets/avatars/CustomerAvatar2.png';
import customerAvatar3 from 'assets/avatars/CustomerAvatar3.png';
import customerAvatar4 from 'assets/avatars/CustomerAvatar4.png';
import customerAvatar5 from 'assets/avatars/CustomerAvatar5.png';
import customerAvatar6 from 'assets/avatars/CustomerAvatar6.png';
import customerAvatar7 from 'assets/avatars/CustomerAvatar7.png';
import customerAvatar8 from 'assets/avatars/CustomerAvatar8.png';
import customerAvatar9 from 'assets/avatars/CustomerAvatar9.png';
import customerAvatar10 from 'assets/avatars/CustomerAvatar10.png';
import customerAvatar11 from 'assets/avatars/CustomerAvatar11.png';
import customerAvatar12 from 'assets/avatars/CustomerAvatar12.png';
import customerAvatar13 from 'assets/avatars/CustomerAvatar13.png';
import customerAvatar14 from 'assets/avatars/CustomerAvatar14.png';
import customerAvatar15 from 'assets/avatars/CustomerAvatar15.png';
import customerAvatar16 from 'assets/avatars/CustomerAvatar16.png';
import customerAvatar17 from 'assets/avatars/CustomerAvatar17.png';

const customerAvatars = [customerAvatar1, customerAvatar2, customerAvatar3, customerAvatar4, customerAvatar5, customerAvatar6,
  customerAvatar7, customerAvatar8, customerAvatar9, customerAvatar10, customerAvatar11, customerAvatar12,
  customerAvatar13, customerAvatar14, customerAvatar15, customerAvatar16, customerAvatar17];

function Avatar(props) {
  function getAvatar() {
    if (Number.isInteger(props.customerAvatarIndex)) {
      return customerAvatars[props.customerAvatarIndex];
    } else {
      return agentAvatar;
    }
  }

  return (
    <img src={getAvatar()} style={{ width: '32px', height: '32px', borderRadius: '3px' }} alt="Avatar" />
  );
}

Avatar.propTypes = {
  customerAvatarIndex: PropTypes.number,
};

export default Avatar;
