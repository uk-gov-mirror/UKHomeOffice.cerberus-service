import React from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import * as pluralise from 'pluralise';

import tasks from './__fixtures__/tasks';
import Tabs from '../govuk/Tabs';
import Accordion from '../govuk/Accordion';
import Button from '../govuk/Button';
import { LONG_DATE_FORMAT } from '../constants';

import './__assets__/TaskDetailsPage.scss';

const VersionsTab = ({ task }) => (
  <>
    <h2 className="govuk-heading-l govuk-!-margin-bottom-0">Details</h2>
    <Accordion
      className="task-versions"
      id="task-versions"
      items={task.versions.slice(0).reverse().map((taskVersion, index) => (
        {
          heading: `Version ${task.versions.length - index}`,
          summary: (
            <>
              <div className="task-versions--left">
                <div className="govuk-caption-m">{moment(taskVersion.updated).format(LONG_DATE_FORMAT)}</div>
              </div>
              <div className="task-versions--right">
                <ul className="govuk-list">
                  <li>{pluralise.withCount(taskVersion.changes, '% change', '% changes', 'No changes')} in this version</li>
                  <li>Highest threat level is <strong className="govuk-tag govuk-tag--red">Tier 1</strong> from version 1</li>
                </ul>
              </div>
            </>
          ),
          children: (
            <>
              <h3 className="govuk-heading-s govuk-!-margin-0">Description</h3>
              <p className="govuk-body">{taskVersion.description}</p>

              <h3 className="govuk-heading-s govuk-!-margin-0">Consignor</h3>
              <p className="govuk-body">{taskVersion.consignor?.name}</p>

              <h3 className="govuk-heading-s govuk-!-margin-0">Consignor address</h3>
              <p className="govuk-body">{taskVersion.consignor?.address}</p>

              <h3 className="govuk-heading-s govuk-!-margin-0">Consignee</h3>
              <p className="govuk-body">{taskVersion.consignee?.name}</p>

              <h3 className="govuk-heading-s govuk-!-margin-0">Consignee address</h3>
              <p className="govuk-body">{taskVersion.consignee?.address}</p>

              <table className="govuk-table">
                <caption className="govuk-table__caption govuk-heading-s">Consignment</caption>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">MAWB</th>
                    <th scope="col" className="govuk-table__header">Country of origin</th>
                    <th scope="col" className="govuk-table__header">Mode</th>
                    <th scope="col" className="govuk-table__header">Carrier</th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">
                      <span className="task-versions--highlight">{taskVersion.consignment.mawb}</span>
                    </td>
                    <td className="govuk-table__cell" />
                    <td className="govuk-table__cell">{taskVersion.consignment.mode}</td>
                    <td className="govuk-table__cell">{taskVersion.consignment.carrier}</td>
                  </tr>
                </tbody>
              </table>

              <table className="govuk-table">
                <caption className="govuk-table__caption govuk-heading-s">
                  Consignment
                </caption>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">HAWB</th>
                    <th scope="col" className="govuk-table__header">Weight</th>
                    <th scope="col" className="govuk-table__header">Number of pieces</th>
                    <th scope="col" className="govuk-table__header">Value of shipment</th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">{taskVersion.consignment.hawb}</td>
                    <td className="govuk-table__cell">{taskVersion.consignment.weight}</td>
                    <td className="govuk-table__cell">
                      <span className="task-versions--highlight">{taskVersion.consignment.numberOfPieces}</span>
                    </td>
                    <td className="govuk-table__cell">£{taskVersion.consignment.shipmentValue}</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="govuk-heading-s govuk-!-margin-0">Rule match</h3>
              <p className="govuk-body">Rule name / Threat / Abuse type</p>
            </>
          ),
        }
      ))}
    />
  </>
);

const ActionsTab = () => (
  <div>--- Here will be a form ---</div>
);

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const task = tasks.find(({ movementId }) => movementId === taskId);
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <span className="govuk-caption-xl">{task.movementId}</span>
          <h1 className="govuk-heading-xl">Task details</h1>
        </div>
        <div className="govuk-grid-column-two-thirds task-actions--buttons">
          <Button className="govuk-!-margin-right-1">Issue target</Button>
          <Button className="govuk-button--secondary govuk-!-margin-right-1">Assessment complete</Button>
          <Button className="govuk-button--warning">Dismiss</Button>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <Tabs
            title="Details"
            id="task-details"
            items={[
              {
                id: 'details',
                label: 'Details',
                panel: <VersionsTab task={task} />,
              },
              { id: 'actions', label: 'Actions', panel: <ActionsTab task={task} /> },
            ]}
          />
        </div>
        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-m">Notes</h2>

          --- Here will be a form ---

          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          <h3 className="govuk-heading-m">Activity</h3>

          {task.activity.map((activity) => (
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
