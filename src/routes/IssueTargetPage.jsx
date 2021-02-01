import React from 'react';
import Form from '../forms/Form';
import FieldInput from '../forms/FieldInput';

const IssueTargetPage = () => {
  return (
    <Form
      onSubmit={async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 2000)
        });
      }}
    >
      <FieldInput name="test" type="text" />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default IssueTargetPage;
