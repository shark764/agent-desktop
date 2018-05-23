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

import { fromJS } from 'immutable';

import {
  updateScriptValue,
  updateScriptScrollPosition,
} from 'containers/AgentDesktop/actions';

import {
  getSelectedInteractionId,
  selectCurrentScript,
} from 'containers/AgentDesktop/selectors';

import ErrorBoundary from 'components/ErrorBoundary';

import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Image from 'components/Image';
import TextLink from 'components/TextLink';
import Scale from 'components/Scale';
import TextBlob from 'components/TextBlob';
import TextInput from 'components/TextInput';
import Select from 'components/Select';

import { sendScript } from './actions';
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
  componentWillUnmount() {
    this.scriptContainer.removeEventListener(
      'scroll',
      this.handleScrollUpdates
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.interactionId !== nextProps.interactionId) {
      this.scriptContainer.scrollTop = nextProps.script.scrollTop;
    }
  }

  componentDidMount() {
    if (this.scriptContainer) {
      this.scriptContainer.scrollTop = this.props.script.scrollTop;
      this.scriptContainer.addEventListener('scroll', this.handleScrollUpdates);
    }
  }

  handleScrollUpdates = () => {
    this.props.updateScriptScrollPosition(
      this.props.interactionId,
      this.scriptContainer.scrollTop
    );
  };

  handleScriptInput = ({ element, newValue, option }) => {
    let updatedValue;

    switch (element.type) {
      case 'checkbox':
        updatedValue = this.props.script.values[element.name];
        updatedValue[option.value] = newValue;
        updatedValue = fromJS(updatedValue);
        break;
      case 'dropdown':
        updatedValue = option !== null ? option.value : null;
        break;
      default:
        updatedValue = newValue;
    }

    this.props.updateScriptValue(
      this.props.interactionId,
      element.name,
      updatedValue
    );
  };

  handleSendingScript = () => {
    this.props.sendScript(this.props.interactionId, this.props.script, false);
  };

  mappedScriptElements = () => {
    const { script } = this.props;
    const scriptElements = [];
    script.elements.forEach((element) => {
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
              <div>{element.text}</div>
              <TextInput
                id={`${element.name}-textInput`}
                value={script.values[element.name]}
                cb={(newValue) =>
                  this.handleScriptInput({
                    element,
                    newValue,
                  })
                }
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
              <div>{element.text}</div>
              <div style={styles.select}>
                <Select
                  id={element.name}
                  options={dropdownOptions}
                  value={script.values[element.name]}
                  onChange={(option) =>
                    this.handleScriptInput({
                      element,
                      option,
                    })
                  }
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
              value={script.values[element.name]}
              onChange={(newValue) =>
                this.handleScriptInput({
                  element,
                  newValue,
                })
              }
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
          const checkboxes = element.options.map((option, index) => (
            <CheckBox
              labelStyle={styles.checkboxLabel}
              checkboxInputStyle={styles.checkboxInput}
              id={`${option.value}_${index}`}
              key={`${element.id}_${index}`} // eslint-disable-line
              text={option.name}
              checked={script.values[element.name][option.value]}
              cb={(newValue) =>
                this.handleScriptInput({
                  element,
                  newValue,
                  option,
                })
              }
            />
          ));
          scriptElements.push(
            <div key={element.id} style={styles.element}>
              <div>{element.text}</div>
              <div style={styles.checkboxesContainer}>{checkboxes}</div>
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

  render() {
    return (
      <div
        style={[styles.base, this.props.style]}
        ref={(el) => {
          this.scriptContainer = el;
        }}
      >
        {this.mappedScriptElements()}
        <Button
          id="submitScriptButton"
          type="primaryBlue"
          text={messages.submit}
          onClick={this.handleSendingScript}
        />
      </div>
    );
  }
}

AgentScript.propTypes = {
  style: PropTypes.object,
  script: PropTypes.object.isRequired,
  interactionId: PropTypes.string.isRequired,
  updateScriptValue: PropTypes.func.isRequired,
  updateScriptScrollPosition: PropTypes.func.isRequired,
  sendScript: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  interactionId: getSelectedInteractionId(state, props),
  script: selectCurrentScript(state, props),
});

function mapDispatchToProps(dispatch) {
  return {
    updateScriptValue: (interactionId, elementName, newValue) =>
      dispatch(updateScriptValue(interactionId, elementName, newValue)),
    updateScriptScrollPosition: (interactionId, scrollPosition) =>
      dispatch(updateScriptScrollPosition(interactionId, scrollPosition)),
    sendScript: (interactionId, script, dismissed) =>
      dispatch(sendScript(interactionId, script, dismissed)),
    dispatch,
  };
}

export default ErrorBoundary(
  connect(mapStateToProps, mapDispatchToProps)(Radium(AgentScript))
);
