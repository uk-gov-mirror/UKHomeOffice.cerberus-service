import React from 'react';
import { useFormContext } from './formContext';

const FormBack = () => {
  const { isFirstStep, goBack } = useFormContext();
  return !isFirstStep() && (
    <a
      href="#back"
      onClick={(e) => {
        e.preventDefault();
        goBack();
      }}
      className="govuk-back-link"
    >
      Back
    </a>
  );
};

export default FormBack;
