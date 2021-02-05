import React from 'react';
import Select, { components as comps } from 'react-select';
import AsyncSelect from 'react-select/async';
import classNames from 'classnames';

import './__assets__/Autocomplete.scss';

const CustomOption = ({ data: { label }, ...props }) => (
  <comps.Option {...props}>{label}</comps.Option>
);

export const filterOption = ({ label = '' }, query) => label.toLowerCase().includes(query.toLowerCase());

const Autocomplete = ({
  options, components, error, ...props
}) => {
  const customisedProps = {
    className: classNames('govuk-autocomplete-container', { 'govuk-autocomplete-container--error': error }),
    classNamePrefix: 'govuk-autocomplete',
    components: { CustomOption },
    noOptionsMessage: () => 'No options found',
    filterOption,
    ...props,
  };

  return options
    ? <Select options={options} {...customisedProps} />
    : <AsyncSelect {...customisedProps} />;
};

export default Autocomplete;
