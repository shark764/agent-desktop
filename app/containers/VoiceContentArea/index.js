/*
 *
 * VoiceContentArea
 *
 */

import React, { PropTypes } from 'react';
import Radium from 'radium';

import messages from './messages';

import Button from 'components/Button';

import ContentArea from 'containers/ContentArea';

export class VoiceContentArea extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.endInteraction = this.endInteraction.bind(this);
  }

  endInteraction() {
    console.log('TODO connect to SDK');
  }

  styles = {
    customField: {
      display: 'inline-block',
      width: '50%',
    },
    customFieldLabel: {
      color: '#979797',
      display: 'inline-block',
      width: '90px',
    },
    customFieldValue: {
      display: 'inline-block',
      width: 'calc(100% - 90px)',
    },
  };

  render() {
    const isAccepting = this.props.selectedInteraction.status === 'work-accepting';

    const from = this.props.selectedInteraction.number;

    const details = this.props.selectedInteraction.customFields
      ? this.props.selectedInteraction.customFields.map((customField) =>
        <div key={customField.label + customField.value} style={this.styles.customField}>
          <div style={this.styles.customFieldLabel}>
            {customField.label}
          </div>
          <div style={this.styles.customFieldValue}>
            {customField.value}
          </div>
        </div>
      )
      : '';

    const buttons = (
      <Button
        id="hang-up-button"
        type="primaryRed"
        text={messages.hangUp}
        onClick={this.endInteraction}
        disabled={isAccepting}
      />
    );

    const content = '';

    return <ContentArea from={from} buttons={buttons} details={details} content={content} />;
  }
}


VoiceContentArea.propTypes = {
  selectedInteraction: PropTypes.object.isRequired,
};

export default Radium(VoiceContentArea);
