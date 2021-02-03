import React, { useEffect } from 'react';

import { useFormContext } from './formContext';
import FormActions from './FormActions';
import Button from '../govuk/Button';
import SecondaryButton from '../govuk/SecondaryButton';

const FormStep = ({
  name, backButton = null, forwardButton = null, cancelButton = null, children,
}) => {
  const {
    cancel,
    currentStep,
    goBack,
    registerStep,
    deregisterStep,
    getStepIndex,
    isFirstStep,
    values,
    setValues,
  } = useFormContext();

  useEffect(() => {
    registerStep(name);
    return () => deregisterStep(name);
  }, [name]);

  // Preserve form values between steps.
  useEffect(() => {
    setValues(values);
  }, [currentStep]);

  const index = getStepIndex(name);

  if (index !== currentStep) {
    return null;
  }

  const renderBackButton = () => {
    if (typeof backButton === 'string') {
      return (
        <SecondaryButton name="back" onClick={goBack}>
          {backButton}
        </SecondaryButton>
      );
    }

    return backButton;
  };

  const renderForwardButton = () => {
    if (typeof forwardButton === 'string') {
      return <Button name="forward">{forwardButton}</Button>;
    }

    return forwardButton;
  };

  const renderCancelButton = () => {
    if (typeof cancelButton === 'string') {
      return <Button name="cancel" onClick={cancel}>{cancelButton}</Button>;
    }

    return cancelButton;
  };

  return (
    <>
      {children}

      <FormActions>
        {renderForwardButton()}
        {!isFirstStep() && renderBackButton()}
        {renderCancelButton()}
      </FormActions>
    </>
  );
};

export default FormStep;
