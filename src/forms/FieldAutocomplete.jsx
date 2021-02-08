import React from 'react';
import useField from './useField';
import FormGroup from '../govuk/FormGroup';
import Autocomplete from '../govuk/Autocomplete';

const FieldAutocomplete = ({
  id, name, label, hint, defaultValue, validate, required, formGroup = {}, ...props
}) => {
  const {
    value, error, setFieldValue,
  } = useField({
    name,
    validate,
    required,
    defaultValue,
  });

  const inputId = id || `field-${name}`;

  return (
    <FormGroup inputId={inputId} hint={hint} label={label} errorMessage={error} {...formGroup}>
      <Autocomplete
        inputId={inputId}
        aria-label={label}
        onChange={(newValue) => setFieldValue(name, newValue)}
        error={error}
        value={value}
        {...props}
      />
    </FormGroup>
  );
};

export default FieldAutocomplete;
