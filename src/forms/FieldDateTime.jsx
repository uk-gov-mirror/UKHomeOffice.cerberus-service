import React from 'react';
import { castArray } from 'lodash';
import classNames from 'classnames';

import useField from './useField';
import DateInput from '../govuk/DateInput';
import { validLongDate, validShortDate, validTime } from './validators';

const FieldDateTime = ({
  id,
  name,
  validate,
  required,
  defaultValue,
  invalidDateMessage = 'Enter a valid date',
  invalidTimeMessage = 'Enter a valid time',
  isShort = false,
  showTime = false,
  ...attributes
}) => {
  const {
    value = {}, error, setFieldValue,
  } = useField({
    name,
    validate: [
      isShort ? validShortDate(invalidDateMessage) : validLongDate(invalidDateMessage),
      showTime ? validTime(invalidTimeMessage) : null,
      ...castArray(validate),
    ],
    required,
    defaultValue,
  });

  const getInputProps = (datePartName, className = 'govuk-input--width-2') => ({
    type: 'text',
    defaultValue: value[datePartName],
    className: classNames(className, { 'govuk-input--error': error }),
    onChange: (e) => {
      setFieldValue(name, {
        ...value,
        [datePartName]: e.target.value,
      });
    },
  });

  const timeInputs = showTime ? {
    hour: {
      label: 'Hour',
      name: 'hour',
      placeholder: 'HH',
      maxLength: 2,
      formGroup: {
        className: 'govuk-!-margin-left-5',
      },
      ...getInputProps('hour'),
    },
    minute: {
      label: 'Minute',
      name: 'minute',
      placeholder: 'MM',
      maxLength: 2,
      ...getInputProps('minute'),
    },
  } : {};

  return (
    <DateInput
      key={name}
      namePrefix={`${name}.`}
      id={id || `field-${name}`}
      name={name}
      errorMessage={error}
      inputs={{
        day: isShort ? null : { placeholder: 'DD', maxLength: 2, ...getInputProps('day') },
        month: { placeholder: 'MM', maxLength: 2, ...getInputProps('month') },
        year: { placeholder: 'YYYY', maxLength: 4, ...getInputProps('year', 'govuk-input--width-4') },
        ...timeInputs,
      }}
      mergeInputs
      {...attributes}
    />
  );
};

export default FieldDateTime;
