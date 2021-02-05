/**
 * React implementation of GOV.UK Design System Details
 * Demo: https://design-system.service.gov.uk/components/details/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/details/README.md
 */

import React from 'react';
import classNames from 'classnames';

function Details({
  open, className, summary, children, ...attributes
}) {
  return (
    <details className={classNames('govuk-details', className)} open={open} data-module="govuk-details" {...attributes}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">
          {summary}
        </span>
      </summary>
      <div className="govuk-details__text">
        {children}
      </div>
    </details>

  );
}

export default Details;
