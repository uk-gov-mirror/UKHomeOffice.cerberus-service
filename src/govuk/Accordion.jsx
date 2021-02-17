/**
 * React implementation of GOV.UK Design System Accordion
 * Demo: https://design-system.service.gov.uk/components/accordion/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/accordion/README.md
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';
import AccordionJS from 'govuk-frontend/govuk/components/accordion/accordion';

const Accordion = ({
  id, className, items = [], headingLevel = 2, ...attributes
}) => {
  const accordionRef = React.createRef();
  const Heading = `h${headingLevel}`;

  if (items.length === 0) {
    return null;
  }

  useEffect(() => {
    new AccordionJS(accordionRef.current).init();
  }, []);

  return (
    <div className={classNames('govuk-accordion', className)} data-module="govuk-accordion" id={id} {...attributes} ref={accordionRef}>
      {items.map((item, index) => (
        <div key={item.reactListKey || index} className={classNames('govuk-accordion__section', { 'govuk-accordion__section--expanded': item.expanded })}>
          <div className="govuk-accordion__section-header">
            <Heading className="govuk-accordion__section-heading">
              <span className="govuk-accordion__section-button" id={`${id}-heading-${index + 1}`}>
                {item.heading}
              </span>
            </Heading>
            {item.summary && (
              <div className="govuk-accordion__section-summary govuk-body" id={`${id}-summary-${index + 1}`}>
                {item.summary}
              </div>
            )}
          </div>
          <div id={`${id}-content-${index + 1}`} className="govuk-accordion__section-content" aria-labelledby={`${id}-heading-${index + 1}`}>
            {item.children}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
