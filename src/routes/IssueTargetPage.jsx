import React from 'react';
import Form from '../forms/Form';
import FieldInput from '../forms/FieldInput';

const IssueTargetPage = () => {
  return (
    <Form
      id="issue-target"
      onSubmit={async () => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 2000)
        });
      }}
    >
      <FieldInput name="test" type="text" label="Test input" required="Type some text" />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default IssueTargetPage;
