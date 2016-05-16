import React from 'react';
import {findIndex} from 'lodash';

let searchString = "";
let keyTimeout;

function nearest(element, className) {
	if (!element) return false;
	return element.className.indexOf(className) > -1 || nearest(element.parentElement, className);
}

const CanopySelect = React.createClass({

	componentWillMount: function() {
		document.body.addEventListener('click', this.state.close);
	},

	componentWillUnmount: function() {
		document.body.removeEventListener('click', this.state.close);
	},

	getInitialState: function() {
		let selectedIndex = null;

		if (this.props.selected) {
			selectedIndex = this.getIndex(this.props.selected);
		}

		return {
			dialogDisplayed: false,
			top: 0,
			focused: false,
			close: (e) => {
				if (!nearest(e.target, 'cp-select-outer')) {
					this.setState({
						dialogDisplayed: false,
						focused: false
					});
				}
			}
		}
	},

	displayDialog: function(e) {
		this.setState({
			dialogDisplayed: true
		})
	},

	getIndex: function(key) {
		return findIndex(this.props.options, {key: key});
	},

	onKeyDown: function(e) {
		const key = e.which;
		let selectedIndex = this.state.selectedIndex;

		if(key !== 9) {			// tab key
			e.preventDefault();
		}

		if(key === 13) {				// enter key
			this.selectItem(selectedIndex)
		} else if(key === 38) { // up key

			this.setState({
				dialogDisplayed: true,
				selectedIndex: selectedIndex === undefined ? 0 : selectedIndex - 1
			});

			//positionDialog(scope.collection[scope.selectedIndex]);

		} else if(key === 40) { // down key

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

		} else if(key === 27) { // escape key
			this.setState({
				dialogDisplayed: false
			});
		} else {								// all other keys
			this.highlightByText(e.which);
		}
	},

	triggerItemChange: function() {
		if (this.props.onChange) {
			this.props.onChange.call(
				null,
				this.props.options[this.state.selectedIndex].key,
				this.props.options[this.state.selectedIndex],
				this.state.selectedIndex
			);
		}
	},

	selectItem: function(index, e) {
		setTimeout(() => {
			this.setState({
				selectedIndex: index,
				focused: true,
				dialogDisplayed: false
			});
			setTimeout(this.triggerItemChange);
		});
	},

	positionDialogAndGetTop: function(options, index) {
		let distanceFromEnd = options.length - index;

		if (index > 5 && distanceFromEnd < 6) {
			// Bottom 5
			if(options.length < 11) {
				// Dialog doesn't have a scroll
				return ( -2 + (36 * index * -1 - 10) + "px" );
			} else {
				// Dialog has a scroll
				this.positionDialog(index);
				return ( -215 - (5 - distanceFromEnd) * 36 + "px" );
			}
		} else if (index > 5) {
			// Middle
			this.positionDialog(index);
			return '-203px';
		} else {
			// Top 5
			return ( -1 + (36 * index * -1 - 10) + "px" );
		}
	},

	positionDialog: function(index) {
		setTimeout(() => {
			let menuDialog = this.el.querySelector(".cp-select__menu");
			if (menuDialog) {
				menuDialog.scrollTop = (36 * index - 192);
			}
		});
	},

	focusSelect: function() {
		if (!this.state.focused) {
			this.setState({
				focused: true
			});
		}
	},

	onBlur: function() {
		this.setState({
			focused: false
		});
	},

	highlightByText: function(charCode) {
		searchString += String.fromCharCode(charCode);
		var i = this.getIndexFromString(searchString);

		if(i > -1) {
			this.selectItem(i);
		}

		clearTimeout(keyTimeout);

		keyTimeout = setTimeout(function() {
			searchString = "";
		}, 1000);
	},

	getIndexFromString: function(searchString) {
		searchString = searchString.toLowerCase();
		return findIndex(this.props.options, (option) => {
			return this.getViewValue(option) !== null ? this.getViewValue(option).toLowerCase().indexOf(searchString) === 0 : false;
		});
	},

	getViewValue: function(option) {
		if (option.value === null) return null;
		return option.value || option;
	},

	getDialog: function(dialogDisplayed, options) {
		if (dialogDisplayed) {

			let selectedIndex = this.state.selectedIndex;

			let optionElements = options.map((option, index) => {
				return <li key={option.key} className={selectedIndex === index ? '+selected' : ''} onMouseDown={this.selectItem.bind(this, index)}><a style={option.value !== null ? {} : {color: "rgba(0,0,0,0)"}}>{option.value !== null ? option.value : "null"}</a></li>
			});

			setTimeout(() => {
				try {
					this.el.querySelector('.cp-select__hidden-input').focus();
				} catch(e) {
					// It is okay if the element does not exist anymore
					if (e.message.indexOf('Invariant Violation') === -1) {
						throw new Error(e.message);
					}
				}
			}, 100);

			return (
				<div>
					<ul className="cp-select__menu cps-dropdown-menu" style={{top: this.positionDialogAndGetTop(options, selectedIndex)}}>
						{optionElements}
					</ul>
				</div>
			);
		}
	},

	render: function() {
		let cpSelectClasses = 'cp-select';
		let selectedItem = this.props.options[
			this.getIndex(this.props.selected)
		];
		let that = this;

		if (this.props.disabled) cpSelectClasses += ' +disabled';
		if (this.state.focused) cpSelectClasses += ' +focus';

		return (
			<div ref={function(el) { if (el) that.el = el; }} className='cp-select-outer' role='select'>
				<input className="cp-select__hidden-input" onFocus={this.focusSelect} onBlur={this.onBlur} onKeyDown={this.onKeyDown}/>
				<div className={cpSelectClasses} onClick={this.displayDialog}>
					<div className="cp-select__selected">{selectedItem ? selectedItem.value : this.props.placeholder}</div>
					<div className="cp-select__icon"></div>
				</div>
				{this.getDialog(this.state.dialogDisplayed, this.props.options)}
			</div>
		);
	}
});

if (typeof window !== "undefined" && window && !window.CanopySelect) window.CanopySelect = CanopySelect;

export default CanopySelect;
