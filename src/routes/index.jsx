import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../utils/keycloak';
import Layout from '../components/Layout';
import HomePage from './HomePage';
import TaskListPage from './TaskListPage';
import TaskDetailsPage from './TaskDetailsPage';
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
      <Route path="/" exact><Layout><HomePage /></Layout></Route>
      <Route path="/tasks" exact><Layout><TaskListPage /></Layout></Route>
      <Route path="/tasks/:taskId" exact>
        <Layout beforeMain={<Link className="govuk-back-link" to="/tasks">Back to task list</Link>}>
          <TaskDetailsPage />
        </Layout>
      </Route>
      <Route path="/issue-target" exact><Layout><IssueTargetPage /></Layout></Route>
    </BrowserRouter>
  );
};

export default AppRouter;
