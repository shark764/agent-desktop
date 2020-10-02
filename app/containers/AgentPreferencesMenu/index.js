import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

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

const styles = {
  menu: {
    position: 'absolute',
    right: '2px',
    bottom: '56px',
    margin: '10px',
    color: '#4b4b4b',
    padding: '10px 13px',
  },
};

export class AgentPreferencesMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preferenceSelected: undefined,
    };
  }

  componentDidUpdate(prevProps) {
    /**
     * If activeExtension is changed, we need to
     * hide AudioOutput menu
     */
    if (
      this.props.activeExtensionIsTwilio !== prevProps.activeExtensionIsTwilio
    ) {
      this.setPreferenceSelected(undefined);
    }
  }

  setPreferenceSelected = (preferenceSelected) => {
    this.setState({
      preferenceSelected,
    });
  };

  renderPreferenceOption = (preference) => (
    <PreferenceOption
      preference={preference}
      label={messages[preference]}
      setPreferenceSelected={this.setPreferenceSelected}
    />
  );

  render() {
    let content;
    switch (this.state.preferenceSelected) {
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
            {this.props.hasViewStatsPermission &&
              this.renderPreferenceOption('metrics')}

            {this.renderPreferenceOption('notifications')}

            {this.props.activeExtensionIsTwilio &&
              this.props.isOutputSelectionSupported &&
              this.renderPreferenceOption('audioOutput')}

            {this.renderPreferenceOption('transferMenu')}
          </>
        );
      }
    }

    return (
      <PopupDialog
        id="preferencesMenu"
        style={styles.menu}
        widthPx={380}
        arrowLeftOffsetPx={348}
        isVisible={this.props.isVisible}
        hide={this.props.hideMenu}
      >
        <PreferenceTitle
          preference={this.state.preferenceSelected}
          setPreferenceSelected={this.setPreferenceSelected}
        />
        {content}
      </PopupDialog>
    );
  }
}

AgentPreferencesMenu.propTypes = {
  isVisible: PropTypes.bool,
  hideMenu: PropTypes.func.isRequired,
  hasViewStatsPermission: PropTypes.bool,
  isOutputSelectionSupported: PropTypes.bool.isRequired,
  activeExtensionIsTwilio: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  hasViewStatsPermission: selectHasViewStatsPermission(state, props),
  isOutputSelectionSupported: selectOutputSelectionSupported(state, props),
  activeExtensionIsTwilio: selectActiveExtensionIsTwilio(state, props),
});

export default ErrorBoundary(
  injectIntl(connect(mapStateToProps)(Radium(AgentPreferencesMenu)))
);
