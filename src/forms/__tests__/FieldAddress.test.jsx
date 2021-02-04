import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FieldAddress from '../FieldAddress';
import Form from '../Form';

test('renders all the address fields', () => {
  render(<Form><FieldAddress name="testAddress" /></Form>);
  expect(screen.getByLabelText('Address line 1')).toBeInTheDocument();
  expect(screen.getByLabelText('Address line 2 (optional)')).toBeInTheDocument();
  expect(screen.getByLabelText('Address line 3 (optional)')).toBeInTheDocument();
  expect(screen.getByLabelText('Town or city')).toBeInTheDocument();
  expect(screen.getByLabelText('Postcode')).toBeInTheDocument();
  expect(screen.getByLabelText('County (optional)')).toBeInTheDocument();
});

test('validates the required fields', () => {
  render(<Form><FieldAddress name="testAddress" /><button>Submit</button></Form>);
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('alert')).toHaveTextContent(
    'There is a problem'
    + 'Enter the first line of the address'
    + 'Enter town or city'
    + 'Enter postcode',
  );
});

test('sets the form values', () => {
  render(
    <Form>{({ values }) => (
      <>
        <FieldAddress name="testAddress" />
        <span data-testid="values">{JSON.stringify(values)}</span>
      </>
    )}
    </Form>,
  );
  const type = (label, text) => fireEvent.input(screen.getByLabelText(label), {
    target: { value: text },
  });
  type('Address line 1', 'line 1');
  type('Address line 2 (optional)', 'line 2');
  type('Address line 3 (optional)', 'line 3');
  type('Town or city', 'town');
  type('Postcode', 'se1 123');
  type('County (optional)', 'county');
  expect(screen.getByTestId('values').textContent).toEqual(JSON.stringify({
    'testAddress.line1': 'line 1',
    'testAddress.line2': 'line 2',
    'testAddress.line3': 'line 3',
    'testAddress.city': 'town',
    'testAddress.postcode': 'se1 123',
    'testAddress.county': 'county',
  }));
});
