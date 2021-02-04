import { isEmpty } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const requireValue = (errorMessage) => (value) => {
  const isPrimitiveValue = value !== Object(value);
  if (isPrimitiveValue) {
    return !value || isEmpty(String(value).trim()) ? errorMessage : null;
  }
  if (value instanceof Object) {
    return !Object.values(value).some(Boolean) ? errorMessage : null;
  }
  return isEmpty(value) ? errorMessage : null;
};
