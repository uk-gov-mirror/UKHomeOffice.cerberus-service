import React from 'react';
import { Link } from 'react-router-dom';

import { useKeycloak } from '../../utils/keycloak';
import NavigationItem from '../NavigationItem';

const Header = () => {
  const { createLogoutUrl } = useKeycloak();
  return (
    <header className="govuk-header " role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__content">
          <Link to="/" className="govuk-header__link govuk-header__link--homepage">
            Cerberus
            <span style={{display: "block", fontSize: "10pt"}}>powered by the Central Operations Platform</span>
          </Link>
          <nav>
            <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
              <NavigationItem href="/issue-target">Issue a target</NavigationItem>
              <NavigationItem href={createLogoutUrl()}>Sign out</NavigationItem>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
};

export default Header;
