import React from 'react';
import Header from './Header';

const Layout = ({ beforeMain, children }) => (
  <>
    <Header />

    <div className="govuk-width-container">
      {beforeMain}

      <main className="govuk-main-wrapper" id="main-content" role="main">
        {children}
      </main>
    </div>

    <footer className="govuk-footer " role="contentinfo">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta">
          <div
            className="govuk-footer__meta-item govuk-footer__meta-item--grow"
          />
          <div className="govuk-footer__meta-item">
            <a
              className="govuk-footer__link govuk-footer__copyright-logo"
              href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
            >
              © Crown copyright
            </a>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Layout;
