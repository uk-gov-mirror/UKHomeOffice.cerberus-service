import React from 'react';
import { isEmpty } from 'lodash';

import config from '../config';
import { useKeycloak } from '../utils/keycloak';
import { interpolate, useFormSubmit } from '../utils/formioSupport';
import RenderForm from '../components/RenderForm';
import Panel from '../govuk/Panel';

const IssueTargetPage = () => {
  const submitForm = useFormSubmit();
  const keycloak = useKeycloak();

  return (
    <RenderForm
      formName="targetInformationSheet"
      alterForm={(form) => {
        if (!isEmpty(form)) {
          interpolate(form, {
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
        }
      }}
      onSubmit={async (data, form) => {
        await submitForm(
          'assignTarget',
          data.data.businessKey,
          form,
          data,
        );
      }}
    >
      <Panel title="Thank you for submitting the target information sheet." />
    </RenderForm>
  );
};

export default IssueTargetPage;
