import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationItem = ({ href, children }) => {
  const location = useLocation();
  const className = location.pathname === href
    ? 'govuk-header__navigation-item govuk-header__navigation-item--active'
    : 'govuk-header__navigation-item';

  return (
    <li className={className}>
      {/^https?:\/\//.test(href)
        ? <a href={href} className="govuk-header__link">{children}</a>
        : <Link to={href} className="govuk-header__link">{children}</Link>}
    </li>
  );
};

export default NavigationItem;
