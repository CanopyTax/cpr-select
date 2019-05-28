cpr-select [![Build Status](https://travis-ci.org/CanopyTax/cpr-select.png?branch=master)](https://travis-ci.org/CanopyTax/cpr-select)
===============

Canopy React Select

## Requirements
 - React ^0.14.2
 - Lodash methods findIndex

## Installation
1. Install through `npm install --save cpr-select`
2. Load the required stylesheet `src/select.css`
3. Optional - if you want some default styling use the stylesheet: `build/external-styles.css`

## Usage

### Props
+ `selected`: the key of the currently selected item
+ `options`: the items to select from. You can insert a separator between items by putting `{separator: true}` as an item. You can also prevent the user from selecting an item by including `disabled: true` in your item object.
+ `onChange`: called when selected item changes
+ `onBlur`: called when the select widget is blurred (with the currently selected item)
+ `disabled`: pass true to disable the input
+ `placeholder`: placeholder for input
+ `selectClass`: (optional) custom class to be added to the select element
+ `outerClass`: (optional) custom class to be added to the outer containing element
+ `inputClass`: (optional) custom class to be added to the hidden input element
+ `dropdownClass`: (optional) custom class to be added to the dropdown element
+ `zIndex`: (optional) override the default z-index of 1000

### Basic
```jsx
import CanopySelect from 'cpr-select';
import 'cpr-select/src/select.css';

let items = [
  {
    "value": "Alabama",
    "key": "AL"
  }, {
    "separator": true,
  }, {
    "value": "Alaska",
    "key": "AK"
  }, {
    "value": "American Samoa",
    "key": "AS",
    "disabled": true
  }
];

function itemsChanged(key, item, index) {
  console.log(key);
}

<CanopySelect options={items} onChange={itemsChanged} placeholder="Select a country" selected="AK"></CanopySelect>
```

## Demo
http://canopytax.github.io/cpr-select/
