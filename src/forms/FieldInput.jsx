import React from 'react';

import useField from '../forms/useField';

const FieldInput = ({
  name,
  type,
  ...rest
}) => {
  const { value, onChange } = useField({
    name,
  })

  return (
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default FieldInput;
