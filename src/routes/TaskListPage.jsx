import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import qs from 'qs';

import Tabs from '../govuk/Tabs';
import taskFixtures from './__fixtures__/tasks';
import Pagination from '../components/Pagination';

const TaskListPage = () => {
  const [activePage, setActivePage] = useState(0);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(taskFixtures.length / itemsPerPage);

  useEffect(() => {
    const { page } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const newActivePage = parseInt(page || 1, 10);
    setActivePage(newActivePage);
  }, [location.search]);

  useEffect(() => {
    if (activePage > 0) {
      const index = activePage - 1;
      const offset = index * itemsPerPage;
      const limit = (index + 1) * itemsPerPage;
      setTasks(taskFixtures.slice(offset, limit));
    }
  }, [activePage]);

  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>

      <Tabs
        title="Title"
        id="tasks"
        items={[
          {
            id: 'new',
            label: 'New',
            panel: (
              <>
                <Pagination
                  totalItems={taskFixtures.length}
                  itemsPerPage={itemsPerPage}
                  activePage={activePage}
                  totalPages={totalPages}
                />
                {tasks.map((task) => (
                  <p className="govuk-body" key={task.id}><Link to={`/tasks/${task.id}`}>{task.title}</Link></p>
                ))}
              </>
            ),
          },
          { id: 'in-progress', label: 'In progress', panel: <p className="govuk-body-l">No tasks available</p> },
          { id: 'paused', label: 'Paused', panel: <p className="govuk-body-l">No tasks available</p> },
          { id: 'complete', label: 'Complete', panel: <p className="govuk-body-l">No tasks available</p> },
        ]}
      />
    </>
  );
};

export default TaskListPage;
