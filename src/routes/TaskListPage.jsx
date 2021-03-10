import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import qs from 'qs';
import moment from 'moment';
import * as pluralise from 'pluralise';

import Tabs from '../govuk/Tabs';
import taskFixtures from './__fixtures__/tasks';
import Pagination from '../components/Pagination';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';

import './__assets__/TaskListPage.scss';

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
                <h1 className="govuk-heading-l">New tasks</h1>

                {tasks.map((task) => {
                  const newestVersion = task.versions[task.versions.length - 1];
                  const driver = newestVersion.people.find(({ role }) => role === 'DRIVER');
                  const passengers = newestVersion.people.filter(({ role }) => role === 'PASSENGER');
                  const haulier = newestVersion.organisations.find(({ type }) => type === 'ORGHAULIER');
                  const account = newestVersion.organisations.find(({ type }) => type === 'ORGACCOUNT');

                  return (
                    <section className="task-list--item" key={task.movementId}>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-three-quarters">
                          <h3 className="govuk-heading-m task-heading">
                            <Link
                              className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold task-view"
                              to={`/tasks/${task.movementId}`}
                            >{task.movementId}
                            </Link>
                          </h3>
                          <h4 className="govuk-heading-m task-sub-heading govuk-!-font-weight-regular">
                            {newestVersion.movementStatus}
                          </h4>
                        </div>
                        <div className="govuk-grid-column-one-quarter">
                          <a href="#claim" className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-19 task-view">
                            Claim task
                          </a>
                        </div>
                      </div>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                          <p className="govuk-body-s arrival-title">
                            {newestVersion.voyage?.description}, arrival {moment(newestVersion.arrivalTime).fromNow()}
                          </p>
                          <ul className="govuk-list arrival-dates govuk-!-margin-bottom-4">
                            <li className="govuk-!-font-weight-bold">{newestVersion.voyage?.departFrom}</li>
                            <li>{moment(newestVersion.departureTime).format(LONG_DATE_FORMAT)}</li>
                            <li className="govuk-!-font-weight-bold">{newestVersion.voyage?.arriveAt}</li>
                            <li>{moment(newestVersion.arrivalTime).format(LONG_DATE_FORMAT)}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-quarter">
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Driver details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1">
                            <span className="govuk-!-font-weight-bold">
                              {driver?.fullName}
                            </span>, DOB: {moment(driver?.dateOfBirth).format(SHORT_DATE_FORMAT)},
                            {' '}
                            {pluralise.withCount(newestVersion.aggregateDriverTrips, '% trip', '% trips')}
                          </p>
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Passenger details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1 govuk-!-font-weight-bold">
                            {pluralise.withCount(passengers.length, '% passenger', '% passengers')}
                          </p>
                        </div>
                        <div className="govuk-grid-column-one-quarter">
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Vehicle details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1">
                            <span className="govuk-!-font-weight-bold">
                              {newestVersion.vehicles[0].registrationNumber}
                            </span>, {newestVersion.vehicles[0].description},
                            {' '}
                            {pluralise.withCount(newestVersion.aggregateVehicleTrips, '% trip', '% trips')}
                          </p>
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Trailer details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1">
                            <span className="govuk-!-font-weight-bold">
                              {newestVersion.trailers[0].registrationNumber}
                            </span>, {newestVersion.trailers[0].description},
                            {' '}
                            {pluralise.withCount(newestVersion.aggregateTrailerTrips, '% trip', '% trips')}
                          </p>
                        </div>
                        <div className="govuk-grid-column-one-quarter">
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Haulier details
                          </h3>
                          <p className="govuk-body-s govuk-!-font-weight-bold govuk-!-margin-bottom-1">
                            {haulier.name}
                          </p>
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Account details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1">
                            <span className="govuk-!-font-weight-bold">
                              {account.name}
                            </span>, Booked on {moment(newestVersion.bookingDateTime).format(SHORT_DATE_FORMAT)}
                          </p>
                        </div>
                        <div className="govuk-grid-column-one-quarter">
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Goods details
                          </h3>
                          <p className="govuk-body-s govuk-!-font-weight-bold">
                            {newestVersion.freight.descriptionOfCargo}
                          </p>
                        </div>
                      </div>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                          <ul className="govuk-list task-labels govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                            <li className="task-labels-item">
                              <strong className="govuk-tag govuk-tag--positiveTarget">
                                {newestVersion.matchedSelectors?.[0]?.priority}
                              </strong>
                            </li>
                            <li className="task-labels-item">
                              {newestVersion.matchedSelectors?.[0]?.threatType}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>
                  );
                })}

                <Pagination
                  totalItems={taskFixtures.length}
                  itemsPerPage={itemsPerPage}
                  activePage={activePage}
                  totalPages={totalPages}
                />
              </>
            ),
          },
          {
            id: 'in-progress',
            label: 'In progress',
            panel: (
              <>
                <h1 className="govuk-heading-l">In progress tasks</h1>
                <p className="govuk-body-l">No tasks available</p>
              </>
            ),
          },
          {
            id: 'complete',
            label: 'Complete',
            panel: (
              <>
                <h1 className="govuk-heading-l">Completed tasks</h1>
                <p className="govuk-body-l">No tasks available</p>
              </>
            ),
          },
        ]}
      />
    </>
  );
};

export default TaskListPage;
