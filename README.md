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
+ `options`: the items to select from
+ `onChange`: called when selected item changes
+ `disabled`: pass true to disable the input
+ `placeholder`: placeholder for input

### Basic
```jsx
import CanopySelect from 'cpr-select';
import 'cpr-select/src/select.css';

let items = [
	{
		"value": "Alabama",
		"key": "AL"
	}, {
		"value": "Alaska",
		"key": "AK"
	}, {
		"value": "American Samoa",
		"key": "AS"
	}
];

function itemsChanged(key, item, index) {
	console.log(key);
}

<CanopySelect options={items} onChange={itemsChanged} placeholder="Select a country" selected="AK"></CanopySelect>
```

## Demo
http://canopytax.github.io/cpr-select/
