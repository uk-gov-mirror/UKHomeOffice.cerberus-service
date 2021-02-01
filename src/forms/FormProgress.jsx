import React from 'react';
import { useFormContext } from './formContext';

const FormProgress = () => {
  const{ currentStep, steps } = useFormContext();
  return <span className="govuk-caption-xl">Page {currentStep + 1} of {steps.length}</span>;
};

export default FormProgress;
