import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formio, Form } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template/lib';

import config from '../config';
import Panel from '../govuk/Panel';
import useAxiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../forms/LoadingSpinner';
import { useKeycloak } from '../utils/keycloak';
import { augmentRequest, interpolate } from '../utils/formioSupport';

Formio.use(gds);

const IssueTargetPage = () => {
  const formId = '59ae1bdd-f2a5-475a-ad5f-4b5cd4cd0a95';
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    isLoading: true,
    data: null,
  });
  const host = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ''
  }`;

  const keycloak = useKeycloak();
  const axiosInstance = useAxiosInstance(config.formApiUrl);

  Formio.baseUrl = host;
  Formio.projectUrl = host;
  Formio.plugins = [augmentRequest(keycloak)];

  useEffect(() => {
    const source = axios.CancelToken.source();

    const loadForm = async () => {
      if (axiosInstance) {
        try {
          const formResponse = await axiosInstance.get(`/form/${formId}`);
          setForm({
            isLoading: false,
            data: formResponse.data,
          });
        } catch (e) {
          setForm({
            isLoading: false,
            data: null,
          });
        }
      }
    };

    loadForm();
    return () => {
      source.cancel('Cancelling request');
    };
  }, [formId, axiosInstance]);

  if (success) {
    return <Panel title="Form submitted">Thank you for submitting the target information sheet.</Panel>;
  }

  if (form.isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  interpolate(form.data, {
    keycloakContext: {
      accessToken: keycloak.token,
      refreshToken: keycloak.refreshToken,
      sessionId: keycloak.tokenParsed.session_state,
      email: keycloak.tokenParsed.email,
      givenName: keycloak.tokenParsed.given_name,
      familyName: keycloak.tokenParsed.family_name,
      subject: keycloak.subject,
      url: keycloak.authServerUrl,
      realm: keycloak.realm,
      roles: keycloak.tokenParsed.realm_access.roles,
      groups: keycloak.tokenParsed.groups,
    },
    environmentContext: {
      referenceDataUrl: config.refdataApiUrl,
    },
  });

  return (
    <Form
      form={form.data}
      onSubmit={() => {
        setSuccess(true);
      }}
    />
  );
};

export default IssueTargetPage;
