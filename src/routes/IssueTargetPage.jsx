import React from 'react';
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

const IssueTargetPage = () => {
  const history = useHistory();

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
      onCancel={() => history.push('/')}
    >
      {({ isLastStep, cancel }) => (
        <>
          <FormBack />
          <FormProgress />

          <h1 className="govuk-heading-xl">Issue a target</h1>

          <FormStep name="one">
            <h2 className="govuk-heading-m">General Target Information</h2>

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
            TODO
          </FormStep>

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
