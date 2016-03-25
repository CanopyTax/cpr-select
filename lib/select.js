'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var searchString = undefined;
var keyTimeout = undefined;

function nearest(_x, _x2) {
	var _left;

	var _again = true;

	_function: while (_again) {
		var element = _x,
		    className = _x2;
		_again = false;

		if (!element) return false;

		if (_left = element.className.indexOf(className) > -1) {
			return _left;
		}

		_x = element.parentElement;
		_x2 = className;
		_again = true;
		continue _function;
	}
}

var CanopySelect = _react2['default'].createClass({
	displayName: 'CanopySelect',

	componentWillMount: function componentWillMount() {
		document.body.addEventListener('click', this.state.close);
	},

	componentWillUnmount: function componentWillUnmount() {
		document.body.removeEventListener('click', this.state.close);
	},

	getInitialState: function getInitialState() {
		var _this = this;

		var selectedIndex = null;

		if (this.props.selected) {
			selectedIndex = this.getIndex(this.props.selected);
		}

		return {
			dialogDisplayed: false,
			top: 0,
			focused: false,
			close: function close(e) {
				if (!nearest(e.target, 'cp-select-outer')) {
					_this.setState({
						dialogDisplayed: false,
						focused: false
					});
				}
			}
		};
	},

	displayDialog: function displayDialog(e) {
		this.setState({
			dialogDisplayed: true
		});
	},

	getIndex: function getIndex(key) {
		return (0, _lodash.findIndex)(this.props.options, { key: key });
	},

	onKeyDown: function onKeyDown(e) {
		var key = e.which;
		var selectedIndex = this.state.selectedIndex;

		if (key !== 9) {
			// tab key
			e.preventDefault();
		}

		if (key === 13) {
			// enter key
			this.selectItem(selectedIndex);
		} else if (key === 38) {
			// up key

			this.setState({
				dialogDisplayed: true,
				selectedIndex: selectedIndex === undefined ? 0 : selectedIndex - 1
			});

			//positionDialog(scope.collection[scope.selectedIndex]);
		} else if (key === 40) {
				// down key

				if (selectedIndex === this.props.options.length - 1) {
					this.setState({
						dialogDisplayed: true
					});
				} else {
					this.setState({
						dialogDisplayed: true,
						selectedIndex: !selectedIndex ? 0 : selectedIndex + 1
					});
				}

				//positionDialog(scope.collection[scope.selectedIndex]);
			} else if (key === 27) {
					// escape key
					this.setState({
						dialogDisplayed: false
					});
				} else {
					// all other keys
					this.highlightByText(e.which);
				}
	},

	triggerItemChange: function triggerItemChange() {
		if (this.props.onChange) {
			this.props.onChange.call(null, this.props.options[this.state.selectedIndex].key, this.props.options[this.state.selectedIndex], this.state.selectedIndex);
		}
	},

	selectItem: function selectItem(index, e) {
		var _this2 = this;

		setTimeout(function () {
			_this2.setState({
				selectedIndex: index,
				focused: true,
				dialogDisplayed: false
			});
			setTimeout(_this2.triggerItemChange);
		});
	},

	positionDialogAndGetTop: function positionDialogAndGetTop(options, index) {
		var distanceFromEnd = options.length - index;

		if (index > 5 && distanceFromEnd < 6) {
			// Bottom 5
			if (options.length < 11) {
				// Dialog doesn't have a scroll
				return -2 + (36 * index * -1 - 10) + "px";
			} else {
				// Dialog has a scroll
				this.positionDialog(index);
				return -215 - (5 - distanceFromEnd) * 36 + "px";
			}
		} else if (index > 5) {
			// Middle
			this.positionDialog(index);
			return '-203px';
		} else {
			// Top 5
			return -1 + (36 * index * -1 - 10) + "px";
		}
	},

	positionDialog: function positionDialog(index) {
		var _this3 = this;

		setTimeout(function () {
			var menuDialog = _this3.el.querySelector(".cp-select__menu");
			if (menuDialog) {
				menuDialog.scrollTop = 36 * index - 192;
			}
		});
	},

	focusSelect: function focusSelect() {
		if (!this.state.focused) {
			this.setState({
				focused: true
			});
		}
	},

	onBlur: function onBlur() {
		this.setState({
			focused: false
		});
	},

	highlightByText: function highlightByText(charCode) {
		searchString += String.fromCharCode(charCode);
		var i = this.getIndexFromString(searchString);

		if (i > -1) {
			this.setState({
				selectedIndex: i
			});
		}

		//			dialogDisplayed: true
		keyTimeout = setTimeout(function () {
			searchString = "";
		}, 1000);
	},

	getIndexFromString: function getIndexFromString(searchString) {
		var _this4 = this;

		searchString = searchString.toLowerCase();
		return (0, _lodash.findIndex)(this.props.options, function (option) {
			return _this4.getViewValue(option) !== null ? _this4.getViewValue(option).toLowerCase().indexOf(searchString) === 0 : false;
		});
	},

	getViewValue: function getViewValue(option) {
		if (option.value === null) return null;
		return option.value || option;
	},

	getDialog: function getDialog(dialogDisplayed, options) {
		var _this5 = this;

		if (dialogDisplayed) {
			var _ret = (function () {

				var selectedIndex = _this5.state.selectedIndex;

				var optionElements = options.map(function (option, index) {
					return _react2['default'].createElement(
						'li',
						{ key: option.key, className: selectedIndex === index ? '+selected' : '', onMouseDown: _this5.selectItem.bind(_this5, index) },
						_react2['default'].createElement(
							'a',
							{ style: option.value !== null ? {} : { color: "rgba(0,0,0,0)" } },
							option.value !== null ? option.value : "null"
						)
					);
				});

				setTimeout(function () {
					try {
						_this5.el.querySelector('.cp-select__hidden-input').focus();
					} catch (e) {
						// It is okay if the element does not exist anymore
						if (e.message.indexOf('Invariant Violation') === -1) {
							throw new Error(e.message);
						}
					}
				}, 100);

				return {
					v: _react2['default'].createElement(
						'div',
						null,
						_react2['default'].createElement(
							'ul',
							{ className: 'cp-select__menu cps-dropdown-menu', style: { top: _this5.positionDialogAndGetTop(options, selectedIndex) } },
							optionElements
						)
					)
				};
			})();

			if (typeof _ret === 'object') return _ret.v;
		}
	},

	render: function render() {
		var cpSelectClasses = 'cp-select';
		var selectedItem = this.props.options[this.getIndex(this.props.selected)];
		var that = this;

		if (this.props.disabled) cpSelectClasses += ' +disabled';
		if (this.state.focused) cpSelectClasses += ' +focus';

		return _react2['default'].createElement(
			'div',
			{ ref: function (el) {
					if (el) that.el = el;
				}, className: 'cp-select-outer', role: 'select' },
			_react2['default'].createElement('input', { className: 'cp-select__hidden-input', onFocus: this.focusSelect, onBlur: this.onBlur, onKeyDown: this.onKeyDown }),
			_react2['default'].createElement(
				'div',
				{ className: cpSelectClasses, onClick: this.displayDialog },
				_react2['default'].createElement(
					'div',
					{ className: 'cp-select__selected' },
					selectedItem ? selectedItem.value : this.props.placeholder
				),
				_react2['default'].createElement('div', { className: 'cp-select__icon' })
			),
			this.getDialog(this.state.dialogDisplayed, this.props.options)
		);
	}
});

if (window && !window.CanopySelect) window.CanopySelect = CanopySelect;

exports['default'] = CanopySelect;
module.exports = exports['default'];