import React from 'react';

import useField from './useField';
import Radios from '../govuk/Radios';

const FieldRadios = ({
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
    <Radios
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

export default FieldRadios;
