'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _selectJs = require('./select.js');

var _selectJs2 = _interopRequireDefault(_selectJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactLibReactTestUtils = require('react/lib/ReactTestUtils');

var _reactLibReactTestUtils2 = _interopRequireDefault(_reactLibReactTestUtils);

describe('select', function () {
	it('Should render an empty component', function () {
		var multiSelect = _reactLibReactTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_selectJs2['default'], { options: [] }));

		var hiddenInput = _reactLibReactTestUtils2['default'].scryRenderedDOMComponentsWithTag(multiSelect, 'input');
		var renderedInput = _reactLibReactTestUtils2['default'].scryRenderedDOMComponentsWithClass(multiSelect, 'cp-select');

		expect(hiddenInput.length).toBe(1);
		expect(renderedInput.length).toBe(1);
	});

	it('Should render placeholder', function () {
		var multiSelect = _reactLibReactTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_selectJs2['default'], { options: [], placeholder: 'Kifak?' }));

		var selection = _reactLibReactTestUtils2['default'].findRenderedDOMComponentWithClass(multiSelect, 'cp-select__selected');
		expect(_reactDom2['default'].findDOMNode(selection).textContent).toEqual('Kifak?');
	});

	it('Should render a component with a selected option', function () {
		var items = [{
			"value": "Alabama",
			"key": "AL"
		}, {
			"value": "Alaska",
			"key": "AK"
		}, {
			"value": "American Samoa",
			"key": "AS"
		}];

		var multiSelect = _reactLibReactTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_selectJs2['default'], { options: items, selected: items[1].key }));

		var selection = _reactLibReactTestUtils2['default'].findRenderedDOMComponentWithClass(multiSelect, 'cp-select__selected');
		expect(_reactDom2['default'].findDOMNode(selection).textContent).toEqual('Alaska');
	});

	it('Should render a dialog when clicked', function () {
		var items = [{
			"value": "Alabama",
			"key": "AL"
		}, {
			"value": "Alaska",
			"key": "AK"
		}, {
			"value": "American Samoa",
			"key": "AS"
		}];

		var multiSelect = _reactLibReactTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_selectJs2['default'], { options: items }));

		var select = _reactLibReactTestUtils2['default'].findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
		_reactLibReactTestUtils2['default'].Simulate.click(select);

		var menu = _reactLibReactTestUtils2['default'].scryRenderedDOMComponentsWithClass(multiSelect, 'cp-select__menu');
		expect(menu.length).toBe(1);
		expect(_reactDom2['default'].findDOMNode(menu[0]).querySelectorAll('li').length).toBe(3);
	});

	it('Should select items and trigger a callback', function (run) {
		var items = [{
			"value": "Alabama",
			"key": "AL"
		}, {
			"value": "Alaska",
			"key": "AK"
		}, {
			"value": "American Samoa",
			"key": "AS"
		}];

		function callback(key, item, index) {
			expect(key).toBe('AS');
			expect(item.key).toBe('AS');
			expect(index).toBe(2);
			run();
		}

		var multiSelect = _reactLibReactTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(_selectJs2['default'], { options: items, onChange: callback }));

		var select = _reactLibReactTestUtils2['default'].findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
		_reactLibReactTestUtils2['default'].Simulate.click(select);

		_reactLibReactTestUtils2['default'].Simulate.mouseDown(_reactDom2['default'].findDOMNode(_reactDom2['default'].findDOMNode(multiSelect).querySelectorAll('li')[2]));
	});
});