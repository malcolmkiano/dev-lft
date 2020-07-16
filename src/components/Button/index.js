import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

class Button extends Component {
  static defaultProps = {
    className: 'default',
    disabled: false,
    onClick: () => null,
    type: 'button',
    isLink: false,
    swap: null
  };

  render() {
    const {
      children,
      className,
      disabled,
      onClick,
      onBlur,
      type,
      isLink,
      swap,
      title
    } = this.props;

    const ButtonTag = !isLink ? 'button' : 'span';
    const SwapElement = swap;

    return (
      <ButtonTag
        className={`btn btn-${className} ${swap ? 'has-swap' : ''}`}
        disabled={disabled}
        onClick={onClick}
        onBlur={onBlur}
        type={type}
        title={title}
      >
        <i className="content">{children}</i>
        {swap ? (
          <SwapElement aria-hidden={true} className="swap" title={children} />
        ) : (
          ''
        )}
      </ButtonTag>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLink: PropTypes.bool,
  swap: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  title: PropTypes.string
};

export default Button;
