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

  const capitalizeFirstLetter = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const getInputProps = (datePartName, maxLength) => ({
    label: capitalizeFirstLetter(datePartName),
    name: datePartName,
    type: 'text',
    maxLength,
    defaultValue: value[datePartName],
    className: classNames(`govuk-input--width-${maxLength}`, { 'govuk-input--error': error }),
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
        day: isShort ? null : { placeholder: 'DD', maxLength: 2, ...getInputProps('day', 2) },
        month: { placeholder: 'MM', maxLength: 2, ...getInputProps('month', 2) },
        year: { placeholder: 'YYYY', maxLength: 4, ...getInputProps('year', 4) },
        ...timeInputs,
      }}
      {...attributes}
    />
  );
};

export default FieldDateTime;
