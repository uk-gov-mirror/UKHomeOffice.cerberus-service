import React from 'react';

import { FormContext } from './formContext';
import useForm from '../forms/useForm';
import LoadingSpinner from './LoadingSpinner';

function Form({
  initialValues = {},
  onSubmit = null,
  scrollToTop = true,
  children = null,
}) {
  const formInstance = useForm({
    initialValues: initialValues,
    onSubmit: onSubmit,
    scrollToTop: scrollToTop,
  });

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(formInstance)
    }
    return children
  }

  return (
    <FormContext.Provider value={formInstance}>
      <form
        noValidate={true}
        onSubmit={(e) => {
          e.preventDefault()
          formInstance.goForward()
        }}
      >
        <LoadingSpinner loading={formInstance.isLoading}>
          {renderChildren()}
        </LoadingSpinner>
      </form>
    </FormContext.Provider>
  )
}

export default Form
