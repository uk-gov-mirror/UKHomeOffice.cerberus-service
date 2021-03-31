import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import { get } from 'lodash';

import config from '../config';
import { LONG_DATE_FORMAT } from '../constants';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';
import Accordion from '../govuk/Accordion';
import Button from '../govuk/Button';
import LoadingSpinner from '../forms/LoadingSpinner';
import ErrorSummary from '../govuk/ErrorSummary';
import LinkButton from '../govuk/LinkButton';

import './__assets__/TaskDetailsPage.scss';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [error, setError] = useState(null);
  const camundaClient = useAxiosInstance(config.camundaApiUrl);
  const [taskVersions, setTaskVersions] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isAssignmentInProgress, setAssignmentProgress] = useState(false);
  const keycloak = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;
  const history = useHistory();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadTask = async () => {
      if (camundaClient) {
        try {
          const taskResponse = await camundaClient.get(`/task/${taskId}`);
          const variableInstanceResponse = await camundaClient.post('/variable-instance', {
            processInstanceIdIn: [taskResponse.data.processInstanceId],
          }, {
            params: {
              deserializeValues: false,
            },
          });

          const whitelistedCamundaVars = ['taskSummary', 'vehicleHistory', 'orgHistory', 'ruleHistory'];
          const parsedTask = variableInstanceResponse.data
            .filter((t) => whitelistedCamundaVars.includes(t.name))
            .reduce((acc, camundaVar) => {
              acc[camundaVar.name] = JSON.parse(camundaVar.value);
              return acc;
            }, {});
          setTaskVersions([{
            ...taskResponse.data,
            ...parsedTask,
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

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  if (taskVersions.length === 0) {
    return null;
  }

  const { assignee } = taskVersions[0];

  const handleClaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/claim`, {
        userId: currentUser,
      });
      history.go(0);
    } catch (e) {
      setError(e.message);
      setAssignmentProgress(false);
    }
  };

  const handleUnclaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/unclaim`, {
        userId: currentUser,
      });
      history.go(0);
    } catch (e) {
      setError(e.message);
      setAssignmentProgress(false);
    }
  };

  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned';
    }
    if (assignee === currentUser) {
      return 'Assigned to you';
    }
    return assignee;
  };

  const ClaimButton = (props) => (
    <span className="govuk-!-margin-left-3">
      {isAssignmentInProgress ? 'Please wait...' : (
        <LinkButton
          type="button"
          {...props}
        />
      )}
    </span>
  );

  const getClaimButton = () => {
    if (assignee === null || assignee !== currentUser) {
      return (
        <ClaimButton onClick={handleClaim}>Claim</ClaimButton>
      );
    }
    return (
      <ClaimButton onClick={handleUnclaim}>Unclaim</ClaimButton>
    );
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
            {getClaimButton()}
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
          <h2 className="govuk-heading-m">Notes</h2>

          <p>TODO</p>

          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

          <h3 className="govuk-heading-m">Activity</h3>

          <p>TODO</p>

          {[].map((activity) => (
            <>
              <p className="govuk-body-s govuk-!-margin-bottom-2">
                <span className="govuk-!-font-weight-bold">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
                &nbsp;at <span className="govuk-!-font-weight-bold">{new Date(activity.date).toLocaleTimeString()}</span>
                &nbsp;by <a href={`mailto:${activity.by}`}>{activity.by}</a>
              </p>
              <p className="govuk-body">{activity.note}</p>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskDetailsPage;
