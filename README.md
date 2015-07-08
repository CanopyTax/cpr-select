cpr-select [![Build Status](https://travis-ci.org/CanopyTax/cpr-select.png?branch=master)](https://travis-ci.org/CanopyTax/cpr-select)
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
import CanopySelect from 'cpr-select';

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

<CanopySelect items={items} onChange={itemsChanged} placeholder="Select a country" selected="AK"></CanopySelect>
```

## Demo
http://canopytax.github.io/cpr-select/
