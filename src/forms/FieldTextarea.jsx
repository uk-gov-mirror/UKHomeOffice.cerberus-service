import React from 'react';

import useField from './useField';
import Textarea from '../govuk/Textarea';

const FieldTextarea = ({
  id,
  name,
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
    <Textarea
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

export default FieldTextarea;
