import { useEffect } from 'react';

import { useFormContext } from './formContext';
import { requireValue } from './validators';

const useField = ({
  name,
  defaultValue = '',
  validate = null,
  required = null,
}) => {
  const {
    registerField,
    deregisterField,
    setFieldValue,
    getFieldState,
    setFieldError,
  } = useFormContext();

  const prepareValidators = () => {
    const validators = Array.isArray(validate)
      ? validate
      : [validate].filter((v) => v);

    if (required) {
      validators.unshift(requireValue(required));
    }

    return validators;
  };

  useEffect(() => {
    registerField({ name, defaultValue, validate: prepareValidators() });

    return () => {
      deregisterField(name);
    };
  }, [name]);

  const fieldState = getFieldState(name);

  return {
    name,
    value: fieldState.value,
    error: fieldState.error,
    onChange: (e) => setFieldValue(name, e.target.value),
    setFieldValue,
    setFieldError,
  };
};

export default useField;
