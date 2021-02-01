import React, { useRef } from 'react';

import { FormContext } from './formContext';
import useForm from '../forms/useForm';
import LoadingSpinner from './LoadingSpinner';

const Form = ({
  id,
  defaultValues = {},
  onSubmit = null,
  onSuccess = null,
  onCancel = null,
  scrollToTop = true,
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
  }

  return (
    <FormContext.Provider value={formInstance}>
      <form
        id={id}
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault()
          formInstance.goForward();
        }}
      >
        <LoadingSpinner loading={formInstance.isLoading}>
          {renderChildren()}
        </LoadingSpinner>
      </form>
    </FormContext.Provider>
  );
};

export default Form;
