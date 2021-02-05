import React from 'react';
import { castArray } from 'lodash';

import useField from './useField';
import DateInput from '../govuk/DateInput';
import { validLongDate, validShortDate } from './validators';

const FieldDate = ({
  id,
  name,
  validate,
  required,
  defaultValue,
  invalidDateMessage = 'Enter a valid date',
  isShort = false,
  ...attributes
}) => {
  const {
    value = {}, error, setFieldValue,
  } = useField({
    name,
    validate: [
      isShort ? validShortDate(invalidDateMessage) : validLongDate(invalidDateMessage),
      ...castArray(validate),
    ],
    required,
    defaultValue,
  });

  const getInputProps = (datePartName) => ({
    defaultValue: value[datePartName],
    onChange: (e) => {
      setFieldValue(name, {
        ...value,
        [datePartName]: e.target.value,
      });
    },
  });

  return (
    <DateInput
      key={name}
      id={id || `field-${name}`}
      name={name}
      errorMessage={error}
      dayInput={isShort ? null : { placeholder: 'DD', ...getInputProps('day') }}
      monthInput={{ placeholder: 'MM', ...getInputProps('month') }}
      yearInput={{ placeholder: 'YYYY', ...getInputProps('year') }}
      {...attributes}
    />
  );
};

export default FieldDate;
