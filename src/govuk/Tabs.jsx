/**
 * React implementation of GOV.UK Design System Tabs
 * Demo: https://design-system.service.gov.uk/components/tabs/
 * Code: https://github.com/alphagov/govuk-frontend/blob/master/package/govuk/components/tabs/README.md
 */

import React, { useState } from 'react';
import classNames from 'classnames';

const Tabs = ({
  id, idPrefix, className, title, items, onTabClick, ...attributes
}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const currentTab = items[currentTabIndex];
  const currentTabId = currentTab.id || `${idPrefix}-${currentTabIndex}`;
  const panelIsReactElement = typeof currentTab.panel === 'string' || Array.isArray(currentTab.panel) || React.isValidElement(currentTab.panel);
  const panelAttributes = panelIsReactElement ? {} : currentTab.panel.attributes;
  const panelContents = panelIsReactElement ? currentTab.panel : currentTab.panel.children;

  return (
    <div
      id={id}
      className={classNames('govuk-tabs', className)}
      {...attributes}
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
                  className={classNames('govuk-tabs__list-item', { 'govuk-tabs__list-item--selected': index === currentTabIndex })}
                >
                  <a
                    className="govuk-tabs__tab"
                    onClick={(e) => {
                      setCurrentTabIndex(index);
                      e.preventDefault();
                      if (onTabClick) {
                        onTabClick(item, index);
                      }
                    }}
                    href={`#${itemId}`}
                    {...item.attributes}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div
            key={currentTabId}
            className="govuk-tabs__panel"
            id={currentTabId}
            {...panelAttributes}
          >
            {panelContents}
          </div>
        </>
      )}
    </div>
  );
};

export default Tabs;
