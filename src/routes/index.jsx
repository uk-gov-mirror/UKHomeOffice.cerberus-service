import React from 'react';
import { BrowserRouter, Link, Redirect, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../utils/keycloak';
import Layout from '../components/Layout';
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
      <Route path="/" exact><Redirect to="/tasks" /></Route>
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
