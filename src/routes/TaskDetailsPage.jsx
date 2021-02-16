import React from 'react';
import { useParams } from 'react-router-dom';

import tasks from './__fixtures__/tasks';
import Tabs from '../govuk/Tabs';
import Accordion from '../govuk/Accordion';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const task = tasks.find(({ id }) => id === taskId);
  return (
    <>
      <h1 className="govuk-heading-xl">Task details</h1>

      <Tabs
        title="Details"
        id="task-details"
        items={[
          {
            id: 'details',
            label: 'Details',
            panel: (
              <Accordion
                id="task-versions"
                items={task.versions.slice(0).reverse().map((taskVersion, index) => ({
                  heading: `Version ${task.versions.length - index}`,
                  summary: (
                    <div className="govuk-caption-m">{taskVersion.date}</div>
                  ),
                  children: (
                    <>
                      <h3 className="govuk-heading-s govuk-!-margin-0">Description</h3>
                      <p className="govuk-body">{taskVersion.description}</p>
                    </>
                  ),
                }))}
              />
            ),
          },
          { id: 'actions', label: 'Actions', panel: '' },
        ]}
      />
    </>
  );
};

export default TaskDetailsPage;
