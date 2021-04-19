import React from 'react';

import { useFormSubmit } from '../utils/formioSupport';
import RenderForm from '../components/RenderForm';
import Panel from '../govuk/Panel';

const IssueTargetPage = () => {
  const submitForm = useFormSubmit();

  return (
    <RenderForm
      formName="targetInformationSheet"
      onSubmit={async (data, form) => {
        await submitForm(
          'assignTarget',
          data.data.businessKey,
          form,
          data,
        );
      }}
    >
      <Panel title="Thank you for submitting the target information sheet." />
    </RenderForm>
  );
};

export default IssueTargetPage;
