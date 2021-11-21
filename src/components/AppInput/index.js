import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const AppInput = ({
  value,
  style,
  onChange,
  className,
  placeholder,
  ...props
}) => (
  <Input
    {...props}
    value={value}
    style={style}
    onChange={onChange}
    className={className}
    placeholder={placeholder}
  />
);

AppInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.instanceOf(Object),
};

AppInput.defaultProps = {
  style: {},
  className: '',
  placeholder: '',
  value: '',
  onChange: () => undefined,
};

export default AppInput;
