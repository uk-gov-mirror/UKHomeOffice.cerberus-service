import React from 'react';

import { FormContext } from './formContext';
import useForm from './useForm';
import LoadingSpinner from './LoadingSpinner';
import FormErrors from './FormErrors';

const Form = ({
  id,
  defaultValues = {},
  onSubmit = null,
  onSuccess = null,
  onCancel = null,
  scrollToTop = true,
  showErrorSummary = true,
  children = null,
}) => {
  const formInstance = useForm({
    id,
    defaultValues,
    onSubmit,
    onSuccess,
    onCancel,
    scrollToTop,
  });

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(formInstance);
    }
    return children;
  };

  return (
    <FormContext.Provider value={formInstance}>
      <form
        id={id}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          formInstance.goForward();
        }}
      >
        <LoadingSpinner loading={formInstance.isLoading}>
          {showErrorSummary && <FormErrors />}
          {renderChildren()}
        </LoadingSpinner>
      </form>
    </FormContext.Provider>
  );
};

export default Form;
