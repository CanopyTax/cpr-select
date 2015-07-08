cpr-multiselect [![Build Status](https://travis-ci.org/CanopyTax/cpr-select.png?branch=master)](https://travis-ci.org/CanopyTax/cpr-select)
===============

Canopy React Select

## Requirements
 - React 0.13.3
 - Lodash methods findIndex

## Installation
1. Install through `npm install --save cpr-select`
2. Optional - if you want some default styling use the stylesheet: `build/external-styles.css`

## Usage

### Basic
```jsx
import MultiSelect from 'cpr-multiselect';

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

<MultiSelect items={items} onChange={itemsChanged} placeholder="Select a country" selected="AK"></MultiSelect>
```

## Demo
http://canopytax.github.io/cpr-select/
