import CanopySelect from './select.js';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

describe('select', function() {
	it('Should render an empty component', function() {
		let multiSelect = TestUtils.renderIntoDocument(
			<CanopySelect options={[]}></CanopySelect>
		);

		let hiddenInput = TestUtils.scryRenderedDOMComponentsWithTag(multiSelect, 'input');
		let renderedInput = TestUtils.scryRenderedDOMComponentsWithClass(multiSelect, 'cp-select');

		expect(hiddenInput.length).toBe(1);
		expect(renderedInput.length).toBe(1);
	});

	it('Should render placeholder', function() {
		let multiSelect = TestUtils.renderIntoDocument(
			<CanopySelect options={[]} placeholder='Kifak?'></CanopySelect>
		);

		let selection = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select__selected');
		expect(selection.getDOMNode().textContent).toEqual('Kifak?');
	});

	it('Should render a component with a selected option', function() {
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

		let multiSelect = TestUtils.renderIntoDocument(
			<CanopySelect options={items} selected={items[1].key}></CanopySelect>
		);

		let selection = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select__selected');
		expect(selection.getDOMNode().textContent).toEqual('Alaska');
	});

	it('Should render a dialog when clicked', function() {
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

		let multiSelect = TestUtils.renderIntoDocument(
			<CanopySelect options={items}></CanopySelect>
		);

		let select = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
		TestUtils.Simulate.click(select);

		let menu = TestUtils.scryRenderedDOMComponentsWithClass(multiSelect, 'cp-select__menu');
		expect(menu.length).toBe(1);
		expect(menu[0].getDOMNode().querySelectorAll('li').length).toBe(3);
	});

	it('Should select items and trigger a callback', function(run) {
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

		function callback(key, item, index) {
			expect(key).toBe('AS');
			expect(item.key).toBe('AS');
			expect(index).toBe(2);
			run();
		}

		let multiSelect = TestUtils.renderIntoDocument(
			<CanopySelect options={items} onChange={callback}></CanopySelect>
		);

		let select = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
		TestUtils.Simulate.click(select);

		TestUtils.Simulate.mouseDown(
			React.findDOMNode(multiSelect.getDOMNode().querySelectorAll('li')[2])
		);

	});
});
