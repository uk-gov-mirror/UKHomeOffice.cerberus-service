import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Form from '../forms/Form';
import FieldInput from '../forms/FieldInput';
import FormStep from '../forms/FormStep';
import FormBack from '../forms/FormBack';
import FormProgress from '../forms/FormProgress';
import Button from '../govuk/Button';
import SecondaryButton from '../govuk/SecondaryButton';
import FormActions from '../forms/FormActions';
import Panel from '../govuk/Panel';
import FieldRadios from '../forms/FieldRadios';
import FieldAddress from '../forms/FieldAddress';
import FieldAutocomplete from '../forms/FieldAutocomplete';
import Details from '../govuk/Details';
import FieldDateTime from '../forms/FieldDateTime';
import FieldTextarea from '../forms/FieldTextarea';
import FieldCheckboxes from '../forms/FieldCheckboxes';

const IssueTargetPage = () => {
  const history = useHistory();

  const dummyOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
    { label: 'Option D', value: 'd' },
    { label: 'Option E', value: 'e' },
    { label: 'Option F', value: 'f' },
  ];

  const [success, setSuccess] = useState(false);

  if (success) {
    return <Panel title="Form submitted">Thank you for submitting the target information sheet.</Panel>;
  }

  return (
    <Form
      id="target-sheet-form"
      onSubmit={async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 2000);
        });
      }}
      onSuccess={() => setSuccess(true)}
      onCancel={() => history.push('/')}
    >
      {({ values, isLastStep, cancel }) => (
        <>
          <FormBack />
          <FormProgress />

          <h1 className="govuk-heading-xl">Issue a target</h1>

          <FormStep name="basic2">
            <h2 className="govuk-heading-m">General Target Information</h2>

            <FieldCheckboxes
              legend="Details are available for (optional)"
              name="detailsOf"
              items={[
                { label: 'Consignor', value: 'consignor' },
                { label: 'Consignee', value: 'consignee' },
                { label: 'Haulier', value: 'haulier' },
              ]}
            />

            <FieldTextarea
              label="Comments on reason for selection (optional)"
              hint="Provide as much useful information as possible. This target will be sent to a frontline team for interdiction."
              name="selectionReasoning"
            />

            <FieldAutocomplete
              label="Issuing hub (optional)"
              name="issuingHub"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Target category"
              name="category"
              required="Select target category"
              options={dummyOptions}
            />

            <FieldAutocomplete
              label="Port"
              name="eventPort"
              required="Select port"
              options={dummyOptions}
              hint="The port that the target is scheduled to arrive at"
            />

            <FieldInput
              label="Operation name (optional)"
              name="operation"
              formGroup={{
                suffix: (
                  <Details
                    summary="How to find the port from the dropdown list"
                    className="govuk-!-margin-top-2"
                  >
                    To search for a port, enter the first three letters in the search bar of the dropdown list.
                    This will filter the list based on those letters
                  </Details>
                ),
              }}
            />

            <FieldAutocomplete
              isMulti
              label="Threat indicators"
              name="threatIndicators"
              required="Select thread indicators"
              options={dummyOptions}
              hint="The port that the target is scheduled to arrive at"
            />

            <FieldRadios
              legend="What type of RoRo movement is this?"
              name="roroFreightType"
              required="Chose RoRo movement type"
              inline
              items={[
                { label: 'Accompanied', value: 'accompanied' },
                { label: 'Unaccompanied', value: 'unaccompanied' },
              ]}
            />

            <h2 className="govuk-heading-m">Interception details</h2>

            <FieldInput
              label="Vessel name (optional)"
              name="vessel.name"
            />

            <FieldInput
              label="Shipping company (optional)"
              name="vessel.company"
            />

            <FieldDateTime
              legend="Estimated date and time of arrival"
              required="Enter the estimated date and time of arrival"
              name="exampleDate"
              showTime
            />

            <h2 className="govuk-heading-m">Consignee details</h2>

            <FieldAddress label="address" name="address" />
          </FormStep>

          <pre>
            <code>
              {JSON.stringify(values, 0, 2)}
            </code>
          </pre>

          <FormActions>
            <Button>{isLastStep() ? 'Submit' : 'Save and continue'}</Button>
            <SecondaryButton onClick={(e) => { e.preventDefault(); cancel(); }}>Cancel</SecondaryButton>
          </FormActions>
        </>
      )}
    </Form>
  );
};

export default IssueTargetPage;
