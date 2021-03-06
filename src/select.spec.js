import CanopySelect from './select.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

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
    expect(ReactDOM.findDOMNode(selection).textContent).toEqual('Kifak?');
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
    expect(ReactDOM.findDOMNode(selection).textContent).toEqual('Alaska');
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
    expect(ReactDOM.findDOMNode(menu[0]).querySelectorAll('li').length).toBe(3);
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
      ReactDOM.findDOMNode(
        ReactDOM.findDOMNode(multiSelect).querySelectorAll('li')[2]
      )
    );
  });

  it('Should not allow up arrow to go out of bounds', function(run) {
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
      expect(key).toBe('AL');
      expect(item.key).toBe('AL');
      expect(index).toBe(0);
      run();
    }

    let multiSelect = TestUtils.renderIntoDocument(
      <CanopySelect options={items} onChange={callback}></CanopySelect>
    );

    let select = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
    TestUtils.Simulate.click(select);
    let input = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select__hidden-input');
    TestUtils.Simulate.keyDown(input, {which: 38});
    TestUtils.Simulate.keyDown(input, {which: 38});
    TestUtils.Simulate.keyDown(input, {which: 38});
    TestUtils.Simulate.keyDown(input, {which: 38});
    TestUtils.Simulate.keyDown(input, {which: 13});
  });

  it('Should not select disabled items with arrows', function(run) {
    let items = [
      {
        "value": "Alabama",
        "key": "AL"
      }, {
        "value": "Alaska",
        "key": "AK",
        "disabled": true
      }, {
        "value": "American Samoa",
        "key": "AS",
        "disabled": true
      }
    ];

    function callback(key, item, index) {
      expect(key).toBe('AL');
      expect(item.key).toBe('AL');
      expect(index).toBe(0);
      run();
    }

    let multiSelect = TestUtils.renderIntoDocument(
      <CanopySelect options={items} onChange={callback}></CanopySelect>
    );

    let select = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select');
    TestUtils.Simulate.click(select);
    let input = TestUtils.findRenderedDOMComponentWithClass(multiSelect, 'cp-select__hidden-input');
    TestUtils.Simulate.keyDown(input, {which: 38});
    TestUtils.Simulate.keyDown(input, {which: 40});
    TestUtils.Simulate.keyDown(input, {which: 40});
    TestUtils.Simulate.keyDown(input, {which: 13});
  });
});
