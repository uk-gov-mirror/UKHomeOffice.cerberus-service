import React from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import Label from './Label';
import Hint from './Hint';
import ErrorMessage from './ErrorMessage';
import Fieldset from './Fieldset';

const FieldsetWrapper = ({ children, describedBy, ...attributes }) => {
  if (isEmpty(attributes)) {
    return children;
  }
  return <Fieldset describedBy={describedBy} {...attributes}>{children}</Fieldset>;
};

const FormGroup = ({
  inputId, className, label, hint, errorMessage, describedBy, fieldset, prefix,
  suffix, childrenWrapper: ChildrenWrapper = React.Fragment, children, ...attributes
}) => {
  let hintWithId;
  let errorMessageWithId;
  let labelWithId;
  const describedByElements = [];

  if (hint) {
    const hintId = inputId ? `${inputId}-hint` : '';
    describedByElements.push(hintId);

    hintWithId = typeof hint === 'string' || React.isValidElement(hint)
      ? <Hint id={hintId}>{hint}</Hint>
      : <Hint id={hintId} {...hint} />;
  }

  if (errorMessage) {
    const errorId = inputId ? `${inputId}-error` : '';
    describedByElements.push(errorId);
    errorMessageWithId = typeof errorMessage === 'string' || React.isValidElement(errorMessage)
      ? <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
      : <ErrorMessage id={errorId} {...errorMessage} />;
  }

  if (label) {
    labelWithId = typeof label === 'string' || React.isValidElement(label)
      ? <Label htmlFor={inputId}>{label}</Label>
      : <Label htmlFor={inputId} {...label} />;
  }

  if (describedBy) {
    describedByElements.push(describedBy);
  }

  if (fieldset && fieldset.describedBy) {
    describedByElements.push(fieldset.describedBy);
  }

  const computedDescribedBy = describedByElements.join(' ');

  return (
    <div className={classNames(className, 'govuk-form-group', { 'govuk-form-group--error': errorMessage })} {...attributes}>
      <FieldsetWrapper describedBy={computedDescribedBy} {...fieldset}>
        {prefix}
        {labelWithId}
        {hintWithId}
        {errorMessageWithId}

        <ChildrenWrapper>
          {typeof children === 'function'
            ? children({ formGroupDescribedBy: computedDescribedBy })
            : children}
        </ChildrenWrapper>
        {suffix}
      </FieldsetWrapper>
    </div>
  );
};

export default FormGroup;
