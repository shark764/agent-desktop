/*
 *
 * TransferResource
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';

import Timer from 'components/Timer';

import messages from './messages';

export class TransferResource extends React.Component {

  constructor(props) {
    super(props);
    this.resourceControlsMenuToggle = this.resourceControlsMenuToggle.bind(this);
    this.hangUpResource = this.hangUpResource.bind(this);
    this.holdResource = this.holdResource.bind(this);
    this.resumeResource = this.resumeResource.bind(this);
    this.transfer = this.transfer.bind(this);
    this.state = {
      showResourceControlsMenu: false,
    };
  }

  resourceControlsMenuToggle() {
    this.setState({ showResourceControlsMenu: !this.state.showResourceControlsMenu });
  }

  cancelTransfer(warmTransfer) {
    if (warmTransfer.type === 'agent') {
      SDK.interactions.voice.cancelResourceTransfer({ transferType: 'warm', interactionId: this.props.activeVoiceInteraction.interactionId, transferResourceId: warmTransfer.id });
    } else if (warmTransfer.type === 'queue') {
      SDK.interactions.voice.cancelQueueTransfer({ transferType: 'warm', interactionId: this.props.activeVoiceInteraction.interactionId, transferQueueId: warmTransfer.id });
    } else if (warmTransfer.type === 'transferExtension') {
      SDK.interactions.voice.cancelExtensionTransfer({ transferType: 'warm', interactionId: this.props.activeVoiceInteraction.interactionId, transferExtension: warmTransfer.id });
    } else {
      console.error('Unknown transfer type:', warmTransfer);
    }
  }

  hangUpResource() {
    SDK.interactions.voice.resourceRemove({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.resource.targetResource });
    this.setState({ showResourceControlsMenu: false });
  }

  holdResource() {
    SDK.interactions.voice.resourceHold({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.resource.targetResource });
    this.setState({ showResourceControlsMenu: false });
  }

  resumeResource() {
    SDK.interactions.voice.resourceResume({ interactionId: this.props.activeVoiceInteraction.interactionId, targetResourceId: this.props.resource.targetResource });
    this.setState({ showResourceControlsMenu: false });
  }

  transfer() {
    SDK.interactions.voice.transferToResource({
      transferType: 'cold',
      interactionId: this.props.activeVoiceInteraction.interactionId,
      resourceId: this.props.resource.targetResource,
    });
    this.setState({ showResourceControlsMenu: false });
  }

  styles = {
    warmTransfer: {
      padding: '11px 23px 5px',
      fontSize: '15px',
      fontWeight: 600,
    },
    transferInProgress: {
      color: '#979797',
    },
    cancelTransfer: {
      fontSize: '16px',
      verticalAlign: 'top',
      display: 'inline-block',
      marginRight: '13px',
      cursor: 'pointer',
    },
    transferStatusIcon: {
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      display: 'inline-block',
      margin: '0 15px 6px 0',
    },
    transferConnectedIcon: {
      backgroundColor: '#23CEF5',
    },
    transferConnected: {
      maxWidth: '160px',
    },
    transferConnectedWithStatus: {
      maxWidth: '110px',
    },
    transferName: {
      maxWidth: '100px',
      marginRight: '5px',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    transferStatus: {
      fontSize: '12px',
      display: 'inline-block',
      verticalAlign: 'top',
      marginTop: '2px',
    },
    resourceControlsMenuToggle: {
      display: 'inline-block',
      float: 'right',
      fontSize: '11px',
      margin: '3px -4px 0 4px',
      cursor: 'pointer',
    },
    transferTimer: {
      float: 'right',
      fontSize: '14px',
      fontWeight: 'normal',
    },
    topTriangle: {
      marginTop: '-14px',
      marginLeft: '251px',
    },
    phoneControlsPopupMenu: {
      width: '100px',
      margin: '-7px 0 0 205px',
      padding: '12px',
    },
    phoneControlsPopupMenuOption: {
      cursor: 'pointer',
      padding: '0 3px',
      ':hover': {
        backgroundColor: '#DEF8FE',
      },
    },
  }

  render() {
    let status;
    let transferStyle;
    let transferStatusStyle;
    let icon;
    if (this.props.resource.status === 'transferring') {
      icon = <span title="Cancel transfer" onClick={() => this.cancelTransfer(this.props.resource)} style={this.styles.cancelTransfer}>&#10060;</span>;
      status = <FormattedMessage {...messages.connecting} />;
      transferStyle = this.styles.transferInProgress;
    } else if (this.props.resource.status === 'connected') {
      icon = <div style={[this.styles.transferStatusIcon, this.styles.transferConnectedIcon]}></div>;
      if (this.props.resource.onHold === true) {
        status = <FormattedMessage {...messages.onHold} />;
        transferStatusStyle = this.styles.transferConnectedWithStatus;
      } else if (this.props.resource.muted === true) {
        status = <FormattedMessage {...messages.muted} />;
        transferStatusStyle = this.styles.transferConnectedWithStatus;
      } else {
        transferStatusStyle = this.styles.transferConnected;
      }
    } else {
      throw new Error(`transfer status not valid: ${this.props.resource.status}`);
    }
    return (
      <div>
        <div id={`transfer-${this.props.resource.type}-${this.props.resource.id}`} style={[this.styles.warmTransfer, transferStyle]}>
          { icon }
          <span title={this.props.resource.name} style={[this.styles.transferName, transferStatusStyle]}>
            { this.props.resource.name }
          </span>
          {
            status
            ? <span style={this.styles.transferStatus}>({status})</span>
            : undefined
          }
          {
            this.props.resource.status === 'connected'
            ? <div className="resourceControlsMenuToggle" onClick={this.resourceControlsMenuToggle} style={this.styles.resourceControlsMenuToggle}>&#9660;</div>
            : undefined
          }
          <Timer format="mm:ss" style={this.styles.transferTimer} />
        </div>
        {
          this.state.showResourceControlsMenu
          ? <div id="resourceControlsMenu" >
            <div style={[this.props.style.topTriangle, this.styles.topTriangle]}></div>
            <div style={[this.props.style.phoneControlsPopupMenu, this.styles.phoneControlsPopupMenu]}>
              {
                this.props.resource.onHold !== true
                ? <div id="holdResource" key="holdResource" onClick={this.holdResource} style={this.styles.phoneControlsPopupMenuOption}>
                  <FormattedMessage {...messages.hold} />
                </div>
                : <div id="resumeResource" key="resumeResource" onClick={this.resumeResource} style={this.styles.phoneControlsPopupMenuOption}>
                  <FormattedMessage {...messages.resume} />
                </div>
              }
              <div id="transferResource" key="transferResource" onClick={this.transfer} style={this.styles.phoneControlsPopupMenuOption}>
                <FormattedMessage {...messages.transfer} />
              </div>
              <div id="hangUpResource" key="hangUpResource" onClick={this.hangUpResource} style={this.styles.phoneControlsPopupMenuOption}>
                <FormattedMessage {...messages.hangUp} />
              </div>
            </div>
          </div>
          : undefined
        }
      </div>
    );
  }
}

TransferResource.propTypes = {
  activeVoiceInteraction: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  style: PropTypes.shape({
    topTriangle: PropTypes.object.isRequired,
    phoneControlsPopupMenu: PropTypes.object.isRequired,
  }).isRequired,
};

export default (Radium(TransferResource));
