## Origin
This component was created using Collapsible component as basis.

## Updates

## Usage
CollapsibleMultiselect can receive any HTML elements or React component as it's children and make it selectable so you can store a selected item list in redux.

### ES6
```javascript

import React from 'react';
import CollapsibleMultiselect from 'components/CollapsibleMultiselect';

var App = React.createClass({

  selected: true;

  toggleSelection = () => {
    return !this.selected;
  };

  render: function() {
    return(
      <CollapsibleMultiselect
        title="Single Selector"
        toggleSelection={this.toggleSelection}
        singleToggle={this.selected}
      />
    );
  }

});

export default App;
```

---
## Properties *(Options)*
### **transitionTime** | *number* | default: 400
The number of milliseconds for the open/close transition to take.

### **easing** | *string* | default: 'linear'
The CSS easing method you wish to apply to the open/close transition. This string can be any valid value of CSS `transition-timing-function`. For reference view the [MDN documentation](https://developer.mozilla.org/en/docs/Web/CSS/transition-timing-function).

### **open** | *bool* | default: false
Set to true if you want the CollapsibleMultiselect to begin in the open state. You can also use this prop to manage the state from a parent component.

### **title** | *object*
Defines the title to show in multiselect component.

### **items** | *array*
Array of items desired to be selectable.

### **toggleSelection** | *function* | **required**
Function required to toggle the selection of a child/single item.

### **selectAllBtn** | *bool* | default: undefined
Property that allows a "Select All" button to be displayed (if true, it should receive a "selectAll" function too)

### **selectAll** | *function*
Function that toggles all children items of the component at the same time.

### **singleToggleBtn** | *bool*
Icon that changes it state based on a single toggle selection.

### **selectedItems** | *array*
Array where the component stores the selected items, it is mandatory when the collapsible mode is multiple, since is the array where the component compares the current selected values.

### **toggleShowList** | *function*
Function that stores the visible state of the items in the component.
