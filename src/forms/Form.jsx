import React from 'react';

import { FormContext } from '../forms/formContext';
import useForm from '../forms/useForm';

const LoadingBox = ({ loading, children }) => (loading ? <div>Loading...</div> : children);

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
        <LoadingBox loading={formInstance.isLoading}>
          {renderChildren()}
        </LoadingBox>
      </form>
    </FormContext.Provider>
  )
}

export default Form
