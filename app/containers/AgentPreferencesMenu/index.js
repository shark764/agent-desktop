import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PopupDialog from 'components/PopupDialog';
import AgentStatsMenu from 'containers/AgentStatsMenu';
import AgentNotificationsMenu from 'containers/AgentNotificationsMenu';
import AudioOutputMenu from 'containers/AudioOutputMenu';
import AgentTransferMenuPreferenceMenu from 'containers/AgentTransferMenuPreferenceMenu';
import ErrorBoundary from 'components/ErrorBoundary';

import PreferenceOption from 'components/PreferenceOption';
import {
  selectOutputSelectionSupported,
  selectActiveExtensionIsTwilio,
} from 'containers/AudioOutputMenu/selectors';
import { selectHasViewStatsPermission } from './selectors';

import PreferenceTitle from './PreferenceTitle';

import messages from './messages';

export const AgentPreferencesMenu = (props) => {
  const hasViewStatsPermission = useSelector(selectHasViewStatsPermission);
  const isOutputSelectionSupported = useSelector(
    selectOutputSelectionSupported
  );
  const activeExtensionIsTwilio = useSelector(selectActiveExtensionIsTwilio);

  const [preferenceSelected, setPreferenceSelected] = useState(undefined);

  useEffect(() => {
    setPreferenceSelected(undefined);
  }, [activeExtensionIsTwilio]);

  const renderPreferenceOption = (preference) => (
    <PreferenceOption
      preference={preference}
      label={messages[preference]}
      setPreferenceSelected={setPreferenceSelected}
    />
  );

  let content;
  switch (preferenceSelected) {
    case 'metrics': {
      content = <AgentStatsMenu />;
      break;
    }
    case 'notifications': {
      content = <AgentNotificationsMenu />;
      break;
    }
    case 'audioOutput': {
      content = <AudioOutputMenu />;
      break;
    }
    case 'transferMenu': {
      content = <AgentTransferMenuPreferenceMenu />;
      break;
    }
    default: {
      content = (
        <>
          {hasViewStatsPermission && renderPreferenceOption('metrics')}

          {renderPreferenceOption('notifications')}

          {activeExtensionIsTwilio &&
            isOutputSelectionSupported &&
            renderPreferenceOption('audioOutput')}

          {renderPreferenceOption('transferMenu')}
        </>
      );
    }
  }

  return (
    <PopupDialog
      id="preferencesMenu"
      style={{
        position: 'absolute',
        right: '2px',
        bottom: '56px',
        margin: '10px',
        color: '#4b4b4b',
        padding: '10px 13px',
      }}
      widthPx={380}
      arrowLeftOffsetPx={348}
      isVisible={props.isVisible}
      hide={props.hideMenu}
    >
      <PreferenceTitle
        preference={preferenceSelected}
        setPreferenceSelected={setPreferenceSelected}
      />
      {content}
    </PopupDialog>
  );
};

AgentPreferencesMenu.propTypes = {
  isVisible: PropTypes.bool,
  hideMenu: PropTypes.func.isRequired,
};

export default ErrorBoundary(AgentPreferencesMenu);
