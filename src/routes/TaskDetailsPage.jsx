import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import { get } from 'lodash';
import { Formio, Form } from 'react-formio';
import gds from '@ukhomeoffice/formio-gds-template/lib';

import config from '../config';
import { LONG_DATE_FORMAT } from '../constants';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';
import Accordion from '../govuk/Accordion';
import Button from '../govuk/Button';
import LoadingSpinner from '../forms/LoadingSpinner';
import ErrorSummary from '../govuk/ErrorSummary';
import ClaimButton from '../components/ClaimTaskButton';

import './__assets__/TaskDetailsPage.scss';

Formio.use(gds);

// See Camunda docs for all operation types: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [error, setError] = useState(null);
  const camundaClient = useAxiosInstance(config.camundaApiUrl);
  const formApiClient = useAxiosInstance(config.formApiUrl);
  const [taskVersions, setTaskVersions] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;
  const [form, setForm] = useState();
  const [isFormSubmitting, setIsFormSubmitting] = useState();
  const source = axios.CancelToken.source();

  useEffect(() => {
    const loadTask = async () => {
      if (camundaClient) {
        try {
          const taskResponse = await camundaClient.get(`/task/${taskId}`);
          const processInstanceId = taskResponse.data.processInstanceId;

          const [variableInstanceResponse, operationsHistoryResponse, taskHistoryResponse] = await Promise.all([
            camundaClient.get(
              '/variable-instance',
              { params: { processInstanceIdIn: processInstanceId, deserializeValues: false } },
            ),
            camundaClient.get(
              '/history/user-operation',
              { params: { processInstanceId, deserializeValues: false } },
            ),
            camundaClient.get(
              '/history/task',
              { params: { processInstanceId, deserializeValues: false } },
            ),
          ]);

          const parsedOperationsHistory = operationsHistoryResponse.data.map((operation) => {
            const getNote = () => {
              if ([OPERATION_TYPE_CLAIM, OPERATION_TYPE_ASSIGN].includes(operation.operationType)) {
                return operation.newValue ? 'User has claimed the task' : 'User has unclaimed the task';
              }
              return `Property ${operation.property} changed from ${operation.orgValue || 'none'} to ${operation.newValue || 'none'}`;
            };
            return {
              date: operation.timestamp,
              user: operation.userId,
              note: getNote(operation),
            };
          });
          const parsedTaskHistory = taskHistoryResponse.data.map((historyLog) => ({
            date: historyLog.startTime,
            user: historyLog.assignee,
            note: historyLog.name,
          }));
          setActivityLog([
            ...parsedOperationsHistory,
            ...parsedTaskHistory,
          ].sort((a, b) => -a.date.localeCompare(b.date)));

          const whitelistedCamundaVars = ['taskSummary', 'vehicleHistory', 'orgHistory', 'ruleHistory'];
          const parsedTaskVariables = variableInstanceResponse.data
            .filter((t) => whitelistedCamundaVars.includes(t.name))
            .reduce((acc, camundaVar) => {
              acc[camundaVar.name] = JSON.parse(camundaVar.value);
              return acc;
            }, {});
          setTaskVersions([{
            ...taskResponse.data,
            ...parsedTaskVariables,
          }]);
        } catch (e) {
          setError(e.message);
          setTaskVersions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTask();
    return () => {
      source.cancel('Cancelling request');
    };
  }, [camundaClient]);

  useEffect(() => {
    const loadForm = async () => {
      if (formApiClient) {
        try {
          const { data } = await formApiClient.get('/form/name/noteCerberus');
          setForm(data);
        } catch (e) {
          setError(e.message);
        }
      }
    };
    loadForm();
    return () => {
      source.cancel('Cancelling request');
    };
  }, [formApiClient]);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  if (taskVersions.length === 0) {
    return null;
  }

  const { assignee } = taskVersions[0];

  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned';
    }
    if (assignee === currentUser) {
      return 'Assigned to you';
    }
    return assignee;
  };

  const handleSubmitNote = async ({ data: { note } }) => {
    try {
      setIsFormSubmitting(true);
      await camundaClient.post(`/task/${taskId}/comment/create`, {
        message: note,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const renderForm = () => {
    const isTaskAssignee = taskVersions.some((task) => task.assignee === currentUser);
    if (isTaskAssignee) {
      return (
        <>
          <h2 className="govuk-heading-m">Notes</h2>
          {isFormSubmitting ? <LoadingSpinner /> : (
            <Form
              form={form}
              onSubmit={handleSubmitNote}
              options={{
                noAlerts: true,
              }}
            />
          )}
        </>
      );
    }
    return null;
  };

  return (
    <>
      {error && (
        <ErrorSummary
          title="There is a problem"
          errorList={[
            { children: error },
          ]}
        />
      )}

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <span className="govuk-caption-xl">{taskVersions[0].taskSummary?.businessKey}</span>
          <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Task details</h1>
          <p className="govuk-body">
            {getAssignee()}
            <ClaimButton assignee={assignee} taskId={taskId} setError={setError} />
          </p>
        </div>
        <div className="govuk-grid-column-two-thirds task-actions--buttons">
          <Button className="govuk-!-margin-right-1">Issue target</Button>
          <Button className="govuk-button--secondary govuk-!-margin-right-1">Assessment complete</Button>
          <Button className="govuk-button--warning">Dismiss</Button>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Accordion
            className="task-versions"
            id="task-versions"
            items={taskVersions.slice(0).reverse().map((task, index) => {
              const { taskSummary } = task;
              const versionNumber = taskVersions.length - index;
              const vehicle = get(task, 'vehicleHistory[0][0]vehicle', {});
              const trailer = get(taskSummary, 'trailers[0]', {});
              const account = taskSummary?.organisations.find(({ type }) => type === 'ORGACCOUNT') || {};
              const haulier = taskSummary?.organisations.find(({ type }) => type === 'ORGHAULIER') || {};
              const driver = taskSummary?.people.find(({ role }) => role === 'DRIVER') || {};
              const passengers = taskSummary?.people.filter(({ role }) => role === 'PASSENGER') || [];
              const freight = taskSummary?.freight;
              const consignee = taskSummary?.consignee;
              const consignor = taskSummary?.consignor;
              const matchedRules = get(task, 'ruleHistory[0]', []);
              return (
                {
                  heading: `Version ${versionNumber}`,
                  summary: (
                    <>
                      <div className="task-versions--left">
                        <div className="govuk-caption-m">{moment(task.bookingDateTime).format(LONG_DATE_FORMAT)}</div>
                      </div>
                      <div className="task-versions--right">
                        <ul className="govuk-list">
                          <li>{pluralise.withCount(0, '% change', '% changes', 'No changes')} in this version</li>
                          <li>Highest threat level is <strong className="govuk-tag govuk-tag--red">{taskSummary?.matchedSelectors[0].priority}</strong> from version {versionNumber}</li>
                        </ul>
                      </div>
                    </>
                  ),
                  children: (
                    <>
                      <h2 className="govuk-heading-m">Vehicle details</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Registration number</dt>
                          <dd className="govuk-summary-list__value">{vehicle.registrationNumber}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Type</dt>
                          <dd className="govuk-summary-list__value">{vehicle.type}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Make</dt>
                          <dd className="govuk-summary-list__value">{vehicle.make}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Model</dt>
                          <dd className="govuk-summary-list__value">{vehicle.model}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Country of registration</dt>
                          <dd className="govuk-summary-list__value">{vehicle.registrationCountry}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Trailer registration number</dt>
                          <dd className="govuk-summary-list__value">{trailer.registrationNumber}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Trailer type</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Trailer country of registration</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Empty or loaded</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Trailer length</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Trailer height</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Account details</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Full name</dt>
                          <dd className="govuk-summary-list__value">{account.name}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Short name</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Reference number</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Address</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Telephone</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Mobile</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Email</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Haulier details</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Name</dt>
                          <dd className="govuk-summary-list__value">{haulier.name}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Address</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Telephone</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Mobile</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Driver</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Name</dt>
                          <dd className="govuk-summary-list__value">{driver.name}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Date of birth</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Gender</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Nationality</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Travel document type</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Travel document number</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Travel document expiry</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      {passengers.length > 0 && <h2 className="govuk-heading-m">Passengers</h2>}

                      {passengers.map((passenger) => (
                        <dl key={passenger.name} className="govuk-summary-list govuk-!-margin-bottom-9">
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Name</dt>
                            <dd className="govuk-summary-list__value">{passenger.name}</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Date of birth</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Gender</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Nationality</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Travel document type</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Travel document number</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Travel document expiry</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                        </dl>
                      ))}

                      <h2 className="govuk-heading-m">Goods</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Description of goods</dt>
                          <dd className="govuk-summary-list__value">{freight?.descriptionOfCargo}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Is cargo hazardous?</dt>
                          <dd className="govuk-summary-list__value">{freight?.hazardousCargo === 'true' ? 'Yes' : 'No'}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Weight of goods</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Booking</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Reference</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Ticket number</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Type</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Name</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Address</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Date and time</dt>
                          <dd className="govuk-summary-list__value">{moment(taskSummary?.bookingDateTime).format(LONG_DATE_FORMAT)}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Country</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Payment method</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Ticket price</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Ticket type</dt>
                          <dd className="govuk-summary-list__value">TODO</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Consignee details</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Name</dt>
                          <dd className="govuk-summary-list__value">{consignee?.name}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Address</dt>
                          <dd className="govuk-summary-list__value">{consignee?.address}</dd>
                        </div>
                      </dl>

                      <h2 className="govuk-heading-m">Consignor details</h2>

                      <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Name</dt>
                          <dd className="govuk-summary-list__value">{consignor?.name}</dd>
                        </div>
                        <div className="govuk-summary-list__row">
                          <dt className="govuk-summary-list__key">Address</dt>
                          <dd className="govuk-summary-list__value">{consignor?.address}</dd>
                        </div>
                      </dl>

                      {matchedRules.length > 0 && <h2 className="govuk-heading-m">Rules matched</h2>}

                      {matchedRules.map((rule) => (
                        <dl key={rule.ruleName} className="govuk-summary-list govuk-!-margin-bottom-9">
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Name</dt>
                            <dd className="govuk-summary-list__value">{rule.ruleName}</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Category</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Version</dt>
                            <dd className="govuk-summary-list__value">{rule.ruleVersion}</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Abuse type</dt>
                            <dd className="govuk-summary-list__value">{rule.abuseType}</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Agency</dt>
                            <dd className="govuk-summary-list__value">TODO</dd>
                          </div>
                          <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Description</dt>
                            <dd className="govuk-summary-list__value">{rule.ruleDescription}</dd>
                          </div>
                        </dl>
                      ))}

                      <h2 className="govuk-heading-m">Risk factors</h2>
                      <p>TODO</p>
                    </>
                  ),
                }
              );
            })}
          />
        </div>
        <div className="govuk-grid-column-one-third">

          {renderForm()}

          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

          <h3 className="govuk-heading-m">Activity</h3>

          {activityLog.map((activity) => (
            <React.Fragment key={activity.date}>
              <p className="govuk-body-s govuk-!-margin-bottom-2">
                <span className="govuk-!-font-weight-bold">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.date).toLocaleTimeString()}</span>
                {activity.user && <>&nbsp;by <a href={`mailto:${activity.user}`}>{activity.user}</a></>}
              </p>
              <p className="govuk-body">{activity.note}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
