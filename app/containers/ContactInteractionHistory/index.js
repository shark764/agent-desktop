/*
 *
 * ContactInteractionHistory
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Radium from 'radium';
import moment from 'moment';

import Icon from 'components/Icon';

import messages from './messages';

export class ContactInteractionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.selectInteraction = this.selectInteraction.bind(this);
    this.getInteractionHistoryList = this.getInteractionHistoryList.bind(this);
    this.getCurrentInteractionDisplay = this.getCurrentInteractionDisplay.bind(this);

    this.state = {
      selectedInteractionIndex: undefined,
    };
  }

  selectInteraction(selectedInteractionIndex) {
    this.setState({ selectedInteractionIndex });
  }

  // XXX mocked data
  interactionsList = [
    {
      interactionId: 'b901fb3c-e94f-11e6-bf0e-fe55135034f3',
      direction: 'Inbound',
      channel: 'voice',
      queue: 'Customer Support',
      date: new Date(Date.now() - 172800000).toISOString(),
      csat: '75%',
      segments: [
        {
          segmentId: '772e44a4-cce5-4714-a152-4ffaa1fc03f7',
          title: 'System logs out at night',
          channel: 'voice',
          agent: 'Janet Singer',
          duration: '10 minutes',
          disposition: 'ISSUE RESOLVED',
          note: 'Lorem ipsum dolor sit amet, eos tempor graecis dissentiet ut, voluptaria neglegentur reprehendunt has in, his nostro aliquando ei. Laoreet civibus quo ex, duo ut quod tota, mei erat choro fabellas ad. Ex iracundia dissentiet has. Id mei delicata disputando, no illum aperiri alienum nec. Decore insolens mnesarchum per ad, est purto accumsan an. Eum ut saperet corpora, impedit oportere voluptatibus ex vis. Eu quidam corrumpit sed, amet nominati signiferumque an duo.',
          audioRecording: 'http://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
        }, {
          segmentId: '88f9512b-80b3-409a-9303-c09298d6a660',
          title: 'Broken',
          channel: 'voice',
          agent: 'Bob Jones',
          duration: '27 seconds',
          disposition: 'ESCALATION',
          note: 'An usu atqui numquam. Duo mucius accusam at, ea pri posse choro antiopam, usu te modus erant hendrerit. Et ornatus pertinax mediocritatem mei. Augue paulo labore ut sit, est ea labore utroque repudiare.',
          audioRecording: 'http://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
        }, {
          segmentId: 'a10b9ab0-0369-4875-88e5-ab0ae20ba0d6',
          title: 'Logging out at night',
          channel: 'voice',
          agent: 'Maria Lopez',
          duration: '2 minutes',
          disposition: 'ESCALATION',
          note: 'Id eos natum alienum, eu sea quot nulla, quo idque vidisse percipit id. An justo nemore percipitur vel, nulla aeque pericula et vel. Usu at elitr civibus omittantur, sint labores salutandi ei pro. In modo inani harum mei.',
          audioRecording: 'http://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
        },
      ],
    }, {
      interactionId: '0c052089-c0e5-47a0-80dd-cb0b284081d5',
      direction: 'Inbound',
      channel: 'voice',
      queue: 'Customer Support',
      date: new Date(Date.now() - 342800000).toISOString(),
      csat: '90%',
      segments: [
        {
          segmentId: '57041836-16ea-4e4e-bb07-c0d83ba3b0d2',
          title: 'Password change',
          channel: 'sms',
          agent: 'Bill Parsons',
          duration: '18 minutes',
          disposition: 'ISSUE RESOLVED',
          note: 'Elitr facete perpetua no nam. Ne sit accumsan intellegam, nec cu aliquam vituperatoribus. Dico perpetua dissentiet qui at, qui ea omnium cetero, ut periculis prodesset nec. No exerci suscipiantur nam.\nAliquam admodum sit in. Eu nam quem odio efficiendi. Mel intellegat instructior et. No euismod recusabo lobortis eam, ad wisi ullum postea nec, mel postea oporteat repudiare ei. Aeque scripta mei et. Elaboraret neglegentur ad pro, putant meliore efficiendi ex has. Movet saepe fierent ut vel.',
          transcript: [
            {
              name: 'Bill Parsons',
              message: 'Lorem ipsum dolor sit amet, eos tempor graecis dissentiet ut, voluptaria neglegentur reprehendunt has in, his nostro aliquando ei. Laoreet civibus quo ex, duo ut quod tota, mei erat choro fabellas ad. Ex iracundia dissentiet has. Id mei delicata disputando, no illum aperiri alienum nec. Decore insolens mnesarchum per ad, est purto accumsan an. Eum ut saperet corpora, impedit oportere voluptatibus ex vis. Eu quidam corrumpit sed, amet nominati signiferumque an duo.',
            }, {
              name: 'Janet Singer',
              message: 'An usu atqui numquam. Duo mucius accusam at, ea pri posse choro antiopam, usu te modus erant hendrerit. Et ornatus pertinax mediocritatem mei. Augue paulo labore ut sit, est ea labore utroque repudiare.',
            }, {
              name: 'Bill Parsons',
              message: 'Id eos natum alienum, eu sea quot nulla, quo idque vidisse percipit id. An justo nemore percipitur vel, nulla aeque pericula et vel. Usu at elitr civibus omittantur, sint labores salutandi ei pro. In modo inani harum mei.',
            },
          ],
        },
      ],
    }, {
      interactionId: '229c9831-65fb-4080-8e10-9f26a5db7fc4',
      direction: 'Inbound',
      channel: 'email',
      queue: 'Customer Support',
      date: new Date(Date.now() - 742800000).toISOString(),
      csat: '50%',
      segments: [
        {
          segmentId: '56443b1e-9d15-47a6-91de-06049c5579be',
          title: 'Title',
          channel: 'email',
          agent: 'Peter DeBoar',
          duration: '18 minutes',
          disposition: 'ISSUE RESOLVED',
          note: 'Elitr facete perpetua no nam. Ne sit accumsan intellegam, nec cu aliquam vituperatoribus. Dico perpetua dissentiet qui at, qui ea omnium cetero, ut periculis prodesset nec. No exerci suscipiantur nam.\nAliquam admodum sit in. Eu nam quem odio efficiendi. Mel intellegat instructior et. No euismod recusabo lobortis eam, ad wisi ullum postea nec, mel postea oporteat repudiare ei. Aeque scripta mei et. Elaboraret neglegentur ad pro, putant meliore efficiendi ex has. Movet saepe fierent ut vel.',
          transcript: [
            {
              name: 'Peter DeBoar',
              message: 'Lorem ipsum dolor sit amet, eos tempor graecis dissentiet ut, voluptaria neglegentur reprehendunt has in, his nostro aliquando ei. Laoreet civibus quo ex, duo ut quod tota, mei erat choro fabellas ad. Ex iracundia dissentiet has. Id mei delicata disputando, no illum aperiri alienum nec. Decore insolens mnesarchum per ad, est purto accumsan an. Eum ut saperet corpora, impedit oportere voluptatibus ex vis. Eu quidam corrumpit sed, amet nominati signiferumque an duo.',
            }, {
              name: 'Janet Singer',
              message: 'An usu atqui numquam. Duo mucius accusam at, ea pri posse choro antiopam, usu te modus erant hendrerit. Et ornatus pertinax mediocritatem mei. Augue paulo labore ut sit, est ea labore utroque repudiare.',
            }, {
              name: 'Peter DeBoar',
              message: 'Id eos natum alienum, eu sea quot nulla, quo idque vidisse percipit id. An justo nemore percipitur vel, nulla aeque pericula et vel. Usu at elitr civibus omittantur, sint labores salutandi ei pro. In modo inani harum mei.',
            },
          ],
        },
      ],
    },
  ];
  // XXX mocked data

  styles = {
    base: {
      padding: '28px 0',
      fontSize: '14px',
    },
    interactionsSince: {
      fontSize: '15px',
      marginBottom: '19px',
    },
    interaction: {
      border: '1px solid #E4E4E4',
      borderRadius: '3px',
    },
    interactionHeader: {
      backgroundColor: '#F3F3F3',
      padding: '16px 40px',
    },
    interactionListItem: {
      cursor: 'pointer',
      marginBottom: '14px',
    },
    interactionDaysAgo: {
      float: 'right',
      color: '#979797',
    },
    closeIcon: {
      float: 'right',
      marginTop: '5px',
    },
    segment: {
      marginBottom: '37px',
    },
    segmentData: {
      borderTop: '1px solid #E4E4E4',
      padding: '16px 40px 0 0',
      height: 'calc(100vh - 270px)',
      overflowY: 'auto',
    },
    segmentTitle: {
      fontSize: '16px',
      fontWeight: 600,
    },
    segmentChannelIcon: {
      verticalAlign: 'top',
      margin: '5px 14px 0 14px',
      cursor: 'default',
    },
    segmentContent: {
      width: 'calc(100% - 50px)',
      display: 'inline-block',
    },
    segmentMessage: {
      fontSize: '16px',
    },
    disposition: {
      fontSize: '12px',
      backgroundColor: '#F3F3F3',
      padding: '6px',
      display: 'inline-block',
      margin: '6px 0 17px',
    },
    transcript: {
      borderTop: '1px solid #D0D0D0',
      marginTop: '20px',
    },
    transcriptTitle: {
      fontSize: '16px',
      color: '#7E7E7E',
      margin: '20px 0',
    },
    transcriptItem: {
      marginBottom: '20px',
    },
    transcriptItemName: {
      fontWeight: 'bold',
    },
  }

  getInteractionHistoryList() {
    const interactions = this.interactionsList.map((interaction, index) =>
      <div
        key={interaction.interactionId}
        className="interactionHistoryItem"
        style={[this.styles.interaction, this.styles.interactionListItem, this.styles.interactionHeader]}
        onClick={() => this.selectInteraction(index)}
      >
        <div style={this.styles.interactionDaysAgo}>
          { moment(interaction.date).fromNow() }
        </div>
        <div>
          {interaction.direction},&nbsp;{interaction.queue}
        </div>
        <div>
          { moment(interaction.date).format('LLL') }
        </div>
        <div>
          <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{ interaction.csat }
        </div>
      </div>
    );
    return (
      <div>
        <div id="interactionsSince" style={this.styles.interactionsSince}>
          { this.interactionsList.length > 0
            ? <div>
              { this.interactionsList.length }
              &nbsp;
              {
                this.interactionsList.length > 1
                ? <FormattedMessage {...messages.interactionsSince} />
                : <FormattedMessage {...messages.interaction} />
              }
              &nbsp;
              { moment(this.interactionsList[this.interactionsList.length - 1].date).format('LL') }
            </div>
            : <FormattedMessage {...messages.noPastInteractions} />
          }
        </div>
        { interactions }
      </div>
    );
  }

  getCurrentInteractionDisplay() {
    const selectedInteractionHistoryItem = this.interactionsList[this.state.selectedInteractionIndex];
    const segmentData = selectedInteractionHistoryItem.segments.map((segment) => {
      let icon;
      if (segment.channel === 'voice') {
        icon = 'voice_dark';
      } else if (segment.channel === 'sms' || segment.channel === 'messaging') {
        icon = 'message_dark';
      } else if (segment.channel === 'email') {
        icon = 'email_dark';
      }
      let transcript;
      if (segment.channel === 'voice') {
        transcript = (
          <div style={this.styles.transcript}>
            <div style={this.styles.transcriptTitle}>
              <FormattedMessage {...messages.audioRecording} />
            </div>
            <div>
              <audio controls src={segment.audioRecording} />
            </div>
          </div>
        );
      } else {
        const transcriptItems = segment.transcript.map((transcriptItem, index) =>
          <div key={`${segment.id}`} id={`transcriptItem${index}`} style={this.styles.transcriptItem}>
            <span style={this.styles.transcriptItemName}>
              {transcriptItem.name}:&nbsp;
            </span>
            <span>
              {transcriptItem.message}
            </span>
          </div>
        );
        transcript = (
          <div style={this.styles.transcript}>
            <div style={this.styles.transcriptTitle}>
              <FormattedMessage {...messages.transcript} />
            </div>
            <div style={this.styles.segmentMessage}>
              {transcriptItems}
            </div>
          </div>
        );
      }
      return (
        <div key={segment.segmentId} style={this.styles.segment} >
          <Icon name={icon} style={this.styles.segmentChannelIcon} />
          <div style={this.styles.segmentContent}>
            <div style={this.styles.segmentTitle}>
              { segment.title }
            </div>
            <div>
              { segment.agent }
            </div>
            <div>
              { segment.duration }
            </div>
            <span style={this.styles.disposition}>
              { segment.disposition }
            </span>
            <div style={this.styles.segmentMessage}>
              { segment.note }
            </div>
            { transcript }
          </div>
        </div>
      );
    });
    return (
      <div id="selectedInteractionHistoryItem" style={this.styles.interaction}>
        <div style={this.styles.interactionHeader}>
          <Icon name="close" style={this.styles.closeIcon} onclick={() => this.selectInteraction(undefined)} />
          <div>
            {selectedInteractionHistoryItem.direction},&nbsp;{selectedInteractionHistoryItem.queue}
          </div>
          <div>
            { moment(selectedInteractionHistoryItem.date).format('LLL') }
          </div>
          <div>
            <FormattedMessage {...messages.customerSatisfaction} />:&nbsp;{ selectedInteractionHistoryItem.csat }
          </div>
        </div>
        <div style={this.styles.segmentData} >
          { segmentData }
        </div>
      </div>
    );
  }

  render() {
    let content;
    if (this.state.selectedInteractionIndex === undefined) {
      content = this.getInteractionHistoryList();
    } else {
      content = this.getCurrentInteractionDisplay();
    }
    return (
      <div style={[this.styles.base, this.props.style]}>
        { content }
      </div>
    );
  }
}

ContactInteractionHistory.propTypes = {
  style: React.PropTypes.object,
};

export default (Radium(ContactInteractionHistory));
