import React from 'react';
import classnames from 'classnames';

import mixin from 'pui-react-mixins';
import Scrim from 'pui-react-mixins/mixins/scrim_mixin';

const {Icon} = require('pui-react-iconography');
require('pui-css-dropdowns');

const types = React.PropTypes;

function defaultToggleNode(dropCaret) {
  if (dropCaret) return <Icon src="chevron_down"/>;
}

class Dropdown extends mixin(React.Component).with(Scrim) {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false
    };
  }

  static propTypes = {
    border: types.bool,
    buttonClassName: types.string,
    closeOnMenuClick: types.bool,
    disableScrim: types.bool,
    dropCaret: types.bool,
    flat: types.bool,
    link: types.bool,
    pullRight: types.bool,
    split: types.bool,
    menuCaret: types.bool,
    title: types.node,
    toggle: types.node,
    onClick: types.func
  };

  static defaultProps = {
    closeOnMenuClick: true,
    disableScrim: false,
    dropCaret: true
  };

  click = (event) => {
    this.setState({isOpen: !this.state.isOpen});
    this.props.onClick && this.props.onClick(event);
  };

  scrimClick = () => {
    this.setState({isOpen: false});
  };

  menuClick = () => {
    if (!this.props.closeOnMenuClick) return;
    this.setState({isOpen: false});
  };

  render() {
    const {border, buttonClassName, children, className, closeOnMenuClick, disableScrim, dropCaret, flat, link, pullRight, onClick, split, title, toggle, menuCaret, ...props} = this.props;
    const {isOpen} = this.state;

    let dropdownLabel, dropdownToggle, toggleNode;

    toggleNode = toggle ? toggle : defaultToggleNode(dropCaret);

    const buttonStyleClasses = classnames('btn-default', buttonClassName);
    dropdownLabel = split ? <div className={classnames('dropdown-label', buttonStyleClasses)}>{title}</div> : null;
    dropdownToggle = (
      <button type="button" onClick={this.click} className={classnames('dropdown-toggle', buttonStyleClasses)}>
        {!split ? title : null}
        {toggleNode}
      </button>
    );

    const dropdownClasses = classnames('dropdown', {
      'dropdown-flat': flat, open: isOpen, split, 'dropdown-link': link
    }, className);
    const dropdownMenuClasses = classnames('dropdown-menu',
      {
        'dropdown-border': border,
        'dropdown-menu-right': pullRight,
        'dropdown-menu-float': split || flat || menuCaret,
        'dropdown-menu-caret': menuCaret
      }
    );
    return (
      <div className={dropdownClasses} {...props}>
          {dropdownLabel}
          {dropdownToggle}
        <div className={dropdownMenuClasses}><ul onClick={this.menuClick}>{children}</ul></div>
      </div>
    );
  };
}

class DropdownItem extends React.Component {
  static propTypes = {
    className: types.string,
    style: types.object,
    href: types.string,
    header: types.bool,
    divider: types.bool,
    disabled: types.bool,
    eventKey: types.string,
    onSelect: types.func
  };

  handleClick = (event) => {
    const {href, disabled, onSelect, eventKey} = this.props;

    if (!href || disabled) {
      event.preventDefault();
    }

    if (disabled) return;

    if (onSelect) {
      onSelect(event, eventKey);
    }
  };

  render() {
    const {children, className, eventKey, style, href, header, divider, disabled, ...anchorProps} = this.props;

    if (header) return (<li role="heading" className="dropdown-header">{children}</li>);
    if (divider) return (<li role="separator" className="divider"/>);

    let anchor;
    if (href) {
      anchor = <a {...{href, disabled, ...anchorProps}} onClick={this.handleClick}>{children}</a>;
    } else {
      anchor = children;
    }

    const disabledClass = disabled ? 'disabled' : '';
    const dropdownItemClass = classnames(className, disabledClass);
    return (
      <li {...{style}} className={dropdownItemClass} onClick={href ? '' : this.handleClick}>
        {anchor}
      </li>
    );
  }
}

module.exports = {
  Dropdown,
  DropdownItem
};
