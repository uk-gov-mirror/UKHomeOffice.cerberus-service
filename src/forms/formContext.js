import React, { createContext, useContext } from 'react';

const FormContext = createContext();

const useFormContext = () => useContext(FormContext);

export { FormContext, useFormContext };
