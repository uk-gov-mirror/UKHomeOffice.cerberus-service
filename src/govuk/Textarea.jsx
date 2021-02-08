/**
 * React implementation of GOV.UK Design System Textarea
 * Demo: https://design-system.service.gov.uk/components/textarea/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/textarea/README.md
 */

import React from 'react';
import classNames from 'classnames';
import FormGroup from './FormGroup';

const Textarea = ({
  id, className, defaultValue, label, hint, errorMessage, formGroup = {}, describedBy, ...attributes
}) => (
  <FormGroup inputId={id} hint={hint} label={label} errorMessage={errorMessage} describedBy={describedBy} {...formGroup}>
    {({ formGroupDescribedBy }) => (
      <textarea
        className={classNames(className, 'govuk-textarea', { 'govuk-textarea--error': errorMessage })}
        id={id}
        defaultValue={defaultValue}
        aria-describedby={formGroupDescribedBy}
        rows={5}
        {...attributes}
      />
    )}
  </FormGroup>
);

export default Textarea;
