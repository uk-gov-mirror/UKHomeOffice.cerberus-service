import React, { useContext } from 'react';

// app imports
import { useToken } from '../../reducers';


const Header = (props) => {
  return (
    <header className="govuk-header " role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__content">
          <a href="#" className="govuk-header__link govuk-header__link--homepage">
            Cerberus 
            <span style={{display: "block", fontSize: "10pt"}}>powered by the Central Operations Platform</span>
          </a>
          <nav>
            <ul id="navigation" className="govuk-header__navigation " aria-label="Top Level Navigation">
              <li className="govuk-header__navigation-item">
                <a className="govuk-header__link" onClick={props.kc.logout}>Sign out</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header> 
  );
};

export default Header;

