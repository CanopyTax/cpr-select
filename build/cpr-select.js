/*!
 * cpr-select
 * author: Bret Little
 * copyright: 2015
 * license: MIT
 * version: 1.0.0
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(1));

	var _lodash = __webpack_require__(2);

	var without = _lodash.without;
	var contains = _lodash.contains;
	var union = _lodash.union;
	var isNull = _lodash.isNull;
	var findIndex = _lodash.findIndex;

	__webpack_require__(3);

	var searchString = undefined;
	var keyTimeout = undefined;

	function nearest(_x, _x2) {
		var _left;

		var _again = true;

		_function: while (_again) {
			_again = false;
			var element = _x,
			    className = _x2;

			if (!element) {
				return false;
			}
			if (_left = element.className.indexOf(className) > -1) {
				return _left;
			}

			_x = element.parentElement;
			_x2 = className;
			_again = true;
			continue _function;
		}
	}

	var CanopySelect = React.createClass({
		displayName: "CanopySelect",

		componentWillMount: function componentWillMount() {
			document.body.addEventListener("click", this.state.close);
		},

		componentWillUnmount: function componentWillUnmount() {
			document.body.removeEventListener("click", this.state.close);
		},

		getInitialState: function getInitialState() {
			var _this = this;

			var selectedIndex = null;

			if (this.props.selected) {
				selectedIndex = findIndex(this.props.options, { key: this.props.selected });
			}

			return {
				selectedIndex: selectedIndex,
				dialogDisplayed: false,
				top: 0,
				focused: false,
				close: function (e) {
					if (!nearest(e.target, "cp-select-outer")) {
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
					selectedIndex: !selectedIndex ? 0 : selectedIndex - 1
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
				this.props.onChange.call(null, this.props.options[this.state.selectedIndex], this.state.selectedIndex);
			}
		},

		selectItem: function selectItem(index, e) {
			var _this = this;

			setTimeout(function () {
				_this.setState({
					selectedIndex: index,
					focused: true,
					dialogDisplayed: false
				});
				setTimeout(_this.triggerItemChange);
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
				return "-203px";
			} else {
				// Top 5
				return -1 + (36 * index * -1 - 10) + "px";
			}
		},

		positionDialog: function positionDialog(index) {
			var _this = this;

			setTimeout(function () {
				var menuDialog = React.findDOMNode(_this).querySelector(".cp-select__menu");
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
					selectedIndex: i });
			}

			keyTimeout = setTimeout(function () {
				searchString = "";
			}, 1000);
		},

		getIndexFromString: function getIndexFromString(searchString) {
			var _this = this;

			searchString = searchString.toLowerCase();
			return findIndex(this.props.options, function (option) {
				return _this.getViewValue(option).toLowerCase().indexOf(searchString) === 0;
			});
		},

		getViewValue: function getViewValue(option) {
			return option.value || option;
		},

		getDialog: function getDialog(dialogDisplayed, options) {
			var _this = this;

			if (dialogDisplayed) {
				var _ret = (function () {

					var selectedIndex = _this.state.selectedIndex;

					var optionElements = options.map(function (option, index) {
						return React.createElement(
							"li",
							{ key: option.key, className: selectedIndex === index ? "+selected" : "", onMouseDown: _this.selectItem.bind(_this, index) },
							React.createElement(
								"a",
								null,
								option.value
							)
						);
					});

					setTimeout(function () {
						React.findDOMNode(_this).querySelector(".cp-select__hidden-input").focus();
					}, 100);

					return {
						v: React.createElement(
							"div",
							null,
							React.createElement(
								"ul",
								{ className: "cp-select__menu cps-dropdown-menu", style: { top: _this.positionDialogAndGetTop(options, selectedIndex) } },
								optionElements
							)
						)
					};
				})();

				if (typeof _ret === "object") {
					return _ret.v;
				}
			}
		},

		render: function render() {
			var cpSelectClasses = "cp-select";
			var selectedItem = this.props.options[this.state.selectedIndex];

			if (this.props.disabled) cpSelectClasses += " +disabled";
			if (this.state.focused) cpSelectClasses += " +focus";

			return React.createElement(
				"div",
				{ className: "cp-select-outer", role: "select" },
				React.createElement("input", { className: "cp-select__hidden-input", onFocus: this.focusSelect, onBlur: this.onBlur, onKeyDown: this.onKeyDown }),
				React.createElement(
					"div",
					{ className: cpSelectClasses, onClick: this.displayDialog },
					React.createElement(
						"div",
						{ className: "cp-select__selected" },
						selectedItem ? selectedItem.value : this.props.placeholder
					),
					React.createElement("div", { className: "cp-select__icon" })
				),
				this.getDialog(this.state.dialogDisplayed, this.props.options)
			);
		}
	});

	if (!window.CanopySelect) window.CanopySelect = CanopySelect;

	module.exports = CanopySelect;

	//			dialogDisplayed: true

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = _;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/home/blittle/dev/cpr-select/node_modules/css-loader/index.js!/home/blittle/dev/cpr-select/node_modules/autoprefixer-loader/index.js!/home/blittle/dev/cpr-select/src/select.css", function() {
			var newContent = require("!!/home/blittle/dev/cpr-select/node_modules/css-loader/index.js!/home/blittle/dev/cpr-select/node_modules/autoprefixer-loader/index.js!/home/blittle/dev/cpr-select/src/select.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	exports.push([module.id, ".cp-select-outer {\n\tposition: relative;\n\theight: 32px;\n\tfont-size: 12px;\n}\n\n.cp-select {\n\tborder-radius: 2px;\n\tbox-shadow: 0 1px 4px 0 rgba(0,0,0,.26);\n\tdisplay: inline-block;\n\tpadding: 8px 14px;\n\tmin-width: 140px;\n\tcolor: #AFAFAF;\n\tbackground-color: #fff;\n\tcursor: pointer;\n\twidth: 100%;\n\theight: 32px;\n}\n\n.cps-has-error .cp-select {\n\tbox-shadow: 0 1px 4px 0 #FE996C;\n}\n\n.cp-select.\\+disabled {\n\tcursor: not-allowed;\n\tbackground-color: #F9F9F9;\n\topacity: 1;\n\tborder: 1px dashed #CFCFCF;\n}\n\n.cp-select.\\+focus {\n\tbox-shadow: 0 0 0 2px rgba(76,175,80,.3); /* emulate the border */\n}\n\n.cp-select__selected {\n\twidth: calc(100% - 15px);\n\tvertical-align: middle;\n\tdisplay: inline-block;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n}\n\n.cp-select__icon {\n\tdisplay: inline-block;\n\tborder-color: #AFAFAF transparent;\n\tborder-style: solid;\n\tborder-width: 6px 6px 0px 6px;\n\theight: 0px;\n\twidth: 0px;\n\tfloat:right;\n\tposition: relative;\n\ttop: 6px;\n}\n\n.cp-select-outer .cp-select__menu {\n\tdisplay: block;\n\tmax-height: 400px;\n\toverflow: auto;\n\twidth: 100%;\n\tposition: absolute;\n\tfont-size: 12px;\n}\n\n.cp-select-outer .cp-select__menu li {\n\theight: 36px!important;\n}\n\n.cp-select-outer .cp-select__menu li.\\+selected > a {\n\tcolor: #333333;\n\ttext-decoration: none;\n\tbackground-color: #f7f7f7;\n}\n\n.cp-select__hidden-input {\n\topacity: 0;\n\tposition: absolute;\n\tleft: 0;\n\ttop:0;\n\twidth: 0;\n\theight: 0;\n}\n\n", ""]);

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ }
/******/ ]);