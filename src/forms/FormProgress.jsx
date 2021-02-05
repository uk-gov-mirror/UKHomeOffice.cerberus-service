import React from 'react';
import { useFormContext } from './formContext';

const FormProgress = () => {
  const { currentStep, steps } = useFormContext();

  if (steps.length === 1) {
    return null;
  }

  return (
    <span className="govuk-caption-xl">
      Page {currentStep + 1} of {steps.length}
    </span>
  );
};

export default FormProgress;
