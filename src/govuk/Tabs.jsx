/**
 * React implementation of GOV.UK Design System Tabs
 * Demo: https://design-system.service.gov.uk/components/tabs/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/tabs/README.md
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';
import TabsJS from 'govuk-frontend/govuk/components/tabs/tabs';

const Tabs = ({
  id, idPrefix, className, title, items, ...attributes
}) => {
  const tabsRef = React.createRef();

  useEffect(() => {
    new TabsJS(tabsRef.current).init();
  }, []);

  return (
    <div
      id={id}
      className={classNames('govuk-tabs', className)}
      {...attributes}
      data-module="govuk-tabs"
      ref={tabsRef}
    >
      {title && <h2 className="govuk-tabs__title">{title}</h2>}

      {items.length > 0 && (
        <>
          <ul className="govuk-tabs__list">
            {items.map((item, index) => {
              const itemId = item.id || `${idPrefix}-${index}`;
              return (
                <li
                  key={item.id}
                  className={classNames('govuk-tabs__list-item', { 'govuk-tabs__list-item--selected': index === 0 })}
                >
                  <a className="govuk-tabs__tab" href={`#${itemId}`} {...item.attributes}>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {items.map((item, index) => {
            const itemId = item.id || `${idPrefix}-${index}`;
            const panelIsReactElement = typeof item.panel === 'string' || Array.isArray(item.panel) || React.isValidElement(item.panel);
            const panelAttributes = panelIsReactElement ? {} : item.panel.attributes;
            const panelContents = panelIsReactElement ? item.panel : item.panel.children;
            return (
              <div
                key={itemId}
                className={`govuk-tabs__panel${index > 0 ? ' govuk-tabs__panel--hidden' : ''}`}
                id={itemId}
                {...panelAttributes}
              >
                {panelContents}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Tabs;
