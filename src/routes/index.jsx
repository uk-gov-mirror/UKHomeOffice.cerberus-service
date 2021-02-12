import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../utils/keycloak';
import Layout from '../components/Layout';
import HomePage from './HomePage';
import TaskListPage from './TaskListPage';
import IssueTargetPage from './IssueTargetPage';

const AppRouter = () => {
  const keycloak = useKeycloak();

  initAll();

  if (!keycloak) {
    return null;
  }

  document.body.className = document.body.className ? `${document.body.className} js-enabled` : 'js-enabled';

  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact component={HomePage} />
        <Route path="/tasks" exact component={TaskListPage} />
        <Route path="/issue-target" exact component={IssueTargetPage} />
      </Layout>
    </BrowserRouter>
  );
};

export default AppRouter;
