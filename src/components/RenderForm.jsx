import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Formio } from 'react-formio';
import gds from '@ukhomeoffice/formio-gds-template/lib';
import { isEmpty } from 'lodash';

import config from '../config';
import useAxiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../forms/LoadingSpinner';
import { useKeycloak } from '../utils/keycloak';
import { augmentRequest } from '../utils/formioSupport';
import ErrorSummary from '../govuk/ErrorSummary';

Formio.use(gds);

const RenderForm = ({ formName, onSubmit, onCancel, children, alterForm = () => {} }) => {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [formIsLoading, setFormIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const keycloak = useKeycloak();
  const formApiClient = useAxiosInstance(keycloak, config.formApiUrl);

  alterForm(form);

  Formio.plugins = [augmentRequest(keycloak)];

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadForm = async () => {
      try {
        const formResponse = await formApiClient.get(`/form/name/${formName}`);
        setForm(formResponse.data);
      } catch (e) {
        setForm(null);
        setError(e.message);
      } finally {
        setFormIsLoading(false);
      }
    };

    loadForm();
    return () => {
      source.cancel('Cancelling request');
    };
  }, []);

  if (submitted && children) {
    return children;
  }

  return (
    <>
      <LoadingSpinner loading={formIsLoading}>
        {error && (
          <ErrorSummary
            title="There is a problem"
            errorList={[
              { children: error },
            ]}
          />
        )}
        {!isEmpty(form) && (
          <Form
            form={form}
            onSubmit={async (data) => {
              setFormIsLoading(true);
              try {
                await onSubmit(data, form);
                setSubmitted(true);
              } catch (e) {
                setError(e.message);
              } finally {
                setFormIsLoading(false);
              }
            }}
            options={{
              hooks: {
                beforeCancel: async () => {
                  if (onCancel) {
                    await onCancel();
                  } else {
                    history.go(0);
                  }
                },
              },
            }}
          />
        )}
      </LoadingSpinner>
    </>
  );
};

export default RenderForm;
