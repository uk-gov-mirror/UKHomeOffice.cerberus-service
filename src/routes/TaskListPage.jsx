import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import qs from 'qs';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';

import config from '../config';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';
import Tabs from '../govuk/Tabs';
import Pagination from '../components/Pagination';
import useAxiosInstance from '../utils/axiosInstance';
import useInterval from '../utils/useInterval';
import LoadingSpinner from '../forms/LoadingSpinner';

import './__assets__/TaskListPage.scss';

const TaskListPage = () => {
  const [activePage, setActivePage] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const index = activePage - 1;
  const offset = index * itemsPerPage;
  const limit = (index + 1) * itemsPerPage;
  const axiosInstance = useAxiosInstance(config.camundaApiUrl);

  const loadTasks = async () => {
    if (axiosInstance) {
      try {
        const response = await axiosInstance.get('/variable-instance', {
          params: {
            variableName: 'taskSummary',
            deserializeValues: false,
            firstResult: offset,
            maxResults: limit,
          },
        });
        const parsedTasks = response.data.map(({ processInstanceId, value }) => ({
          processInstanceId,
          ...JSON.parse(value),
        }));
        setTasks(parsedTasks);
      } catch (e) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const { page } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const newActivePage = parseInt(page || 1, 10);
    setActivePage(newActivePage);
  }, [location.search]);

  useEffect(() => {
    if (activePage > 0) {
      const source = axios.CancelToken.source();
      loadTasks();
      return () => {
        source.cancel('Cancelling request');
      };
    }
  }, [activePage]);

  useInterval(() => {
    const source = axios.CancelToken.source();
    setLoading(true);
    loadTasks();
    return () => {
      source.cancel('Cancelling request');
    };
  }, 60000);

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

                {isLoading && <LoadingSpinner><br /><br /><br /></LoadingSpinner>}

                {tasks.map((task) => {
                  const driver = task.people.find(({ role }) => role === 'DRIVER');
                  const passengers = task.people.filter(({ role }) => role === 'PASSENGER');
                  const haulier = task.organisations.find(({ type }) => type === 'ORGHAULIER');
                  const account = task.organisations.find(({ type }) => type === 'ORGACCOUNT');

                  return (
                    <section className="task-list--item" key={task.processInstanceId}>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-three-quarters">
                          <h3 className="govuk-heading-m task-heading">
                            <Link
                              className="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold task-view"
                              to={`/tasks/${task.processInstanceId}`}
                            >{task.movementId}
                            </Link>
                          </h3>
                          <h4 className="govuk-heading-m task-sub-heading govuk-!-font-weight-regular">
                            {task.movementStatus}
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
                            {task.voyage?.description}, arrival {moment(task.arrivalTime).fromNow()}
                          </p>
                          <ul className="govuk-list arrival-dates govuk-!-margin-bottom-4">
                            <li className="govuk-!-font-weight-bold">{task.voyage?.departFrom}</li>
                            <li>{moment(task.departureTime).format(LONG_DATE_FORMAT)}</li>
                            <li className="govuk-!-font-weight-bold">{task.voyage?.arriveAt}</li>
                            <li>{moment(task.arrivalTime).format(LONG_DATE_FORMAT)}</li>
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
                            {pluralise.withCount(task.aggregateDriverTrips || '?', '% trip', '% trips')}
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
                              {task.vehicles[0].registrationNumber}
                            </span>, {task.vehicles[0].description || 'No description'},
                            {' '}
                            {pluralise.withCount(task.aggregateVehicleTrips || 0, '% trip', '% trips')}
                          </p>
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Trailer details
                          </h3>
                          <p className="govuk-body-s govuk-!-margin-bottom-1">
                            <span className="govuk-!-font-weight-bold">
                              {task.trailers[0].registrationNumber}
                            </span>, {task.trailers[0].description || 'No description'},
                            {' '}
                            {pluralise.withCount(task.aggregateTrailerTrips || 0, '% trip', '% trips')}
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
                            </span>, Booked on {moment(task.bookingDateTime).format(SHORT_DATE_FORMAT)}
                          </p>
                        </div>
                        <div className="govuk-grid-column-one-quarter">
                          <h3 className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16 govuk-!-font-weight-regular">
                            Goods details
                          </h3>
                          <p className="govuk-body-s govuk-!-font-weight-bold">
                            {task.freight.descriptionOfCargo}
                          </p>
                        </div>
                      </div>
                      <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                          <ul className="govuk-list task-labels govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                            <li className="task-labels-item">
                              <strong className="govuk-tag govuk-tag--positiveTarget">
                                {task.matchedSelectors?.[0]?.priority}
                              </strong>
                            </li>
                            <li className="task-labels-item">
                              {task.matchedSelectors?.[0]?.threatType}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>
                  );
                })}

                <Pagination
                  totalItems={tasks.length}
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
