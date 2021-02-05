import React from 'react';

import useField from './useField';
import Input from '../govuk/Input';

const FieldInput = ({
  id,
  name,
  type,
  validate,
  required,
  defaultValue,
  ...attributes
}) => {
  const {
    value, error, onChange,
  } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  return (
    <Input
      key={name}
      id={id || `field-${name}`}
      type={type}
      name={name}
      defaultValue={value}
      onChange={onChange}
      errorMessage={error}
      {...attributes}
    />
  );
};

export default FieldInput;
