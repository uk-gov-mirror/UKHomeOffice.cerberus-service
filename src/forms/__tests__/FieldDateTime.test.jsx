import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from '../Form';
import FieldDateTime from '../FieldDateTime';

const type = (label, text) => fireEvent.input(screen.getByLabelText(label), {
  target: { value: text },
});

test('renders long date field', () => {
  render(<Form><FieldDateTime name="testDate" /></Form>);
  expect(screen.getByLabelText('Day')).toBeInTheDocument();
  expect(screen.getByLabelText('Month')).toBeInTheDocument();
  expect(screen.getByLabelText('Year')).toBeInTheDocument();
});

test('renders short date field', () => {
  render(<Form><FieldDateTime isShort name="testDate" /></Form>);
  expect(screen.queryByLabelText('Day')).toBeNull();
  expect(screen.getByLabelText('Month')).toBeInTheDocument();
  expect(screen.getByLabelText('Year')).toBeInTheDocument();
});

test('validates when the field is required but empty', () => {
  render(
    <Form>
      <FieldDateTime required="Date is required" name="testDate" />
      <button>Submit</button>
    </Form>,
  );
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('alert')).toHaveTextContent('Date is required');
});

test('validates long date', () => {
  render(
    <Form>
      <FieldDateTime name="testDate" />
      <button>Submit</button>
    </Form>,
  );

  type('Day', 1);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid date');

  type('Month', 12);
  type('Year', 2021);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.queryByRole('alert')).toBeNull();
});

test('validates short date', () => {
  render(
    <Form>
      <FieldDateTime isShort name="testDate" />
      <button>Submit</button>
    </Form>,
  );

  type('Month', 12);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid date');

  type('Year', 2021);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.queryByRole('alert')).toBeNull();
});

test('sets the form values', () => {
  render(
    <Form>{({ values }) => (
      <>
        <FieldDateTime name="testDate" showTime />
        <span data-testid="values">{JSON.stringify(values)}</span>
      </>
    )}
    </Form>,
  );
  type('Day', 1);
  type('Month', 12);
  type('Year', 2021);
  type('Hour', 23);
  type('Minute', 15);
  expect(screen.getByTestId('values').textContent).toEqual(JSON.stringify({
    testDate: {
      day: '1',
      month: '12',
      year: '2021',
      hour: '23',
      minute: '15',
    },
  }));
});
