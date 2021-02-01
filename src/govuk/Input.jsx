import React from 'react';
import classNames from 'classnames';
import FormGroup from './FormGroup';

const Input = ({ id, type = 'text', className, defaultValue, label, hint, errorMessage, formGroup = {}, describedBy, ...attributes }) => (
  <FormGroup inputId={id} hint={hint} label={label} errorMessage={errorMessage} describedBy={describedBy} {...formGroup}>
    {({ describeBy }) => (
      <input
        className={classNames(className, 'govuk-input', { 'govuk-input--error': errorMessage })}
        id={id}
        type={type}
        defaultValue={defaultValue}
        aria-describedby={describeBy}
        {...attributes}
      />
    )}
  </FormGroup>
);

export default Input;
