import React from 'react';
import classNames from 'classnames';

import Label from './Label';
import Hint from './Hint';
import ErrorMessage from './ErrorMessage';

const FormGroup = ({
  inputId, className, label, hint, errorMessage, describedBy, children,
}) => {
  let hintWithId;
  let errorMessageWithId;
  let labelWithId;
  const describeByElements = [describedBy];

  if (hint) {
    const hintId = inputId ? `${inputId}-hint` : '';
    describeByElements.push(hintId);

    hintWithId = typeof hint === 'string' || React.isValidElement(hint)
      ? <Hint id={hintId}>{hint}</Hint>
      : <Hint id={hintId} {...hint} />;
  }

  if (errorMessage) {
    const errorId = inputId ? `${inputId}-error` : '';
    describeByElements.push(errorId);
    errorMessageWithId = typeof errorMessage === 'string' || React.isValidElement(errorMessage)
      ? <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
      : <ErrorMessage id={errorId} {...errorMessage} />;
  }

  if (label) {
    labelWithId = typeof label === 'string' || React.isValidElement(label)
      ? <Label htmlFor={inputId}>{label}</Label>
      : <Label htmlFor={inputId} {...label} />;
  }

  return (
    <div className={classNames(className, 'govuk-form-group', { 'govuk-form-group--error': errorMessage })}>
      {labelWithId}
      {hintWithId}
      {errorMessageWithId}
      {children({ describedBy: describeByElements.join(' ') })}
    </div>
  );
};

export default FormGroup;
