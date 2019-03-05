/*
 * Copyright © 2015-2017 Serenova, LLC. All rights reserved.
 */

/**
 *
 * CollapsibleMultiselect
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';
import IconSVG from 'components/IconSVG';

const MainContainer = styled.div`
  padding: 5px;
  display: flex;
  cursor: pointer;
  flex-flow: row wrap;
  &:hover {
    background-color: #def8fe;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  padding-left: 10px;
  padding-top: 5px;
  max-height: 100px;
  cursor: pointer;
  &:hover {
    background-color: #def8fe;
  }
`;

const ItemLabel = styled.label`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  cursor: pointer;
`;

const checkStatus = {
  float: 'right',
  marginLeft: 'auto',
};

const checkAllStatus = {
  float: 'right',
  marginLeft: '2%',
};

const unCheckAllStatus = {
  float: 'right',
  marginLeft: '2%',
  opacity: '0.4',
  filter: 'alpha(opacity=40)',
};

const iconClosed = {
  marginTop: '6px',
  height: '8px',
  width: '13.33px',
  marginLeft: 'auto',
  flexShrink: '0',
  fontWeight: '600',
  transition: 'transform 0.5s',
};

const iconOpen = {
  transform: 'rotate(180deg)',
  marginLeft: 'auto',
  height: '8px',
  width: '13.33px',
  flexShrink: '0',
  fontWeight: '600',
};

const caretIconContainer = {
  marginLeft: 'auto',
};

const checkAllContainer = {
  marginLeft: '5px',
};

const iconLoading = {
  float: 'right',
};

class CollapsibleMultiselect extends Component {
  constructor(props) {
    super(props);

    // Defaults the dropdown to be closed
    if (this.props.open) {
      this.state = {
        isClosed: false,
        height: 'auto',
        transition: 'none',
      };
    } else {
      this.state = {
        isClosed: true,
        height: 0,
        transition: `height ${this.props.transitionTime}ms ${
          this.props.easing
        }`,
        overflow: 'hidden',
      };
    }

    //  Setting the component mode (multiselect/single) based on the items list
    if (this.props.items !== undefined) {
      this.collapsibleMode = true;
    } else {
      this.collapsibleMode = false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.shouldOpenOnNextCycle) {
      this.continueOpenCollapsible();
    }

    if (
      prevState.height === 'auto' &&
      this.state.shouldSwitchAutoOnNextCycle === true
    ) {
      window.setTimeout(() => {
        // Set small timeout to ensure a true re-render
        this.setState({
          height: 0,
          overflow: 'hidden',
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
    }
  }

  closeCollapsible() {
    this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: this.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
    });
  }

  openCollapsible() {
    this.setState({
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible() {
    this.setState({
      height: this.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      shouldOpenOnNextCycle: false,
    });
  }

  //  Function called when component is multiselect to show/hide items list dropdown
  multiSelectTriggerClick = () => {
    //  Toggles visible state in redux
    if (this.props.toggleShowList !== undefined) {
      this.props.toggleShowList();
    }
    if (this.state.isClosed === true) {
      this.openCollapsible();
    } else {
      this.closeCollapsible();
    }
  };

  handleTransitionEnd = () => {
    // Switch to height auto to make the container responsive
    if (!this.state.isClosed) {
      this.setState({ height: 'auto' });
    } else {
      this.setState({ height: 0 });
    }
  };

  //  Toggles a child item based on an id
  selectItem(selectedItem) {
    this.props.toggleSelection(selectedItem.id);
  }

  //  Toggle all items of the component at the same time based on the ids.
  selectAllItems = (e) => {
    e.stopPropagation();
    const itemsIds = this.props.items.map(
      (collapsibleItem) => collapsibleItem.id
    );
    this.props.selectAll(itemsIds);
  };

  //  Function called when component is single select to toggle a boolean value
  singleSelectTriggerClick = () => {
    this.props.toggleSelection();
  };

  render() {
    const dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow,
      maxHeight: '300px',
      overflowY: 'auto',
    };

    //  We want to render the component just when is not loading and it is multiple list, when it is loading or when it is not multiple (single mode)
    if (
      (!this.props.loading &&
        this.collapsibleMode &&
        this.props.items.length > 0) ||
      this.props.loading ||
      !this.collapsibleMode
    ) {
      return (
        <div>
          <MainContainer
            onClick={
              this.collapsibleMode
                ? this.multiSelectTriggerClick
                : this.singleSelectTriggerClick
            }
          >
            <FormattedMessage {...this.props.title} />
            <div style={checkAllContainer} />
            {this.collapsibleMode &&
              !this.props.loading &&
              `(${this.props.selectedItems.length}/${this.props.items.length})`}
            {this.collapsibleMode &&
              this.props.selectAllBtn && (
              <div style={checkAllContainer} onClick={this.selectAllItems}>
                {this.props.loading ? (
                  <IconSVG
                    id={`${this.props.title}-loading-icon`}
                    name="loading"
                    width="20px"
                    style={iconLoading}
                  />
                ) : (
                  <Icon
                    name="checkStatus"
                    style={
                      this.props.selectedItems.length ===
                        this.props.items.length
                        ? checkAllStatus
                        : unCheckAllStatus
                    }
                  />
                )}
              </div>
            )}

            {this.collapsibleMode &&
              !this.props.loading && (
              <div style={caretIconContainer}>
                <Icon
                  name="caret"
                  style={[iconClosed, !this.state.isClosed && iconOpen]}
                />
              </div>
            )}
            {!this.collapsibleMode &&
              this.props.singleToggleBtn && (
              <div style={checkStatus}>
                <Icon name="checkStatus" style={checkStatus} />
              </div>
            )}
          </MainContainer>
          {this.collapsibleMode && (
            <div
              ref={(outer) => {
                this.outer = outer;
              }}
              style={dropdownStyle}
              onTransitionEnd={this.handleTransitionEnd}
            >
              <div
                ref={(inner) => {
                  this.inner = inner;
                }}
              >
                {this.collapsibleMode &&
                  this.props.items.map((item) => (
                    <ItemContainer
                      key={`${item.id}-title`}
                      title={item.name}
                      onClick={() => this.selectItem(item)}
                      tabIndex="0" // eslint-disable-line
                    >
                      <ItemLabel>
                        {item.name}
                      </ItemLabel>
                      {this.props.selectedItems.includes(item.id) && (
                        <Icon name="checkStatus" style={checkStatus} />
                      )}
                    </ItemContainer>
                  ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  }
}

CollapsibleMultiselect.propTypes = {
  transitionTime: PropTypes.number,
  easing: PropTypes.string,
  open: PropTypes.bool,
  title: PropTypes.object,
  items: PropTypes.array,
  toggleSelection: PropTypes.func.isRequired,
  selectAllBtn: PropTypes.bool,
  selectAll: PropTypes.func,
  singleToggleBtn: PropTypes.bool,
  selectedItems: PropTypes.array,
  toggleShowList: PropTypes.func,
  loading: PropTypes.bool,
};

CollapsibleMultiselect.defaultProps = {
  transitionTime: 400,
  easing: 'linear',
};

export default CollapsibleMultiselect;
