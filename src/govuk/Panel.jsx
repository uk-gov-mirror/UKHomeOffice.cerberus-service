/**
 * React implementation of GOV.UK Design System Panel
 * Demo: https://design-system.service.gov.uk/components/panel/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/panel/README.md
 */

import React from 'react';
import classNames from 'classnames';

const Panel = ({
  className, headingLevel = 1, title, children, ...attributes
}) => {
  const Title = `h${headingLevel}`;

  return (
    <div className={classNames(className, 'govuk-panel', 'govuk-panel--confirmation')} {...attributes}>
      <Title className="govuk-panel__title">{title}</Title>
      {children && <div className="govuk-panel__body">{children}</div>}
    </div>
  );
};

export default Panel;
