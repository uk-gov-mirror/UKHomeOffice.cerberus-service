import React from 'react';

import useField from '../forms/useField';
import Select from '../govuk/Select';

const FieldSelect = ({
  id,
  name,
  type,
  validate,
  required,
  defaultValue,
  ...attributes
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  return (
    <Select
      key={name}
      id={id || `field-${name}`}
      name={name}
      defaultValue={value || defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      errorMessage={error}
      {...attributes}
    />
  );
}

export default FieldSelect;
