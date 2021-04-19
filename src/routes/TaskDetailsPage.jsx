import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import * as pluralise from 'pluralise';
import axios from 'axios';
import { get } from 'lodash';

import config from '../config';
import { LONG_DATE_FORMAT, SHORT_DATE_FORMAT } from '../constants';
import { useKeycloak } from '../utils/keycloak';
import useAxiosInstance from '../utils/axiosInstance';
import Accordion from '../govuk/Accordion';
import Button from '../govuk/Button';
import LoadingSpinner from '../forms/LoadingSpinner';
import ErrorSummary from '../govuk/ErrorSummary';
import ClaimButton from '../components/ClaimTaskButton';
import RenderForm from '../components/RenderForm';

import './__assets__/TaskDetailsPage.scss';
import Panel from '../govuk/Panel';

// See Camunda docs for all operation types: https://docs.camunda.org/javadoc/camunda-bpm-platform/7.7/org/camunda/bpm/engine/history/UserOperationLogEntry.html
const OPERATION_TYPE_CLAIM = 'Claim';
const OPERATION_TYPE_ASSIGN = 'Assign';

const TaskVersions = ({ taskVersions }) => (
  <Accordion
    className="task-versions"
    id="task-versions"
    items={taskVersions.slice(0).reverse().map((task, index) => {
      const poleIdsAvailable = (id, idFlag) => {
        return id
          .split(':')
          .slice(1)
          .join('')
          .split(',')
          .filter((v) => v.includes(`${idFlag}=`));
      };
      const findMatchingPoleIds = (id1, id2, flag) => {
        if (!id1 || !id2) {
          return null;
        }
        const tmp = poleIdsAvailable(id2, flag);
        return poleIdsAvailable(id1, flag).some((ele) => tmp.includes(ele));
      };
      /*
       * If 'path' specified is found, the 'get' returns the 'type' from the 'obj'
       * This is used to compare against the value of 'type'
       * e.g. 'LOCTEL' === 'TEST-TYPE'
       * If not found the 'get' returns the default value
       * This is used when no comparison is required in the first part of the conditon
       * and the comparison will always return true
       * e.g. 'default-value' === 'default-value'
      */
      const objectLookup = (arr, compId, flag, path = null, type = 'default-value') => (
        arr.find((obj) => (
          get(obj, path, 'default-value') === type
          && findMatchingPoleIds(
            obj.party.poleId.v2.id,
            compId,
            flag,
          )
        ))
      );
      // placeholder until all tasks in task list have 'version' property
      const versionIndex = taskVersions.length - index - 1;
      const versionNumber = taskVersions.length - index;
      const { taskSummary } = task;
      const orgAccount = task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGACCOUNT') || {};
      const orgHaulier = task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGHAULIER') || {};
      const personDriver = task?.personHistory[versionIndex].find(({ attributes: { attrs: { role } } }) => role === 'DRIVER') || {};
      const personPassengers = task?.personHistory[versionIndex].filter(({ attributes: { attrs: { role } } }) => role === 'PASSENGER') || [];
      const account = {
        fullName: orgAccount?.organisation.name,
        shortName: orgAccount?.attributes.attrs.shortName,
        referenceNumber: orgAccount?.organisation.registrationNumber,
        fullAddress: objectLookup(
          task?.addressHistory[versionIndex],
          orgAccount.metadata.identityRecord.poleId.v2.id,
          'P',
        )?.address.fullAddress,
        telephone: objectLookup(
          task?.contactHistory[versionIndex],
          orgAccount.metadata?.identityRecord.poleId.v2.id,
          'P',
          'contact.type',
          'LOCTEL',
        )?.contact.value,
        mobile: objectLookup(
          task?.contactHistory[versionIndex],
          orgAccount.metadata?.identityRecord.poleId.v2.id,
          'P',
          'contact.type',
          'LOCTELMOB',
        )?.contact.value,
      };
      const haulier = {
        name: orgHaulier.organisation?.name,
        fullAddress: objectLookup(
          task?.addressHistory[versionIndex],
          orgHaulier.metadata?.identityRecord.poleId.v2.id,
          'P',
        )?.address.fullAddress,
        telephone: objectLookup(
          task?.contactHistory[versionIndex],
          orgHaulier.metadata?.identityRecord.poleId.v2.id,
          'P',
          'contact.type',
          'LOCTEL',
        )?.contact.value,
        mobile: objectLookup(
          task?.contactHistory[versionIndex],
          orgHaulier.metadata?.identityRecord.poleId.v2.id,
          'P',
          'contact.type',
          'LOCTELMOB',
        )?.contact.value,
      };
      const driver = {
        ...personDriver,
        driverDocument: {
          ...objectLookup(
            task.documentHistory[versionIndex],
            personDriver.metadata?.identityRecord.poleId.v2.id,
            'P',
          ),
        },
      };
      const passengers = personPassengers.map((passenger) => {
        passenger.passengerDocument = {
          ...objectLookup(
            task.documentHistory[versionIndex],
            passenger.metadata?.identityRecord.poleId.v2.id,
            'P',
          ) || {},
        };
      });
      const vehicle = task?.vehicleHistory[versionIndex].find((v) => v.vehicle.type === 'OBJVEHC') || {};
      const trailer = task?.vehicleHistory[versionIndex].find((v) => v.vehicle.type === 'OBJVEHCTRL') || {};
      const goods = task?.serviceMovementHistory[versionIndex];
      const booking = task?.orgHistory[versionIndex].find(({ organisation: { type } }) => type === 'ORGBOOKER') || {};
      const matchedRules = task?.ruleHistory[versionIndex] || [];
      const riskIndicators = task?.selectorHistory[versionIndex] || [];
      const consignee = taskSummary?.consignee;
      const consignor = taskSummary?.consignor;

      const isCargoHazardous = (boolAsString = null) => {
        if (!boolAsString) {
          return '';
        }
        if (boolAsString === 'false') {
          return 'No';
        }
        return 'Yes';
      };

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
                  <li>Highest threat level is <strong className="govuk-tag govuk-tag--red">{taskSummary?.matchedSelectors[versionIndex].priority}</strong> from version {versionNumber}</li>
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
                  <dd className="govuk-summary-list__value">{vehicle.vehicle.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Type</dt>
                  <dd className="govuk-summary-list__value">{vehicle.attributes?.attrs?.type}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Make</dt>
                  <dd className="govuk-summary-list__value">{vehicle.vehicle.make}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Model</dt>
                  <dd className="govuk-summary-list__value">{vehicle.vehicle.model}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Country of registration</dt>
                  <dd className="govuk-summary-list__value">{vehicle.vehicle.registrationCountry}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer registration number</dt>
                  <dd className="govuk-summary-list__value">{trailer.vehicle?.registrationNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer type</dt>
                  <dd className="govuk-summary-list__value">{trailer.attributes?.attrs?.type}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer country of registration</dt>
                  <dd className="govuk-summary-list__value">{trailer.vehicle?.registrationCountry}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Empty or loaded</dt>
                  <dd className="govuk-summary-list__value">{trailer.attributes?.attrs?.statusOfLoading}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer length</dt>
                  <dd className="govuk-summary-list__value">{trailer.attributes?.attrs?.length}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Trailer height</dt>
                  <dd className="govuk-summary-list__value">{trailer.attributes?.attrs?.height}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Account details</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Full name</dt>
                  <dd className="govuk-summary-list__value">{account.fullName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Short name</dt>
                  <dd className="govuk-summary-list__value">{account.shortName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Reference number</dt>
                  <dd className="govuk-summary-list__value">{account.referenceNumber}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Address</dt>
                  <dd className="govuk-summary-list__value">{account.fullAddress}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">{account.telephone}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">{account.mobile}</dd>
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
                  <dd className="govuk-summary-list__value">{haulier.fullAddress}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Telephone</dt>
                  <dd className="govuk-summary-list__value">{haulier.telephone}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Mobile</dt>
                  <dd className="govuk-summary-list__value">{haulier.mobile}</dd>
                </div>
              </dl>

              <h2 className="govuk-heading-m">Driver</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Name</dt>
                  <dd className="govuk-summary-list__value">{driver.person?.fullName}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Date of birth</dt>
                  <dd className="govuk-summary-list__value">{moment(driver.person?.dateOfBirth).format(SHORT_DATE_FORMAT)}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Gender</dt>
                  <dd className="govuk-summary-list__value">{driver.person?.gender}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Nationality</dt>
                  <dd className="govuk-summary-list__value">{driver.person?.nationality}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document type</dt>
                  <dd className="govuk-summary-list__value">{driver.driverDocument?.attributes?.attrs?.documentType}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document number</dt>
                  <dd className="govuk-summary-list__value">{driver.driverDocument?.document?.value}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Travel document expiry</dt>
                  <dd className="govuk-summary-list__value">{moment(driver.driverDocument?.document?.expiryDate).format(SHORT_DATE_FORMAT)}</dd>
                </div>
              </dl>

              {passengers.length > 0 && <h2 className="govuk-heading-m">Passengers</h2>}

              {passengers.map((passenger) => (
                <dl key={passenger?.person.fullName} className="govuk-summary-list govuk-!-margin-bottom-9">
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Name</dt>
                    <dd className="govuk-summary-list__value">{passenger.person?.fullName}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Date of birth</dt>
                    <dd className="govuk-summary-list__value">{moment(passenger.person?.dateOfBirth).format(SHORT_DATE_FORMAT)}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Gender</dt>
                    <dd className="govuk-summary-list__value">{passenger.person?.gender}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Nationality</dt>
                    <dd className="govuk-summary-list__value">{passenger.person?.nationality}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document type</dt>
                    <dd className="govuk-summary-list__value">{passenger.passengerDocument?.attributes?.attrs?.documentType}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document number</dt>
                    <dd className="govuk-summary-list__value">{passenger.passengerDocument?.document?.value}</dd>
                  </div>
                  <div className="govuk-summary-list__row">
                    <dt className="govuk-summary-list__key">Travel document expiry</dt>
                    <dd className="govuk-summary-list__value">{moment(passenger.passengerDocument?.document?.expiryDate).format(SHORT_DATE_FORMAT)}</dd>
                  </div>
                </dl>
              ))}

              <h2 className="govuk-heading-m">Goods</h2>

              <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Description of goods</dt>
                  <dd className="govuk-summary-list__value">{goods.attributes?.attrs?.descriptionOfCargo}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Is cargo hazardous?</dt>
                  <dd className="govuk-summary-list__value">{isCargoHazardous(goods.attributes?.attrs?.hazardousCargo)}</dd>
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
                  <dd className="govuk-summary-list__value">{booking.attributes?.attrs?.reference}</dd>
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
                  <dd className="govuk-summary-list__value">{booking.attributes?.attrs?.countryOfBooking}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Payment method</dt>
                  <dd className="govuk-summary-list__value">{booking.attributes?.attrs?.paymentMethod}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket price</dt>
                  <dd className="govuk-summary-list__value">TODO</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Ticket type</dt>
                  <dd className="govuk-summary-list__value">{booking.attributes?.attrs?.ticketType}</dd>
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

              {riskIndicators.length
                && (
                  <table className="govuk-table">
                    <caption className="govuk-table__caption govuk-table__caption--m">Risk indicators ({riskIndicators.length})</caption>
                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">Type</th>
                        <th scope="col" className="govuk-table__header">Condition 1</th>
                        <th scope="col" className="govuk-table__header">Expression</th>
                        <th scope="col" className="govuk-table__header">Condition 2</th>
                      </tr>
                    </thead>
                    <tbody className="govuk-table__body">
                      {riskIndicators.map((risk) => (
                        <tr key={risk.selectorReference} className="govuk-table__row">
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                          <td className="govuk-table__cell">TODO</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </>
          ),
        }
      );
    })}
  />
);

const TaskManagementForm = ({ camundaClient, onCancel, taskId, keycloak, ...props }) => (
  <RenderForm
    onCancel={() => onCancel(false)}
    onSubmit={async (data, form) => {
      const { versionId, id, title, name } = form;
      await camundaClient.post(`/task/${taskId}/submit-form`, {
        variables: {
          targetInformationSheet: {
            value: JSON.stringify({
              actionTarget: false,
              form: {
                formVersionId: versionId,
                formId: id,
                title,
                name,
                submissionDate: new Date(),
                submittedBy: keycloak.tokenParsed.email,
              },
              ...data.data,
            }),
            type: 'Json',
          },
        },
      });
    }}
    {...props}
  />
);

const TaskCompletedSuccessMessage = ({ message }) => (
  <>
    <Panel title={message} />
    <p className="govuk-body">We have sent your request to the relevant team.</p>
    <h2 className="govuk-heading-m">What happens next</h2>
    <p className="govuk-body">The task is now paused pending a response.</p>
    <Link to="/tasks" className="govuk-button" data-module="govuk-button">
      Finish
    </Link>
  </>
);

const NotesForm = ({ camundaClient, taskId }) => (
  <>
    <h2 className="govuk-heading-m">Notes</h2>
    <RenderForm
      formName="noteCerberus"
      onSubmit={async ({ data: { note } }) => {
        await camundaClient.post(`/task/${taskId}/comment/create`, {
          message: note,
        });
      }}
    />
  </>
);

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [error, setError] = useState(null);
  const [taskVersions, setTaskVersions] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const assignee = taskVersions?.[0]?.assignee;
  const currentUserIsOwner = assignee === currentUser;
  const [isDismissFormOpen, setDismissFormOpen] = useState();
  const [isCompleteFormOpen, setCompleteFormOpen] = useState();
  const source = axios.CancelToken.source();

  useEffect(() => {
    const loadTask = async () => {
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

        const parsedTaskVariables = variableInstanceResponse.data
          .filter((t) => t.type === 'Json')
          .reduce((acc, camundaVar) => {
            acc[camundaVar.name] = JSON.parse(camundaVar.value);
            return acc;
          }, {});
        setTaskVersions([{
          ...taskResponse.data,
          ...parsedTaskVariables,
        }]);
      } catch (e) {
        setError(e.response.status === 404 ? "Task doesn't exist." : e.message);
        setTaskVersions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  const getAssignee = () => {
    if (!assignee) {
      return 'Unassigned';
    }
    if (currentUserIsOwner) {
      return 'Assigned to you';
    }
    return `Assigned to ${assignee}`;
  };

  return (
    <>
      {error && <ErrorSummary title={error} />}

      {taskVersions.length > 0 && (
        <>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-xl">{taskVersions[0].taskSummary?.businessKey}</span>
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-0">Task details</h1>
              <p className="govuk-body">
                {getAssignee()}
                <ClaimButton assignee={assignee} taskId={taskId} setError={setError} />
              </p>
            </div>

            <div className="govuk-grid-column-one-half task-actions--buttons">
              <Button className="govuk-!-margin-right-1">Issue target</Button>
              {currentUserIsOwner && (
                <>
                  <Button
                    className="govuk-button--secondary govuk-!-margin-right-1"
                    onClick={() => setCompleteFormOpen(true)}
                  >
                    Assessment complete
                  </Button>
                  <Button
                    className="govuk-button--warning"
                    onClick={() => setDismissFormOpen(true)}
                  >
                    Dismiss
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              {isDismissFormOpen && (
                <TaskManagementForm
                  formName="dismissTarget"
                  camundaClient={camundaClient}
                  onCancel={() => setDismissFormOpen(false)}
                  taskId={taskVersions[0].id}
                  keycloak={keycloak}
                >
                  <TaskCompletedSuccessMessage message="Task has been dismissed" />
                </TaskManagementForm>
              )}
              {isCompleteFormOpen && (
                <TaskManagementForm
                  formName="assessmentComplete"
                  camundaClient={camundaClient}
                  onCancel={() => setCompleteFormOpen(false)}
                  taskId={taskVersions[0].id}
                  keycloak={keycloak}
                >
                  <TaskCompletedSuccessMessage message="Task has been completed" />
                </TaskManagementForm>
              )}
              {!isDismissFormOpen && !isCompleteFormOpen && (
                <TaskVersions taskVersions={taskVersions} />
              )}
            </div>

            <div className="govuk-grid-column-one-third">
              {currentUserIsOwner && (
                <NotesForm
                  camundaClient={camundaClient}
                  setDismissFormOpen={setDismissFormOpen}
                  taskId={taskVersions[0].id}
                />
              )}

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
      )}
    </>
  );
};

export default TaskDetailsPage;
