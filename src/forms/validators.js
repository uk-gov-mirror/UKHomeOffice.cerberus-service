import { isEmpty } from 'lodash';

export const LONG_DATE_PATTERN = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;
export const SHORT_DATE_PATTERN = /^(\d{4})(\/|-)(\d{1,2})$/;

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

export const validShortDate = (errorMessage) => (value = {}) => {
  const { year, month } = value;
  return (!year && !month) || `${year}/${month}`.match(SHORT_DATE_PATTERN) ? null : errorMessage;
};

export const validLongDate = (errorMessage) => (value = {}) => {
  const { year, month, day } = value;
  return (!year && !month && !day) || `${year}/${month}/${day}`.match(LONG_DATE_PATTERN) ? null : errorMessage;
};
