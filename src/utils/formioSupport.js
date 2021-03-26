import FormioUtils from 'formiojs/utils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import qs from 'querystring';
import useAxiosInstance from './axiosInstance';
import config from '../config';
import { useKeycloak } from './keycloak';

export const interpolate = (form, data) => {
  FormioUtils.eachComponent(
    form.components,
    (component) => {
      if (component.type === 'file' && component.url !== '') {
        component.url = FormioUtils.interpolate(component.url, {
          data,
        });
      }
      if (component.type === 'select' && component.data.url !== '') {
        component.data.url = FormioUtils.interpolate(component.data.url, {
          data,
        });
      }
      component.label = FormioUtils.interpolate(component.label, {
        data,
      });
      if (component.type === 'content') {
        component.html = FormioUtils.interpolate(component.html, {
          data,
        });
      }
      if (component.type === 'htmlelement') {
        component.content = FormioUtils.interpolate(component.content, {
          data,
        });
      }
      if (component.defaultValue) {
        component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
          data,
        });
      }
      if (component.customDefaultValue && component.customDefaultValue !== '') {
        component.defaultValue = FormioUtils.evaluate(
          component.customDefaultValue, { data }, 'value',
        );
        component.customDefaultValue = '';
      }
      if (component.calculateValue && component.calculateValue !== '') {
        component.defaultValue = FormioUtils.evaluate(
          component.calculateValue, { data }, 'value',
        );
        component.calculateValue = '';
      }
    },
    true,
  );
};

export const augmentRequest = (keycloak) => ({
  priority: 0,
  async preRequest(requestArgs) {
    if (!requestArgs.opts) {
      requestArgs.opts = {};
    }
    if (!requestArgs.opts.header) {
      requestArgs.opts.header = new Headers();
      if (requestArgs.method !== 'upload') {
        requestArgs.opts.header.set('Accept', 'application/json');
        requestArgs.opts.header.set('Content-type', 'application/json; charset=UTF-8');
      } else {
        requestArgs.opts.header.set('Content-type', requestArgs.file.type);
      }
    }
    let { token } = keycloak;
    const isExpired = jwtDecode(token).exp < new Date().getTime() / 1000;
    if (isExpired) {
      const response = await axios({
        method: 'POST',
        url: `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          grant_type: 'refresh_token',
          client_id: keycloak.clientId,
          refresh_token: keycloak.refreshToken,
        }),
      });
      token = response.data.access_token;
    }

    requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
    if (!requestArgs.url) {
      requestArgs.url = '';
    }
    return Promise.resolve(requestArgs);
  },
});

export const useFormSubmit = () => {
  const camundaClient = useAxiosInstance(config.camundaApiUrl);
  const keycloak = useKeycloak();

  return async (processKey, businessKey, form, submission, onError) => {
    const { versionId, id, title, name } = form;
    const variables = {
      [name]: {
        value: JSON.stringify({
          ...submission.data,
          formVersionId: versionId,
          formId: id,
          title,
          name,
          submissionDate: new Date(),
          submittedBy: keycloak.tokenParsed.email,
        }),
        type: 'json',
      },
      initiatedBy: {
        value: keycloak.tokenParsed.email,
        type: 'string',
      },
    };
    try {
      await camundaClient.post(`/process-definition/key/${processKey}/submit-form`, {
        variables,
        businessKey,
      });
    } catch (e) {
      onError(e);
    }
  };
};
