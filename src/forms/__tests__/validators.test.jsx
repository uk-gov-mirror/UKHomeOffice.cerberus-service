import { requireValue } from '../validators';

test('requireValue() validates', () => {
  expect(requireValue('test')('')).toBeTruthy();
  expect(requireValue('test')(' ')).toBeTruthy();
  expect(requireValue('test')([])).toBeTruthy();
  expect(requireValue('test')({})).toBeTruthy();
  expect(requireValue('test')({ empty: '', obj: '' })).toBeTruthy();

  expect(requireValue('test')(1)).toBeFalsy();
  expect(requireValue('test')('value')).toBeFalsy();
  expect(requireValue('test')(['value'])).toBeFalsy();
  expect(requireValue('test')({ not: 'empty', obj: '' })).toBeFalsy();
});
