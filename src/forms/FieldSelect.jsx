import React from 'react';

import useField from './useField';
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
  const {
    value, error, onChange,
  } = useField({
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
      defaultValue={value}
      onChange={onChange}
      errorMessage={error}
      {...attributes}
    />
  );
};

export default FieldSelect;
