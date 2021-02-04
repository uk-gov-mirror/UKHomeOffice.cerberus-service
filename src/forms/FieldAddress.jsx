import React from 'react';
import FieldInput from './FieldInput';

const FieldAddress = ({ name }) => (
  <>
    <FieldInput
      type="text"
      name={`${name}.line1`}
      label="Address line 1"
      required="Enter the first line of the address"
    />
    <FieldInput
      type="text"
      name={`${name}.line2`}
      label="Address line 2 (optional)"
    />
    <FieldInput
      type="text"
      name={`${name}.line3`}
      label="Address line 3 (optional)"
    />
    <FieldInput
      type="text"
      name={`${name}.city`}
      label="Town or city"
      required="Enter town or city"
    />
    <FieldInput
      type="text"
      name={`${name}.postcode`}
      label="Postcode"
      required="Enter postcode"
      maxLength={10}
    />
    <FieldInput
      type="text"
      name={`${name}.county`}
      label="County (optional)"
    />
  </>
);

export default FieldAddress;
