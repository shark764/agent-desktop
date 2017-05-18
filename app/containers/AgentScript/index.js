/*
 *
 * AgentScript
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import { updateScriptValues } from 'containers/AgentDesktop/actions';

import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Image from 'components/Image';
import TextLink from 'components/TextLink';
import Scale from 'components/Scale';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import messages from './messages';

const styles = {
  base: {
    margin: '30px 30px 30px 0',
  },
  textInput: {
    width: '100%',
    maxWidth: '282px',
  },
  select: {
    maxWidth: '282px',
  },
  element: {
    marginBottom: '15px',
  },
  checkboxesContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    position: 'relative',
  },
  indivCheckbox: {
    display: 'inline-block',
    margin: '15px 0 0',
    flexBasis: '33%',
    verticalAlign: 'top',
    paddingRight: '1%',
  },
  checkboxLabel: {
    whiteSpace: 'normal',
  },
  checkboxInput: {
    verticalAlign: 'top',
    margin: '5px 5px 0 0',
  },
};

class AgentScript extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.mapScriptsFromProps();
  }

  componentWillUnmount() {
    this.props.updateScriptValues(this.props.interactionId, this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interactionId !== nextProps.interactionId) {
      this.props.updateScriptValues(this.props.interactionId, this.state);
      this.setState(this.mapScriptsFromProps());
    }
  }

  mapScriptsFromProps = () => {
    const { script } = this.props;
    const newState = {};

    script.elements.forEach((element) => {
      switch (element.type) {
        case 'freeform':
          newState[element.name] = script.values !== undefined && script.values[element.name] !== undefined ? script.values[element.name] : '';
          break;
        case 'dropdown':
        case 'scale':
          newState[element.name] = script.values !== undefined && script.values[element.name] !== undefined ? script.values[element.name] : null;
          break;
        case 'checkbox': {
          const checkboxOptions = {};
          element.options.forEach((option) => {
            checkboxOptions[option.value] = script.values !== undefined && script.values[option.value] !== undefined ? script.values[option.value] : false;
          });
          newState[element.name] = checkboxOptions;
          break;
        }
        default:
          break;
      }
    });
    return newState;
  }

  getScript = () => {
    const scriptElements = [];
    this.props.script.elements.forEach((element) => {
      switch (element.type) {
        case 'text':
          scriptElements.push(<TextBlob id={element.name} key={element.name} text={element.text} style={styles.element} />);
          break;
        case 'freeform':
          scriptElements.push(
            <div id={element.name} key={element.name} style={styles.element} >
              <div>
                { element.text }
              </div>
              <TextInput
                id={`${element.name}-textInput`}
                value={this.state[element.name]}
                cb={(value) => this.setState({ [element.name]: value })}
                style={styles.textInput}
              />
            </div>
          );
          break;
        case 'dropdown': {
          const dropdownOptions = element.options.map((option) =>
            ({ value: option.value, label: option.name })
          );
          scriptElements.push(
            <div key={element.name} style={styles.element} >
              <div>
                { element.text }
              </div>
              <Select
                id={element.name}
                options={dropdownOptions}
                value={this.state[element.name]}
                onChange={(option) => this.setState({ [element.name]: option !== null ? option.value : null })}
                style={styles.select}
              />
            </div>
          );
          break;
        }
        case 'scale':
          scriptElements.push(
            <Scale
              id={element.name}
              key={element.name}
              lowerBound={element.lowerBound}
              lowerBoundLabel={element.lowerBoundLabel}
              upperBound={element.upperBound}
              upperBoundLabel={element.upperBoundLabel}
              value={this.state[element.name]}
              onChange={(value) => this.setState({ [element.name]: value })}
              placeholder={element.text}
              style={styles.element}
            />
          );
          break;
        case 'image':
          scriptElements.push(<Image id={element.name} key={element.name} src={element.value} placeholder={element.text} style={styles.element} />);
          break;
        case 'checkbox': {
          const checkboxes = element.options.map((option, index) =>
            <CheckBox
              style={styles.indivCheckbox}
              labelStyle={styles.checkboxLabel}
              checkboxInputStyle={styles.checkboxInput}
              id={`${option.value}_${index}`}
              key={`${element.id}_${index}`}
              text={option.name}
              checked={this.state[element.name][option.value]}
              cb={(checked) => {
                const newState = Object.assign({}, this.state);
                newState[element.name][option.value] = checked;
                this.setState(newState);
              }}
            />
          );
          scriptElements.push(
            <div key={element.id} style={styles.element}>
              <div>
                { element.text }
              </div>
              <div style={styles.checkboxesContainer}>
                { checkboxes }
              </div>
            </div>
          );
          break;
        }
        case 'link':
          scriptElements.push(<TextLink id={element.name} key={element.name} link={element.href} text={element.text} style={styles.element} />);
          break;
        default:
          throw new Error('Unknown script element type');
      }
    });
    return scriptElements;
  }

  sendScript = () => {
    console.log('Sending this to SDK', { interactionId: this.props.interactionId, scriptId: this.props.script.id, answers: this.state });
    CxEngage.interactions.sendScript({ interactionId: this.props.interactionId, scriptId: this.props.script.id, answers: this.state });
  }

  render() {
    return (
      <div style={styles.base}>
        {this.getScript()}
        <Button id="submitScriptButton" type="primaryBlue" text={messages.submit} onClick={() => this.sendScript()} />
      </div>
    );
  }
}

AgentScript.propTypes = {
  script: PropTypes.object.isRequired,
  interactionId: PropTypes.string.isRequired,
  updateScriptValues: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateScriptValues: (interactionId, scriptValueMap) => dispatch(updateScriptValues(interactionId, scriptValueMap)),
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(Radium(AgentScript));
