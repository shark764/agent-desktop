/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/*
 *
 * AgentScript
 *
 */

import React from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateScriptValues } from 'containers/AgentDesktop/actions';

import ErrorBoundary from 'components/ErrorBoundary';

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
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: '30px 30px 30px 0',
    overflowY: 'auto',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
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
    flexFlow: 'column wrap',
    position: 'relative',
  },
  checkboxLabel: {
    whiteSpace: 'normal',
  },
  checkboxInput: {
    verticalAlign: 'top',
    marginTop: '5px',
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
          newState[element.name] =
            script.values !== undefined &&
            script.values[element.name] !== undefined
              ? script.values[element.name]
              : '';
          break;
        case 'dropdown':
        case 'scale':
          newState[element.name] =
            script.values !== undefined &&
            script.values[element.name] !== undefined
              ? script.values[element.name]
              : null;
          break;
        case 'checkbox': {
          const checkboxOptions = {};
          element.options.forEach((option) => {
            checkboxOptions[option.value] =
              script.values !== undefined &&
              script.values[option.value] !== undefined
                ? script.values[option.value]
                : false;
          });
          newState[element.name] = checkboxOptions;
          break;
        }
        default:
          break;
      }
    });
    return newState;
  };

  getScript = () => {
    const scriptElements = [];
    this.props.script.elements.forEach((element) => {
      switch (element.type) {
        case 'text':
          scriptElements.push(
            <TextBlob
              id={element.name}
              key={element.name}
              text={element.text}
              style={styles.element}
            />
          );
          break;
        case 'freeform':
          scriptElements.push(
            <div id={element.name} key={element.name} style={styles.element}>
              <div>
                {element.text}
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
          const dropdownOptions = element.options.map((option) => ({
            value: option.value,
            label: option.name,
          }));
          scriptElements.push(
            <div key={element.name} style={styles.element}>
              <div>
                {element.text}
              </div>
              <div style={styles.select}>
                <Select
                  id={element.name}
                  options={dropdownOptions}
                  value={this.state[element.name]}
                  onChange={(option) =>
                    this.setState({
                      [element.name]: option !== null ? option.value : null,
                    })}
                />
              </div>
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
          scriptElements.push(
            <Image
              id={element.name}
              key={element.name}
              src={element.value}
              placeholder={element.text}
              style={styles.element}
            />
          );
          break;
        case 'checkbox': {
          const checkboxes = element.options.map((option, index) =>
            (<CheckBox
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
            />)
          );
          scriptElements.push(
            <div key={element.id} style={styles.element}>
              <div>
                {element.text}
              </div>
              <div style={styles.checkboxesContainer}>
                {checkboxes}
              </div>
            </div>
          );
          break;
        }
        case 'link':
          scriptElements.push(
            <TextLink
              id={element.name}
              key={element.name}
              link={element.href}
              text={element.text}
              style={styles.element}
            />
          );
          break;
        case 'iframe':
          scriptElements.push(
            <div id={element.name} key={element.name} style={styles.element}>
              {element.text}
              <iframe
                title={element.text}
                src={element.src}
                height={element.height}
                width={element.width}
              />
            </div>
          );
          break;
        default:
          throw console.error(`Unknown script element type: ${element.type}`);
      }
    });
    return scriptElements;
  };

  sendScript = () => {
    const script = {
      interactionId: this.props.interactionId,
      scriptId: this.props.script.id,
      answers: this.state,
    };
    console.log('[AgentScript] Sending this script to SDK', script);
    CxEngage.interactions.sendScript(script);
  };

  render() {
    return (
      <div style={[styles.base, this.props.style]}>
        {this.getScript()}
        <Button
          id="submitScriptButton"
          type="primaryBlue"
          text={messages.submit}
          onClick={this.sendScript}
        />
      </div>
    );
  }
}

AgentScript.propTypes = {
  style: PropTypes.object,
  script: PropTypes.object.isRequired,
  interactionId: PropTypes.string.isRequired,
  updateScriptValues: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    updateScriptValues: (interactionId, scriptValueMap) =>
      dispatch(updateScriptValues(interactionId, scriptValueMap)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(null, mapDispatchToProps)(Radium(AgentScript))
);
