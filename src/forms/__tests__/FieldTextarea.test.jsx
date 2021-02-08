import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Form from '../Form';
import FieldTextarea from '../FieldTextarea';

test('validates when required', () => {
  render(
    <Form>
      <FieldTextarea name="testTextarea" required="Test error" />
      <button>Submit</button>
    </Form>,
  );
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('alert')).toHaveTextContent('Test error');
});

test('sets the form values', () => {
  render(
    <Form>{({ values }) => (
      <>
        <FieldTextarea label="Test label" name="testTextarea" />
        <span data-testid="values">{JSON.stringify(values)}</span>
      </>
    )}
    </Form>,
  );
  fireEvent.input(screen.getByLabelText('Test label'), {
    target: { value: 'Some text' },
  });
  expect(screen.getByTestId('values').textContent).toEqual(JSON.stringify({
    testTextarea: 'Some text',
  }));
});
