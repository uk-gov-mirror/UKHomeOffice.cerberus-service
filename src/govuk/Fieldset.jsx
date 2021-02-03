/**
 * React implementation of GOV.UK Design System Fieldset
 * Demo: https://design-system.service.gov.uk/components/fieldset/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/fieldset/README.md
 */

import React from 'react';
import classNames from 'classnames';

const Legend = ({
  className, isPageHeading = false, children, ...attributes
}) => (
  <legend className={classNames('govuk-fieldset__legend', className)} {...attributes}>
    {isPageHeading
      ? <h1 className="govuk-fieldset__heading">{children}</h1>
      : children}
  </legend>
);

const Fieldset = ({
  legend, children, role, className, describedBy, ...attributes
}) => {
  let renderedLegend;
  if (legend) {
    renderedLegend = typeof legend === 'string' || React.isValidElement(legend)
      ? <Legend>{legend}</Legend>
      : <Legend {...legend} />;
  }

  return (
    <fieldset
      className={classNames('govuk-fieldset', className)}
      aria-describedby={describedBy || null}
      role={role}
      {...attributes}
    >
      {renderedLegend}
      {children}
    </fieldset>
  );
};

export default Fieldset;
