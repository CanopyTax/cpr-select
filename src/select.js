import React from 'react';
import {findIndex} from 'lodash';

let searchString = "";
let keyTimeout;

function nearest(element, el) {
  if (!element) return false;
  return element === el || nearest(element.parentElement, el);
}

export default class CanopySelect extends React.Component {

  state = {
    dialogDisplayed: false,
    top: 0,
    focused: false,
    close: (e) => {
      if (!nearest(e.target, this.el)) {
        this.setState({
          dialogDisplayed: false,
          focused: false
        });
      }
    }
  };

  componentWillUnmount() {
    document.body.removeEventListener('click', this.state.close);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.state.close);
    let index = this.getIndex(this.props.selected);
    this.setState(() => ({
      selectedIndex: index === -1 ? 0 : index,
    }));
  }

  displayDialog = (e) => {
    if (this.disabled()) return;

    this.setState({
      dialogDisplayed: true
    })
  };

  getIndex = (key) => {
    return findIndex(this.props.options, {key: key});
  };

  onKeyDown = (e) => {
    if (this.disabled()) return;

    const key = e.which;
    let selectedIndex = this.state.selectedIndex;

    if(key !== 9) {      // tab key
      e.preventDefault();
    }

    if(key === 13) {        // enter key
      this.selectItem(selectedIndex)
    } else if(key === 38) { // up key
      if (selectedIndex <= 0) {
        this.setState({
          dialogDisplayed: true,
        });
      } else {
        this.setState({
          dialogDisplayed: true,
          selectedIndex: selectedIndex - 1
        });
      }

    } else if (key === 40) { // down key

      if (selectedIndex === this.props.options.length - 1) {
        this.setState({
          dialogDisplayed: true
        });
      } else {
        this.setState({
          dialogDisplayed: true,
          selectedIndex: selectedIndex + 1
        });
      }
    } else if(key === 27) { // escape key
      this.setState({
        dialogDisplayed: false
      });
    } else {                // all other keys
      this.highlightByText(e.which);
    }
  };

  triggerItemChange = () => {
    if (this.props.onChange) {
      this.props.onChange.call(
        null,
        this.props.options[this.state.selectedIndex].key,
        this.props.options[this.state.selectedIndex],
        this.state.selectedIndex
      );
    }
  };

  selectItem = (index, e) => {
    if (this.disabled()) return;

    setTimeout(() => {
      this.setState({
        selectedIndex: index,
        focused: true,
        dialogDisplayed: false
      });
      setTimeout(this.triggerItemChange);
    });
  };

  positionDialogAndGetTop = (options, index, maxHeight) => {
    const distanceFromEnd = options.length - index;
    const numVisibleOptions = Math.floor(maxHeight / 36);
    const numSurroundingOptions = Math.floor((numVisibleOptions - 1) / 2);
    const unusedPixels = maxHeight % 36;

    if (index > numSurroundingOptions && distanceFromEnd < numSurroundingOptions + 1) {
      // Bottom 5
      if (options.length < numVisibleOptions) {
        // Dialog doesn't have a scroll
        return -2 + (36 * index * -1 - 10) + "px";
      } else {
        // Dialog has a scroll
        this.positionDialog(index, maxHeight);
        const start = (maxHeight / -2) - 15;
        return start - (numSurroundingOptions - distanceFromEnd) * 36 + "px";
      }
    } else if (index > numSurroundingOptions) {
      // Middle
      this.positionDialog(index, maxHeight);
      return (maxHeight / -2) - 0.0075 * maxHeight;
    } else {
      // Top 5
      return -1 + (36 * index * -1 - 10) + "px";
    }
  };

  positionDialog = (index, maxHeight) => {
    setTimeout(() => {
      let menuDialog = this.el.querySelector(".cp-select__menu");
      if (menuDialog) {
        const dialogHeightImpact = maxHeight / 2 - 8;
        menuDialog.scrollTop = (36 * index - dialogHeightImpact);
      }
    });
  };

  focusSelect = () => {
    if (!this.state.focused) {
      this.setState({
        focused: true
      });
    }
  };

  onBlur = () => {
    this.setState({
      focused: false,
      dialogDisplayed: false

    }, () => {
      if (this.props.onBlur) {
      this.props.onBlur.call(
        null,
        this.props.options[this.state.selectedIndex].key,
        this.props.options[this.state.selectedIndex],
        this.state.selectedIndex
      );
      }
    });
  };

  highlightByText = (charCode) => {
    searchString += String.fromCharCode(charCode);
    let i = this.getIndexFromString(searchString);

    if(i > -1) {
      this.selectItem(i);
    }

    clearTimeout(keyTimeout);

    keyTimeout = setTimeout(function() {
      searchString = "";
    }, 1000);
  };

  getIndexFromString = (searchString) => {
    searchString = searchString.toLowerCase();
    return findIndex(this.props.options, (option) => {
      return this.getViewValue(option) !== null ? this.getViewValue(option).toLowerCase().indexOf(searchString) === 0 : false;
    });
  };

  getViewValue = (option) => {
    if (option.value === null || option.value === undefined) return null;
    return option.value || option;
  };

  getDialog = (dialogDisplayed, options) => {
    if (dialogDisplayed) {

      let selectedIndex = this.state.selectedIndex;

      let optionElements = options.map((option, index) => {
        if (option.separator) {
          return <li key={`separator${index}`} className="separator" />
        } else {
          return <li key={option.key} className={selectedIndex === index ? '+selected' : ''} onMouseDown={this.selectItem.bind(this, index)}><a style={option.value !== null ? {} : {color: "rgba(0,0,0,0)"}}>{option.value !== null ? option.value : "null"}</a></li>
        }
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

      const maxHeight = this.props.maxHeight || 400;
      const zIndex = this.props.zIndex || 1000
      const dropdownClass = this.props.dropdownClass;
      return (
        <div>
          <ul className={`cp-select__menu cps-dropdown-menu ${dropdownClass ? dropdownClass : ''}`} style={{top: this.positionDialogAndGetTop(options, selectedIndex, maxHeight), maxHeight: maxHeight + 'px', zIndex}}>
            {optionElements}
          </ul>
        </div>
      );
    }
  };

  disabled = () => {
    return !this.props.options || this.props.options.length === 0 || this.props.disabled;
  }

  render = () => {
    const {options = [], selected, outerClass, selectClass, placeholder, inputClass } = this.props;
    let cpSelectClasses = 'cp-select';
    let selectedItem = options[
      this.getIndex(selected)
    ];
    let that = this;

    if (this.disabled()) cpSelectClasses += ' +disabled';
    if (this.state.focused) cpSelectClasses += ' +focus';

    return (
      <div ref={function(el) { if (el) that.el = el; }} className={`cp-select-outer ${outerClass ? outerClass : ''}`} role='select'>
        <input className={`cp-select__hidden-input ${inputClass ? inputClass : ''}`} onFocus={this.focusSelect} onBlur={this.onBlur} onKeyDown={this.onKeyDown}/>
        <div className={`${cpSelectClasses} ${selectClass ? selectClass : ''}`} onClick={this.displayDialog}>
          {selectedItem
            ? <div className="cp-select__selected">{selectedItem.value}</div>
            : <div className="cp-select__selected" style={{color:'#afafaf'}}>{placeholder}</div>
          }
          {options.length > 0 && <div className="cp-select__icon"></div>}
        </div>
        {this.getDialog(this.state.dialogDisplayed, options)}
      </div>
    );
  }
}

if (typeof window !== "undefined" && window && !window.CanopySelect) window.CanopySelect = CanopySelect;
