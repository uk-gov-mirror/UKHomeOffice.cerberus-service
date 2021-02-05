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
import FieldSelect from '../forms/FieldSelect';
import Panel from '../govuk/Panel';
import FieldRadios from '../forms/FieldRadios';
import FieldAddress from '../forms/FieldAddress';
import FieldAutocomplete from '../forms/FieldAutocomplete';
import Details from '../govuk/Details';

const IssueTargetPage = () => {
  const history = useHistory();

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

          <FormStep name="one">
            <h2 className="govuk-heading-m">General Target Information</h2>

            <FieldAddress name="testAddress" />

            <FieldAutocomplete
              label="Test autocomplete"
              required="Type something to the autocomplete field"
              name="testAutocomplete"
              isMulti
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
                { label: 'Option D', value: 'd' },
                { label: 'Option E', value: 'e' },
                { label: 'Option F', value: 'f' },
              ]}
            />

            <FieldInput
              label="Operation name"
              name="operation"
              required="Type operation name"
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

            <FieldInput name="test" type="text" label="Test input" />
            <FieldSelect
              name="testSelect"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
              ]}
            />
          </FormStep>

          <FormStep name="two">
            <h2 className="govuk-heading-m">Second step</h2>

            <FieldInput name="test2" type="text" label="Test input 2" />
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
